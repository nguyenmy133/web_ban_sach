// src/pages/CartPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CartItem,
  loadCart,
  updateQty as _updateQty,
  removeItem as _removeItem,
  clearCart as _clearCart,
  getTotals,
} from "../../lib/cart-storage";
import { lay1AnhCuaMotSach } from "../../api/HinhAnhAPI";
import type { HinhAnhModel } from "../../models/HinhAnhModel";

const NO_IMAGE = "/images/no-image.png";

const formatVND = (v: number) =>
  Number(v).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

/** Kiểm tra chuỗi có phải base64 “thật” không */
function isValidBase64(b64?: string | null): b64 is string {
  if (typeof b64 !== "string") return false;
  if (b64.startsWith("data:")) return true; // đã là data URI hợp lệ
  if (b64.includes("%") || /\s/.test(b64)) return false; // có dấu %/space => không phải base64
  if (b64.length < 24) return false;
  if (!/^[A-Za-z0-9+/=\r\n]+$/.test(b64)) return false;
  return b64.length % 4 === 0;
}

/** Đoán mime từ “đầu” base64 */
function guessMimeFromB64(b64: string): string {
  const s = b64.slice(0, 20);
  if (s.startsWith("/9j/")) return "image/jpeg";
  if (s.startsWith("iVBORw0KGgo")) return "image/png";
  if (s.startsWith("R0lGOD")) return "image/gif";
  if (s.startsWith("UklGR")) return "image/webp";
  return "image/jpeg";
}

