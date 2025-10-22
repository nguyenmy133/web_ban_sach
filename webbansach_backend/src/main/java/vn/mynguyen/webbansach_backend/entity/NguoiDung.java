package vn.mynguyen.webbansach_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.print.attribute.standard.MediaSize;
import java.util.List;

@Entity
@Data
@Table(name = "nguoi_dung")
public class NguoiDung {

    @Setter
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_nguoi_dung")
    private int maNguoiDung;

    @Column(name = "ho_dem")
    private String hoDem;

    @Column(name = "ten")
    private String ten;

    @Column(name = "ten_dang_nhap")
    private String tenDangNhap;

    @Column(name = "mat_khau")
    private String matKhau;

    @Column(name = "gioi_tinh")
    private String gioiTinh;

    @Column(name = "email")
    private String email;

    @Column(name = "so_dien_thoai")
    private String soDienThoai;

    @Column(name = "dia_chi_mua_hang")
    private String diaChiMuaHang;

    @Column(name = "dia_chi_giao_hang")
    private String diaChiGiaoHang;

    @Getter
    @Setter
    @Column(name = "da-kich-hoat")
    private boolean daKichHoat;

    @Setter
    @Getter
    @Column(name = "ma-kich-hoat")
    private String maKichHoat;

    @Column(name="avatar",columnDefinition = "LONGTEXT")
    @Lob
    private String avatar;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH,CascadeType.MERGE,CascadeType.PERSIST,CascadeType.REFRESH})
    @JoinTable(name="nguoidung_quyen",joinColumns = @JoinColumn(name = "ma_nguoi_dung") ,inverseJoinColumns =@JoinColumn (name="ma_quyen"))
    private List<Quyen> danhSachQuyen;

    @OneToMany(mappedBy = "nguoiDung",fetch = FetchType.LAZY, cascade = {CascadeType.DETACH,CascadeType.MERGE,CascadeType.REFRESH,CascadeType.PERSIST})
    private List<SuDanhGia> danhSachSuDanhGia;

    @OneToMany(mappedBy = "nguoiDung",fetch = FetchType.LAZY, cascade = {CascadeType.DETACH,CascadeType.MERGE,CascadeType.PERSIST,CascadeType.REFRESH})
    private List<SachYeuThich> danhSachSachYeuThich;

    @OneToMany(mappedBy = "nguoiDung",fetch = FetchType.LAZY,cascade = {CascadeType.DETACH,CascadeType.MERGE,CascadeType.PERSIST,CascadeType.REFRESH})
    private List<DonHang> danhSachDonHang;




}
