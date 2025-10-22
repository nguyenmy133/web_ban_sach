package vn.mynguyen.webbansach_backend.ai.api;

import lombok.*;
import vn.mynguyen.webbansach_backend.ai.dto.SachSearchHit;

import java.util.List;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
public class TimKiemResponse {
    private String query;
    private List<Item> items;

    @Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
    public static class Item {
        private Integer maSach;
        private Double score;
        private String tenSach;
        private String tenTacGia;
        private String url;
        private String snippet;
    }

    public static TimKiemResponse from(String q, List<SachSearchHit> rs, String linkPattern){
        var items = rs.stream().map(r -> Item.builder()
                .maSach(r.getMaSach())
                .score(r.getScore())
                .tenSach(r.getTenSach())
                .tenTacGia(r.getTenTacGia())
                .url(String.format(linkPattern, r.getMaSach()))
                .snippet(snippet(r.getMoTa()))
                .build()
        ).toList();
        return TimKiemResponse.builder().query(q).items(items).build();
    }

    private static String snippet(String d){
        if (d == null) return null;
        d = d.trim();
        return d.length() > 240 ? d.substring(0,240) + "…" : d;
    }
}
