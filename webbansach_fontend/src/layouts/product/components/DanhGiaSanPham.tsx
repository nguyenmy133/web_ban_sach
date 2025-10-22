import React, { useEffect, useState } from "react";
import { layToanBoDanhGiaCuaMotSach } from "../../../api/DanhGiaAPI";
import { DanhGiaModel } from "../../../models/DanhGiaModel";
// ⚠️ Sửa đường dẫn này cho đúng dự án của bạn
import SaoDanhGia from "../../utils/SaoDanhGia";

interface DanhGiaSanPhamProps {
  maSach: number;
}

const DanhGiaSanPham: React.FC<DanhGiaSanPhamProps> = ({ maSach }) => {
  const [danhSachDanhGia, setDanhSachDanhGia] = useState<DanhGiaModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    layToanBoDanhGiaCuaMotSach(maSach)
      .then((ds) => {
        if (mounted) {
          setDanhSachDanhGia(ds ?? []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err?.message || "Không thể tải đánh giá.");
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [maSach]);

  if (loading) {
    return (
      <div className="container mt-3">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">Đánh giá sản phẩm</h5>
            <div className="placeholder-glow">
              <span className="placeholder col-7"></span>
              <span className="placeholder col-5"></span>
              <span className="placeholder col-4"></span>
              <span className="placeholder col-6"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-3">
        <div className="alert alert-danger mb-0">Gặp lỗi: {error}</div>
      </div>
    );
  }

  const tong = danhSachDanhGia.reduce(
    (s, d) => s + (Number(d.diemXepHang) || 0),
    0
  );
  const tb = danhSachDanhGia.length ? tong / danhSachDanhGia.length : 0;

  return (
    <div className="container mt-3">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">Đánh giá sản phẩm</h5>
            <div className="d-flex align-items-center">
              <SaoDanhGia value={tb} showValue color="#FFC107" size={18} />
              <span className="text-muted ms-2">
                ({danhSachDanhGia.length})
              </span>
            </div>
          </div>

          {danhSachDanhGia.length === 0 ? (
            <p className="text-muted mb-0">Chưa có đánh giá nào.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {danhSachDanhGia.map((danhGia) => (
                <li
                  key={
                    danhGia.maDanhGia ??
                    `${danhGia.nhanXet}-${danhGia.diemXepHang}`
                  }
                  className="list-group-item px-0"
                >
                  <div className="d-flex">
                    <div className="me-3 text-nowrap" style={{ minWidth: 120 }}>
                      <SaoDanhGia
                        value={danhGia.diemXepHang}
                        color="#FFC107"
                        size={18}
                        showValue
                      />
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-1">{danhGia.nhanXet}</p>
                      {/* Nếu có tên người dùng / ngày đánh giá, hiển thị ở đây */}
                      {/* <small className="text-muted">by User • 2025-09-28</small> */}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DanhGiaSanPham;
