package vn.mynguyen.webbansach_backend.ai.api;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class TimKiemRequest {
    @NotBlank
    private String q;
    @Min(1)
    private Integer topK;
}
