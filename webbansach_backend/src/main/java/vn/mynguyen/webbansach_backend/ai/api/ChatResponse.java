package vn.mynguyen.webbansach_backend.ai.api;

import lombok.*;
import vn.mynguyen.webbansach_backend.ai.dto.ChatMessage;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatResponse {
    private String answer;
    private int retrieved;
    private List<ChatMessage> history;
}
