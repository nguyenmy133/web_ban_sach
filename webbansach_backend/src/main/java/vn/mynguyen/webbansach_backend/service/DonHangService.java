package vn.mynguyen.webbansach_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.mynguyen.webbansach_backend.dao.*;
import vn.mynguyen.webbansach_backend.entity.*;
import vn.mynguyen.webbansach_backend.dto.YeuCauTaoDonHang;
import vn.mynguyen.webbansach_backend.dto.PhanHoiTaoDonHang;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class DonHangService {

    private final DonHangRepository donHangRepo;
    private final ChiTietDonHangRepository chiTietRepo;
    private final SachRepository sachRepo;
    private final NguoiDungRepository nguoiDungRepo;

    public DonHangService(DonHangRepository donHangRepo,
                          ChiTietDonHangRepository chiTietRepo,
                          SachRepository sachRepo,
                          NguoiDungRepository nguoiDungRepo) {
        this.donHangRepo = donHangRepo;
        this.chiTietRepo = chiTietRepo;
        this.sachRepo = sachRepo;
        this.nguoiDungRepo = nguoiDungRepo;
    }

    @Transactional
    public PhanHoiTaoDonHang taoDonHang(YeuCauTaoDonHang yeu_cau, String ten_dang_nhap_hien_tai) {
        if (yeu_cau == null || yeu_cau.mat_hang == null || yeu_cau.mat_hang.isEmpty())
            throw new IllegalArgumentException("Danh sách mặt hàng rỗng.");

        long tam_tinh = 0L;
        for (YeuCauTaoDonHang.MatHang mh : yeu_cau.mat_hang) {
            if (mh.ma_sach == null || mh.so_luong == null || mh.so_luong <= 0)
                throw new IllegalArgumentException("Dữ liệu mặt hàng không hợp lệ.");
            tam_tinh += (mh.don_gia != null ? mh.don_gia : 0L) * mh.so_luong;
        }
        long giam_gia = 0L;
        long phi_van_chuyen = 0L;
        long tong_tien = Math.max(0, tam_tinh - giam_gia + phi_van_chuyen);


        DonHang donHang = new DonHang();
        donHang.setTrangThaiGiaoHang("CREATED");
        donHang.setTrangThaiThanhToan("UNPAID");
        donHang.setTongTien(tong_tien);
        donHang.setTongTienSanPham(tam_tinh);
        donHang.setChiPhiGiaoHang(phi_van_chuyen);
        donHang.setChiPhiThanhToan(0);

        if (yeu_cau.giao_hang != null) {
            donHang.setDiaChiNhanHang(yeu_cau.giao_hang.dia_chi);
            donHang.setDiaChiMuaHang(yeu_cau.giao_hang.dia_chi);
        }


        if (ten_dang_nhap_hien_tai != null) {
            NguoiDung nd = nguoiDungRepo.findByTenDangNhap(ten_dang_nhap_hien_tai);
            if (nd != null) donHang.setNguoiDung(nd);
        }

        DonHang daLuu = donHangRepo.save(donHang);


        for (YeuCauTaoDonHang.MatHang mh : yeu_cau.mat_hang) {
            Sach sach = sachRepo.findById(mh.ma_sach)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sách: " + mh.ma_sach));
            int ton = sach.getSoLuong();
            if (ton < mh.so_luong)
                throw new IllegalStateException("Sách " + mh.ma_sach + " không đủ tồn kho.");
            sach.setSoLuong(ton - mh.so_luong);
            sachRepo.save(sach);

            ChiTietDonHang ct = new ChiTietDonHang();
            ct.setDonHang(daLuu);
            ct.setSach(sach);
            ct.setSoLuong(mh.so_luong);
            ct.setGiaBan(mh.don_gia != null ? mh.don_gia : Math.round(sach.getGiaBan()));
            chiTietRepo.save(ct);
        }


        PhanHoiTaoDonHang ph = new PhanHoiTaoDonHang();
        ph.ma_don_hang = daLuu.getMaDonHang();
        ph.ma_hien_thi = "DH" + daLuu.getMaDonHang();  // bạn có thể đổi sang format ngày/tháng
        ph.trang_thai = daLuu.getTrangThaiGiaoHang();
        ph.tam_tinh = tam_tinh;
        ph.giam_gia = giam_gia;
        ph.phi_van_chuyen = phi_van_chuyen;
        ph.tong_tien = tong_tien;
        ph.thoi_diem_tao = OffsetDateTime.now().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        return ph;
    }

    public PhanHoiTaoDonHang layDonHang(Integer ma_don_hang) {
        DonHang dh = donHangRepo.findById(ma_don_hang)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));
        PhanHoiTaoDonHang ph = new PhanHoiTaoDonHang();
        ph.ma_don_hang = dh.getMaDonHang();
        ph.ma_hien_thi = "DH" + dh.getMaDonHang();
        ph.trang_thai = dh.getTrangThaiGiaoHang();
        ph.tong_tien = Math.round(dh.getTongTien());
        ph.thoi_diem_tao = OffsetDateTime.now().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        return ph;
    }
}
