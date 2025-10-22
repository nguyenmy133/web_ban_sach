// src/layouts/checkout/Checkout.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCheckoutIntent,
  clearCheckoutIntent,
} from "../../lib/checkout-storage";
import {
  loadCart,
  getTotals,
  clearCart,
  type CartItem,
} from "../../lib/cart-storage";

const API_BASE_URL = "http://localhost:8080";

const formatVND = (v: number) =>
  Number(v).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

const Checkout: React.FC = () => {
  const nav = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [source, setSource] = useState<"buyNow" | "cart">("buyNow");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const intent = getCheckoutIntent();
    if (intent && intent.type === "buyNow" && intent.items?.length) {
      setSource("buyNow");
      setItems(intent.items);
    } else {
      const cartItems = loadCart();
      setSource("cart");
      setItems(cartItems);
    }
  }, []);

  const totals = useMemo(() => getTotals(items), [items]);

  const placeOrder = async () => {
    setError("");
    if (!items.length) {
      alert("Không có sản phẩm để thanh toán.");
      return;
    }
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Địa chỉ.");
      return;
    }

    // Chuẩn bị payload theo DTO tiếng Việt
    const payload = {
      mat_hang: items.map((it) => ({
        ma_sach: Number(it.maSach),
        so_luong: Number(it.qty),
        don_gia: Number(it.giaBan),
      })),
      giao_hang: {
        ten_nguoi_nhan: name.trim(),
        so_dien_thoai: phone.trim(),
        dia_chi: address.trim(),
      },
      ghi_chu: note || "",
      phuong_thuc_thanh_toan: "COD",
    };

    setPlacing(true);
    try {
      const token =
        localStorage.getItem("auth_token") || localStorage.getItem("token") || "";

      const res = await fetch(`${API_BASE_URL}/don-hang`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        // Một số BE trả lỗi dạng text/plain
        throw new Error(txt || `Đặt hàng thất bại (HTTP ${res.status}).`);
      }

      const data: {
        ma_don_hang: number;
        ma_hien_thi?: string;
        tong_tien?: number;
        trang_thai?: string;
      } = await res.json();

      // Xử lý sau khi đặt thành công
      if (source === "cart") {
        clearCart();
      }
      clearCheckoutIntent();

      const code = data.ma_hien_thi || `DH${data.ma_don_hang}`;
      alert(`Đặt hàng thành công!\nMã đơn: ${code}`);
      nav("/", { replace: true });
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Có lỗi xảy ra khi đặt hàng.");
      alert(e?.message || "Có lỗi xảy ra khi đặt hàng.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb mb-3">
          <li className="breadcrumb-item">
            <Link to="/">Trang chủ</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Thanh toán
          </li>
        </ol>
      </nav>

      <h1 className="h4 mb-4">Thanh toán</h1>

      {items.length === 0 ? (
        <div className="text-center py-5">
          <p className="lead mb-3">Không có sản phẩm để thanh toán.</p>
          <Link to="/" className="btn btn-primary">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Thông tin nhận hàng */}
          <div className="col-12 col-lg-7">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="h5">Thông tin nhận hàng</h2>

                {error && (
                  <div className="alert alert-danger py-2 my-2">{error}</div>
                )}

                <div className="row g-3 mt-1">
                  <div className="col-12">
                    <label className="form-label">Họ và tên</label>
                    <input
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label">Số điện thoại</label>
                    <input
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09xx xxx xxx"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Địa chỉ</label>
                    <input
                      className="form-control"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Ghi chú (tuỳ chọn)</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Giao giờ hành chính, gọi trước khi giao..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="col-12 col-lg-5">
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <h2 className="h6">
                  Đơn hàng ({items.reduce((s, i) => s + i.qty, 0)} SP)
                </h2>

                <div className="mt-3">
                  {items.map((it) => (
                    <div
                      key={`${it.id}`}
                      className="d-flex align-items-center mb-3"
                    >
                      <img
                        src={it.image || "/no-image.png"}
                        alt={it.tenSach}
                        width={56}
                        height={72}
                        style={{ objectFit: "cover" }}
                        className="rounded me-3"
                      />
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{it.tenSach}</div>
                        <div className="small text-muted">SL: {it.qty}</div>
                      </div>
                      <div className="fw-semibold">
                        {formatVND(it.giaBan * it.qty)}
                      </div>
                    </div>
                  ))}
                </div>

                <hr />
                <div className="d-flex justify-content-between">
                  <span>Tạm tính</span>
                  <span>{formatVND(totals.originalTotal)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Giảm giá</span>
                  <span className="text-success">
                    - {formatVND(totals.discountTotal)}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Thành tiền</span>
                  <span className="fw-bold fs-5">
                    {formatVND(totals.subtotal)}
                  </span>
                </div>

                <button
                  className="btn btn-primary w-100 mt-3"
                  disabled={placing}
                  onClick={placeOrder}
                >
                  {placing ? "Đang đặt hàng..." : "Đặt hàng"}
                </button>

                <div className="text-center mt-2">
                  <small className="text-muted">
                    Hình thức thanh toán: Thanh toán khi nhận hàng (COD)
                  </small>
                </div>
              </div>
            </div>

            <div className="small text-muted">
              <i className="fas fa-shield-alt me-1" aria-hidden="true"></i>
              Bảo mật thông tin • Đổi trả trong 7 ngày
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
