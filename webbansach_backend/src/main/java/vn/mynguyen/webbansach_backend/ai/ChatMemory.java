package vn.mynguyen.webbansach_backend.ai;

import vn.mynguyen.webbansach_backend.ai.dto.ChatMessage;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatMemory {
    private final Map<String, Deque<ChatMessage>> store = new ConcurrentHashMap<>();
    private final int maxTurns = 14; // tối đa 14 message (user/assistant)

    public List<ChatMessage> get(String sessionId) {
        return new ArrayList<>(store.getOrDefault(sessionId, new ArrayDeque<>()));
    }

    public void append(String sessionId, ChatMessage msg) {
        store.computeIfAbsent(sessionId, k -> new ArrayDeque<>());
        Deque<ChatMessage> dq = store.get(sessionId);
        dq.addLast(msg);
        while (dq.size() > maxTurns) dq.removeFirst();
    }

    public void replace(String sessionId, List<ChatMessage> history) {
        Deque<ChatMessage> dq = new ArrayDeque<>(history);
        while (dq.size() > maxTurns) dq.removeFirst();
        store.put(sessionId, dq);
    }
}
