package vn.mynguyen.webbansach_backend.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import vn.mynguyen.webbansach_backend.ai.dto.ChatMessage;
import vn.mynguyen.webbansach_backend.ai.dto.SachSearchHit;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Dịch vụ AI:
 *  - search(...)             : tìm sách bằng MySQL FULLTEXT
 *  - chatConversational(...) : chat hội thoại (LLM) + RAG (đưa danh sách sách phù hợp vào ngữ cảnh)
 *  - chatSuggestOneShot(...) : gợi ý 1 lượt (tuỳ chọn)
 */
@Service
@RequiredArgsConstructor
public class AiTimSachService {

    private final SachSearchRepository searchRepo; // repo native query MATCH AGAINST
    private final OpenAIService openAI;            // gọi OpenAI Chat Completions
    private final ChatMemory memory;               // lưu lịch sử hội thoại theo sessionId (in-memory)

    @Value("${app.search.topK:8}")
    private int defaultTopK;

    @Value("${app.link.pattern:/sach/%d}")
    private String linkPattern;

    /** Tìm sách theo FULLTEXT trên các cột (vd: ten_sach, mo_ta) */
    public List<SachSearchHit> search(String query, Integer topK) {
        String q = normalize(query);
        int k = (topK != null && topK > 0) ? Math.min(topK, 50) : defaultTopK;
        return searchRepo.searchFulltext(q, PageRequest.of(0, k)).getContent();
    }

    /** Gợi ý 1 lượt (không lưu lịch sử) - tuỳ chọn */
    public String chatSuggestOneShot(String message, Integer topK) {
        int k = (topK != null && topK > 0) ? Math.min(topK, 5) : 5;
        List<SachSearchHit> hits = search(message, k);
        if (hits.isEmpty()) return "Chưa tìm thấy tựa phù hợp. Hãy thêm vài từ khoá nổi bật hoặc mô tả cụ thể hơn.";

        StringBuilder sb = new StringBuilder("Gợi ý dựa trên mô tả của bạn:\n");
        for (SachSearchHit h : hits) {
            sb.append("• ").append(nz(h.getTenSach()) ? h.getTenSach() : "Không rõ tiêu đề");
            if (nz(h.getTenTacGia())) sb.append(" — ").append(h.getTenTacGia());
            sb.append(" — ").append(String.format(linkPattern, h.getMaSach())).append("\n");
        }
        return sb.toString().trim();
    }

    /**
     * Chat hội thoại (LLM) có ngữ cảnh:
     *  1) Cập nhật lịch sử (server hoặc nhận từ FE)
     *  2) FULLTEXT search theo userMessage => tạo 'context' gồm tiêu đề/tác giả/URL/mô tả
     *  3) Gọi OpenAI với system prompt + lịch sử + context
     *  4) Lưu phản hồi trợ lý vào bộ nhớ & trả lịch sử đã cập nhật
     */
    public List<ChatMessage> chatConversational(String sessionId,
                                                String userMessage,
                                                Integer topK,
                                                List<ChatMessage> fromClient) {

        // 1) Nhận lịch sử từ FE (nếu có) hoặc dùng lịch sử đang lưu
        if (fromClient != null && !fromClient.isEmpty()) {
            memory.replace(sessionId, fromClient);
        }
        memory.append(sessionId, ChatMessage.builder().role("user").content(userMessage).build());

        // 2) Tìm sách (RAG)
        int k = (topK != null && topK > 0) ? Math.min(topK, 5) : 5;
        List<SachSearchHit> hits = search(userMessage, k);

        String context = hits.stream().map(h -> {
            String url = String.format(linkPattern, h.getMaSach());
            StringBuilder sb = new StringBuilder();
            sb.append("- ").append(ns(h.getTenSach()));
            if (nz(h.getTenTacGia())) sb.append(" — ").append(h.getTenTacGia());
            sb.append("\n  URL: ").append(url);
            if (nz(h.getMoTa())) sb.append("\n  Mô tả: ").append(trim(h.getMoTa(), 400));
            return sb.toString();
        }).collect(Collectors.joining("\n"));

        // 3) Gọi LLM
        List<Map<String, String>> msgs = new ArrayList<>();
        msgs.add(Map.of(
                "role", "system",
                "content",
                "Bạn là trợ lý gợi ý sách (tiếng Việt). Trả lời ngắn gọn, rõ ràng, dùng markdown. " +
                        "Khi đề xuất, ưu tiên dùng các tựa trong phần 'Ngữ cảnh' dưới đây (nếu có), " +
                        "kèm tiêu đề, tác giả và URL. Nếu người dùng muốn đường link, hãy dùng URL đã cho."
        ));

        for (ChatMessage m : memory.get(sessionId)) {
            msgs.add(Map.of("role", m.getRole(), "content", m.getContent()));
        }

        String userWithContext = userMessage + (context.isBlank() ? "" : ("\n\nNgữ cảnh (các sách phù hợp):\n" + context));
        msgs.add(Map.of("role", "user", "content", userWithContext));

        String answer = openAI.chat(msgs, 0.2); // nhiệt độ thấp → câu trả lời gọn/ổn định
        memory.append(sessionId, ChatMessage.builder().role("assistant").content(answer).build());

        return memory.get(sessionId);
    }

    // ===================== utils =====================
    private static String normalize(String s) { return s == null ? "" : s.replaceAll("\\s+", " ").trim(); }
    private static String ns(String s)        { return s == null ? "" : s; }
    private static boolean nz(String s)       { return s != null && !s.isBlank(); }
    private static String trim(String s, int max) {
        if (s == null) return "";
        return s.length() > max ? s.substring(0, max) + "…" : s;
    }
}
