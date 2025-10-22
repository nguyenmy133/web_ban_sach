package vn.mynguyen.webbansach_backend.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "su_danh_gia")
public class SuDanhGia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_danh_gia ")
    private int maDanhGia;

    @Column(name = "diem_xep_hang ")
    private float diemXepHang;

    @Column(name = "nhan_xet ")
    private String nhanXet;

    @ManyToOne(cascade = {CascadeType.DETACH,CascadeType.MERGE,CascadeType.REFRESH,CascadeType.PERSIST})
    @JoinColumn(name = "ma_nguoi_dung",nullable = false)
    private NguoiDung nguoiDung;

    @ManyToOne( cascade = {CascadeType.DETACH,CascadeType.MERGE,CascadeType.REFRESH,CascadeType.PERSIST})
    @JoinColumn(name = "ma_sach",nullable = false)
    private Sach sach;


}
