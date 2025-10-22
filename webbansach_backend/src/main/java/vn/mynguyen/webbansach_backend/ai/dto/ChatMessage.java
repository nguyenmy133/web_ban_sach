package vn.mynguyen.webbansach_backend.ai.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatMessage {
    private String role;    // "user" | "assistant"
    private String content; // nội dung
}