/** Build src an toàn từ HinhAnhModel hoặc object item bất kỳ */
function safeBuildImgSrc(
  input?: Partial<HinhAnhModel> | any,
  fallback = ""
): string {
  if (!input) return fallback;

  // 1) base64 thật thì ưu tiên
  const b64 =
    input.duLieuAnh ?? input.imageBase64 ?? input.base64 ?? null;
  if (isValidBase64(b64)) {
    if (b64.startsWith("data:")) return b64;
    const mime = guessMimeFromB64(b64);
    return `data:${mime};base64,${b64}`;
  }

  // 2) URL/đường dẫn
  const raw =
    input.duongDan ??
    input.image ??
    input.url ??
    input.link ??
    input.url_image ??
    "";
  if (typeof raw === "string" && raw.length > 0) {
    if (/^https?:\/\//i.test(raw)) return raw;
    if (raw.startsWith("/")) return `http://localhost:8080${raw}`;
    return `http://localhost:8080/${raw}`;
  }

  return fallback;
}

/** Preload ảnh; trả về src hiển thị được (hoặc fallback) */
function preload(src: string): Promise<string> {
  return new Promise((resolve) => {
    if (!src) return resolve(NO_IMAGE);
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(NO_IMAGE);
    img.src = src;
  });
}

const GioHang: React.FC = () => {
  const nav = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState("");
  const [applying, setApplying] = useState(false);

  // map ảnh đã sẵn sàng (key là string để tránh TS7015)
  const [imgMap, setImgMap] = useState<Record<string, string>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loaded = loadCart();
    setItems(loaded);

    // Từ dữ liệu có sẵn trong cart → build src (bỏ qua “base64” bẩn)
    (async () => {
      const updates: Record<string, string> = {};
      const loading: Record<string, boolean> = {};
      await Promise.all(
        loaded.map(async (it) => {
          const key = String(it.maSach);
          const srcRaw = safeBuildImgSrc(it, "");
          if (srcRaw) {
            loading[key] = true;
            updates[key] = await preload(srcRaw);
            loading[key] = false;
          }
        })
      );
      if (Object.keys(updates).length) setImgMap((m) => ({ ...m, ...updates }));
      if (Object.keys(loading).length) setLoadingMap((m) => ({ ...m, ...loading }));
    })();
  }, []);

  // Mục chưa có ảnh → gọi API lấy ảnh đầu tiên của sách (rồi cũng build “safe”)
  useEffect(() => {
    const needKeys = items
      .map((it) => String(it.maSach))
      .filter((k) => !imgMap[k] && !loadingMap[k]);

    if (!needKeys.length) return;

    (async () => {
      const loading: Record<string, boolean> = {};
      const updates: Record<string, string> = {};
      for (const k of needKeys) loading[k] = true;
      setLoadingMap((m) => ({ ...m, ...loading }));

      for (const k of needKeys) {
        try {
          const id = Number(k);
          const arr = Number.isFinite(id) ? await lay1AnhCuaMotSach(id) : [];
          const first = Array.isArray(arr) && arr.length ? arr[0] : null;
          const raw = safeBuildImgSrc(first ?? undefined, "");
          updates[k] = await preload(raw || NO_IMAGE);
        } catch {
          updates[k] = NO_IMAGE;
        }
      }

      if (Object.keys(updates).length) setImgMap((m) => ({ ...m, ...updates }));
      setLoadingMap((m) => {
        const next = { ...m };
        for (const k of needKeys) next[k] = false;
        return next;
      });
    })();
  }, [items, imgMap, loadingMap]);

  const totals = useMemo(() => getTotals(items), [items]);

  const updateQty = (id: CartItem["id"], next: number) => {
    const updated = _updateQty(id, Math.max(1, next));
    setItems(updated);
  };
  const removeItem = (id: CartItem["id"]) => {
    const updated = _removeItem(id);
    setItems(updated);
  };
  const clearCart = () => {
    if (!items.length) return;
    if (window.confirm("Xóa toàn bộ giỏ hàng?")) setItems(_clearCart());
  };

  const applyCoupon = async () => {
    setApplying(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      if (!coupon.trim()) return alert("Vui lòng nhập mã.");
      alert(`Đã áp dụng mã: ${coupon.trim()} (demo)`);
    } finally {
      setApplying(false);
    }
  };

  const goCheckout = () => {
    try {
      nav("/checkout");
    } catch {
      alert("Đi đến trang thanh toán (demo)");
    }
  };

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb mb-3">
          <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Giỏ hàng</li>
        </ol>
      </nav>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Giỏ hàng của bạn</h1>
        {items.length > 0 && (
          <button className="btn btn-outline-danger btn-sm" onClick={clearCart}>
            Xóa giỏ hàng
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-5">
          <div className="display-6 mb-3">🛒</div>
          <p className="lead mb-4">Giỏ hàng đang trống.</p>
          <Link to="/" className="btn btn-primary">Tiếp tục mua sắm</Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Left: list items */}
          <div className="col-12 col-lg-8">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: 520 }}>Sản phẩm</th>
                        <th className="text-end" style={{ width: 140 }}>Đơn giá</th>
                        <th className="text-center" style={{ width: 170 }}>Số lượng</th>
                        <th className="text-end" style={{ width: 160 }}>Thành tiền</th>
                        <th className="text-center" style={{ width: 100 }}>Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it) => {
                        const lineTotal = it.giaBan * it.qty;
                        const hasOld = !!it.giaNiemYet && it.giaNiemYet > it.giaBan;
                        const key = String(it.maSach);
                        const isLoading = !!loadingMap[key] && !imgMap[key];
                        const imgSrc = imgMap[key] || NO_IMAGE;

                        return (
                          <tr key={it.id}>
                            <td>
                              <div className="d-flex gap-3">
                                <Link
                                  to={`/sach/${it.maSach}`}
                                  className="d-block"
                                  style={{ width: 72, height: 96, flex: "0 0 72px" }}
                                >
                                  {isLoading ? (
                                    <div
                                      style={{
                                        width: 72,
                                        height: 96,
                                        borderRadius: 8,
                                        background:
                                          "linear-gradient(90deg, #f0f2f5 25%, #e7e9ed 37%, #f0f2f5 63%)",
                                        backgroundSize: "400% 100%",
                                        animation: "shimmer 1.25s infinite",
                                      }}
                                    />
                                  ) : (
                                    <img
                                      src={imgSrc}
                                      alt={it.tenSach}
                                      className="img-fluid rounded"
                                      loading="lazy"
                                      style={{ width: 72, height: 96, objectFit: "contain", background: "#f8f9fa" }}
                                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = NO_IMAGE; }}
                                    />
                                  )}
                                </Link>
                                <div className="flex-grow-1">
                                  <Link to={`/sach/${it.maSach}`} className="link-unstyled fw-semibold d-inline-block">
                                    {it.tenSach}
                                  </Link>
                                  <div className="small text-muted mt-1">
                                    Mã: <code>{String(it.maSach)}</code>
                                  </div>
                                  {hasOld && (
                                    <div className="small mt-1">
                                      <span className="text-danger fw-bold me-2">{formatVND(it.giaBan)}</span>
                                      <del className="text-muted">{formatVND(it.giaNiemYet || 0)}</del>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="text-end">
                              {!hasOld ? (
                                <span className="fw-semibold">{formatVND(it.giaBan)}</span>
                              ) : (
                                <div className="text-end">
                                  <div className="fw-semibold text-danger">{formatVND(it.giaBan)}</div>
                                  <small className="text-muted"><del>{formatVND(it.giaNiemYet || 0)}</del></small>
                                </div>
                              )}
                            </td>

                            <td className="text-center">
                              <div className="d-inline-flex align-items-center border rounded-pill px-2 py-1">
                                <button
                                  className="btn btn-sm btn-link px-2"
                                  onClick={() => updateQty(it.id, it.qty - 1)}
                                  aria-label="Giảm số lượng"
                                >
                                  −
                                </button>
                                <input
                                  value={it.qty}
                                  onChange={(e) => {
                                    const v = Number(e.target.value.replace(/\D/g, "")) || 1;
                                    updateQty(it.id, v);
                                  }}
                                  onBlur={(e) => {
                                    const v = Number(e.target.value || 1);
                                    updateQty(it.id, v);
                                  }}
                                  inputMode="numeric"
                                  className="form-control form-control-sm text-center border-0"
                                  style={{ width: 46 }}
                                  aria-label="Số lượng"
                                />
                                <button
                                  className="btn btn-sm btn-link px-2"
                                  onClick={() => updateQty(it.id, it.qty + 1)}
                                  aria-label="Tăng số lượng"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            <td className="text-end">
                              <span className="fw-bold">{formatVND(lineTotal)}</span>
                            </td>

                            <td className="text-center">
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeItem(it.id)}
                                aria-label={`Xóa ${it.tenSach} khỏi giỏ`}
                                title="Xóa sản phẩm"
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card-footer d-flex flex-wrap gap-2 justify-content-between align-items-center">
                <Link to="/" className="btn btn-outline-secondary">
                  ← Tiếp tục mua sắm
                </Link>

                <div className="d-flex align-items-center gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập mã giảm giá"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    style={{ minWidth: 220 }}
                  />
                  <button className="btn btn-primary" disabled={applying} onClick={applyCoupon}>
                    {applying ? "Đang áp dụng..." : "Áp dụng"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: summary */}
          <div className="col-12 col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="h5">Tóm tắt đơn hàng</h2>
                <div className="d-flex justify-content-between mt-3">
                  <span>Tạm tính ({totals.totalItems} SP)</span>
                  <span className="fw-semibold">{formatVND(totals.originalTotal)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Giảm giá</span>
                  <span className="text-success">- {formatVND(totals.discountTotal)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Thành tiền</span>
                  <span className="fw-bold fs-5">{formatVND(totals.subtotal)}</span>
                </div>
                <small className="text-muted d-block mt-1">Đã bao gồm VAT nếu có.</small>

                <button className="btn btn-primary w-100 mt-3" onClick={goCheckout} aria-label="Thanh toán">
                  Thanh toán
                </button>
              </div>
            </div>

            <div className="mt-3 small text-muted">
              Thanh toán an toàn • Đổi trả trong 7 ngày
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GioHang;

/* Thêm CSS shimmer (đặt ở global CSS của bạn)
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
*/
