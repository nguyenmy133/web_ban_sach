package vn.mynguyen.webbansach_backend.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class OpenAIService {

    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    private final ObjectMapper om = new ObjectMapper();

    @Value("${ai.openai.apiKey}") private String apiKey;
    @Value("${ai.openai.baseUrl:https://api.openai.com/v1}") private String baseUrl;
    @Value("${ai.openai.chatModel:gpt-4o-mini}") private String chatModel;

    public String chat(List<Map<String,String>> messages, double temperature) {
        try {
            String body = om.writeValueAsString(Map.of(
                    "model", chatModel,
                    "messages", messages,
                    "temperature", temperature
            ));

            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/chat/completions"))
                    .timeout(Duration.ofSeconds(60))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());
            if (res.statusCode() / 100 != 2) {
                throw new RuntimeException("Chat HTTP " + res.statusCode() + ": " + res.body());
            }

            JsonNode root = om.readTree(res.body());
            return root.path("choices").get(0).path("message").path("content").asText("");
        } catch (Exception e) {
            throw new RuntimeException("OpenAI chat failed: " + e.getMessage(), e);
        }
    }
}
