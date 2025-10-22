package vn.mynguyen.webbansach_backend.dto;
import java.util.List;

/** Dữ liệu FE gửi lên khi tạo đơn hàng */
    public class YeuCauTaoDonHang {
        public List<MatHang> mat_hang;
        public GiaoHang giao_hang;
        public String ghi_chu;
        public String phuong_thuc_thanh_toan;

        /** 1 dòng hàng */
        public static class MatHang {
            public Integer ma_sach;
            public Integer so_luong;
            public Long don_gia;
        }

        /** Thông tin giao hàng */
        public static class GiaoHang {
            public String ten_nguoi_nhan;
            public String so_dien_thoai;
            public String dia_chi;
        }
}
