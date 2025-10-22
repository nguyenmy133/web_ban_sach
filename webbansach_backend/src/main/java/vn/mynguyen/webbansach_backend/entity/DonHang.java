package vn.mynguyen.webbansach_backend.entity;
import jakarta.persistence.*;
import lombok.Data;

import javax.print.attribute.standard.MediaSize;
import java.util.List;
import java.sql.Date;

@Entity
@Data
@Table(name = "don_hang")
public class DonHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_don_hang")
    private int maDonHang;

    @Column(name = "ngay_tao")
    private Date ngayTao;

    @Column(name = "dia_chi_mua_hang")
    private String diaChiMuaHang;

    @Column(name = "dia_chi_nhan_hang")
    private String diaChiNhanHang;

    @Column(name="tong_tien")
    private double tongTien;

    @Column(name="tong_tien_san_pham")
    private double tongTienSanPham;

    @Column(name="chi_phi_giao_hang")
    private double chiPhiGiaoHang;

    @Column(name="chi_phi_thanh_toan")
    private double chiPhiThanhToan;

    @Column(name = "trang_thao_thanh_toan")
    private String trangThaiThanhToan;

    @Column(name = "trang_thai_giao_hang")
    private String trangThaiGiaoHang;

    @ManyToOne(cascade = {CascadeType.DETACH,CascadeType.MERGE,CascadeType.PERSIST,CascadeType.REFRESH})
    @JoinColumn(name = "ma_hinh_thuc_thanh_toan")
    private HinhThucThanhToan hinhThucThanhToan;

    @ManyToOne(cascade = {CascadeType.DETACH,CascadeType.MERGE,CascadeType.PERSIST,CascadeType.REFRESH})
    @JoinColumn(name = "ma_hinh_thuc_giao_hang")
    private HinhThucGiaoHang hinhThucGiaoHang;

    @ManyToOne(cascade = {CascadeType.DETACH,CascadeType.MERGE,CascadeType.PERSIST,CascadeType.REFRESH})
    @JoinColumn(name = "ma_nguoi_dung",nullable = false)
    private NguoiDung nguoiDung;

    @OneToMany(mappedBy = "donHang", fetch = FetchType.LAZY,cascade ={CascadeType.ALL})
    private List<ChiTietDonHang> danhSachChiTietDonHang;


}
