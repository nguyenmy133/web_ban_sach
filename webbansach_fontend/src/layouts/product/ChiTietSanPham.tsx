import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { SachModel } from "../../models/SachModel";
import { laySachTheoMaSach } from "../../api/SachAPI";
import "./ChiTietSanPham.css";
import HinhAnhSanPham from "./components/HinhAnhSanPham";
import DanhGiaSanPham from "./components/DanhGiaSanPham";
import { DanhGiaModel } from "../../models/DanhGiaModel";
import { layToanBoDanhGiaCuaMotSach } from "../../api/DanhGiaAPI";
import SaoDanhGia from "../utils/SaoDanhGia";
import { addItem, type CartItem } from "../../lib/cart-storage";
import { setCheckoutIntent } from "../../lib/checkout-storage";

const parseDecimal = (raw: unknown): number => {
  if (raw == null) return NaN;
  if (typeof raw === "number") return raw;
  if (typeof raw === "string") {
    const n = Number(raw.replace(",", "."));
    return isNaN(n) ? NaN : n;
  }
  return NaN;
};

const ChiTietSanPham: React.FC = () => {
  const nav = useNavigate();
  const { maSach } = useParams();

  let maSachNumber = 0;
  try {
    maSachNumber = parseInt((maSach + "") as string, 10);
    if (Number.isNaN(maSachNumber)) maSachNumber = 0;
  } catch {
    maSachNumber = 0;
  }

  const [sach, setSach] = useState<SachModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avgFromReviews, setAvgFromReviews] = useState<number>(0);
  const [soLuong, setSoLuong] = useState<number>(1);

  const tamTinhText = useMemo(() => {
    const gia = sach?.giaBan ?? 0;
    return (soLuong * gia).toLocaleString("vi-VN") + "₫";
  }, [soLuong, sach?.giaBan]);

  const tangSoLuong = () => {
    if ((sach?.soLuong ?? 0) > 0 && soLuong < (sach?.soLuong ?? 1)) {
      setSoLuong(soLuong + 1);
    }
  };
  const giamSoLuong = () => {
    if (soLuong >= 2) setSoLuong(soLuong - 1);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      laySachTheoMaSach(maSachNumber),
      layToanBoDanhGiaCuaMotSach(maSachNumber),
    ])
      .then(([s, reviews]) => {
        setSach(s);
        const avg =
          reviews && reviews.length
            ? reviews.reduce((sum: number, d: DanhGiaModel) => {
                const v = parseDecimal((d as any).diemXepHang);
                return sum + (isNaN(v) ? 0 : v);
              }, 0) / reviews.length
            : 0;

        setAvgFromReviews(Number(avg.toFixed(1)));
      })
      .catch((err) => setError(err?.message ?? "Không xác định"))
      .finally(() => setLoading(false));
  }, [maSachNumber]);

  const giaBanText = useMemo(
    () => `${(sach?.giaBan ?? 0).toLocaleString("vi-VN")}₫`,
    [sach?.giaBan]
  );

  // Lấy từ BE (camelCase hoặc snake_case), fail thì dùng avgFromReviews
  const diemTBText = useMemo(() => {
    const raw =
      (sach as any)?.trungBinhXepHang ??
      (sach as any)?.trung_binh_xep_hang ??
      avgFromReviews;

    const n = parseDecimal(raw);
    return (isNaN(n) ? 0 : n).toFixed(1);
  }, [
    sach?.trungBinhXepHang,
    (sach as any)?.trung_binh_xep_hang,
    avgFromReviews,
  ]);

  if (loading) {
    return (
      <div className="ctsp">
        <div className="container ctsp-container">
          <div className="ctsp-skeleton">
            <div className="sk-media" />
            <div className="sk-info" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ctsp">
        <div className="container ctsp-container">
          <div className="ctsp-alert">Gặp lỗi: {error}</div>
        </div>
      </div>
    );
  }

  if (!sach) {
    return (
      <div className="ctsp">
        <div className="container ctsp-container">
          <div className="ctsp-alert">Sách không tồn tại!</div>
        </div>
      </div>
    );
  }

  // Helper ảnh đại diện (tuỳ BE)
  const imageUrl: string | undefined =
    (sach as any)?.hinhAnhChinhUrl ||
    (sach as any)?.anh?.[0]?.url ||
    (sach as any)?.hinhAnh?.[0]?.url ||
    undefined;

  // Chuẩn hoá item theo CartItem
  const buildItem = (qty: number): CartItem => {
    const idSafe = (sach.maSach ?? maSachNumber) as number;
    const tenSachSafe =
      (sach.tenSach ?? "").toString().trim() || `Sách #${idSafe}`;
    const giaBanSafe = Number(sach.giaBan ?? 0);
    const giaNiemYetSafe =
      typeof (sach as any)?.giaNiemYet === "number"
        ? (sach as any).giaNiemYet
        : undefined;

    return {
      id: idSafe,
      maSach: idSafe,
      tenSach: tenSachSafe,
      giaBan: giaBanSafe,
      giaNiemYet: giaNiemYetSafe,
      image: imageUrl,
      qty: Math.max(1, Math.min(qty, sach?.soLuong ?? 99)),
    };
  };

  const handleAddToCart = () => {
    addItem(buildItem(soLuong));
    // (tuỳ chọn) phát event cho navbar badge
    window.dispatchEvent(new CustomEvent("cart:changed"));
    nav("/gio-hang");
  };

  const handleBuyNow = () => {
    const item = buildItem(soLuong);
    setCheckoutIntent({ type: "buyNow", items: [item], createdAt: Date.now() });
    nav("/checkout");
  };

  return (
    <div className="ctsp">
      <div className="container ctsp-container">
        <div className="ctsp-grid">
          {/* Trái: Media (sticky) */}
          <aside className="ctsp-col ctsp-col-media">
            <div className="ctsp-card ctsp-card-media">
              <HinhAnhSanPham maSach={maSachNumber} />
            </div>
          </aside>

          {/* Phải: Thông tin */}
          <main className="ctsp-col ctsp-col-info">
            <div className="ctsp-card">
              <header className="ctsp-header">
                <h1 className="ctsp-title">{sach.tenSach}</h1>

                <div className="ctsp-meta">
                  <SaoDanhGia value={diemTBText} size={18} />
                  <span className="ctsp-dot">•</span>
                  <span className="ctsp-price">{giaBanText}</span>
                </div>

                {/* Số lượng */}
                <div>
                  <div className="ctsp-qty-row">
                    <label htmlFor="qty" className="ctsp-qty-label">
                      Số lượng
                    </label>

                    <div className="ctsp-qty">
                      <button
                        type="button"
                        className="ctsp-qty-btn"
                        onClick={giamSoLuong}
                        aria-label="Giảm số lượng"
                      >
                        &minus;
                      </button>

                      <input
                        id="qty"
                        className="ctsp-qty-input"
                        value={soLuong}
                        onChange={(e) => {
                          const v = e.target.value.replace(/[^\d]/g, "");
                          const n =
                            v === ""
                              ? 1
                              : Math.max(
                                  1,
                                  Math.min(
                                    parseInt(v, 10) || 1,
                                    sach?.soLuong ?? 1
                                  )
                                );
                          setSoLuong(n);
                        }}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        aria-label="Số lượng"
                      />

                      <button
                        type="button"
                        className="ctsp-qty-btn"
                        onClick={tangSoLuong}
                        aria-label="Tăng số lượng"
                      >
                        +
                      </button>
                    </div>

                    <div className="ctsp-stock">
                      {(sach?.soLuong ?? 0) > 0 ? (
                        <>
                          Còn <b>{sach?.soLuong}</b> sản phẩm
                        </>
                      ) : (
                        <span className="out">Hết hàng</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="ctsp-buybar">
                  <div className="ctsp-actions">
                    <button className="btn btn-primary" onClick={handleBuyNow}>
                      Mua ngay
                    </button>

                    {/* Thêm vào giỏ: lưu & chuyển giỏ */}
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={handleAddToCart}
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                  <div className="ctsp-subtotal">
                    <span>Tạm tính</span>
                    <strong>{tamTinhText}</strong>
                  </div>
                </div>
              </header>

              <hr className="ctsp-sep" />

              <section
                className="ctsp-desc prose"
                dangerouslySetInnerHTML={{ __html: (sach.moTa + "") as string }}
              />
            </div>

            {/* Đánh giá */}
            <div className="ctsp-card">
              <h2 className="ctsp-subtitle">Đánh giá sản phẩm</h2>
              <DanhGiaSanPham maSach={maSachNumber} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ChiTietSanPham;
