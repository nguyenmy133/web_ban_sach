package vn.mynguyen.webbansach_backend.ai.dto;

public interface SachSearchHit {
    Integer getMaSach();
    String getTenSach();
    String getTenTacGia();
    String getMoTa();
    Double getScore();
}
