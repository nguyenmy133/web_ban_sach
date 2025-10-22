package vn.mynguyen.webbansach_backend.ai.api;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import vn.mynguyen.webbansach_backend.ai.dto.ChatMessage;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatRequest {
    @NotBlank
    private String sessionId;
    @NotBlank
    private String message;
    private Integer topK;
    private List<ChatMessage> history; // optional: FE có thể gửi kèm
}
