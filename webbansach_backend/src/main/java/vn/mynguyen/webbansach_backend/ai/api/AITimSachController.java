package vn.mynguyen.webbansach_backend.ai.api;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import vn.mynguyen.webbansach_backend.ai.AiTimSachService;
import vn.mynguyen.webbansach_backend.ai.api.ChatRequest;
import vn.mynguyen.webbansach_backend.ai.api.ChatResponse;
import vn.mynguyen.webbansach_backend.ai.api.TimKiemRequest;
import vn.mynguyen.webbansach_backend.ai.api.TimKiemResponse;
import vn.mynguyen.webbansach_backend.ai.dto.SachSearchHit;

import java.util.List;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AITimSachController {

    private final AiTimSachService service;

    @Value("${app.link.pattern:/sach/%d}")
    private String linkPattern;

    @PostMapping("/search")
    public TimKiemResponse search(@Valid @RequestBody TimKiemRequest req){
        List<SachSearchHit> hits = service.search(req.getQ(), req.getTopK());
        return TimKiemResponse.from(req.getQ(), hits, linkPattern);
    }

    @PostMapping("/chat")
    public ChatResponse chat(@Valid @RequestBody ChatRequest req){
        var history = service.chatConversational(
                req.getSessionId(),
                req.getMessage(),
                req.getTopK(),
                req.getHistory()
        );
        int used = service.search(req.getMessage(), (req.getTopK()!=null?req.getTopK():5)).size();
        String answer = history.isEmpty()? "" : history.get(history.size()-1).getContent();
        return ChatResponse.builder().answer(answer).retrieved(used).history(history).build();
    }

    @GetMapping("/health")
    public Object health(){ return java.util.Map.of("ok", true); }
}
