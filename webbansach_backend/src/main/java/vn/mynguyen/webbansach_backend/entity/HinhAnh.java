package vn.mynguyen.webbansach_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import jakarta.persistence.Id;

import java.util.List;

@Entity
@Data
@Table(name = "hinh_anh")
public class HinhAnh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="ma_hinh_anh")
    private int maHinhAnh;

    @Column(name="ten_hinh_anh")
    private String tenHinhAnh;

    @Column(name = "la_icon")
    private Boolean laIcon;

    @Column(name = "duong_dan")
    private String duongDan;

    @Column(name = "link")
    private String link;

    @Column(name = "du_lieu_anh", columnDefinition= "LONGTEXT")
    @Lob
    private  String duLieuAnh;

    @ManyToOne(cascade = {CascadeType.DETACH,CascadeType.MERGE,CascadeType.PERSIST,CascadeType.REFRESH})
    @JoinColumn(name = "ma_sach", nullable = false)
    private Sach sach;


}
