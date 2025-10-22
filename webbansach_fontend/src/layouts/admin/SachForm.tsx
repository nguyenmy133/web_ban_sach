// SachForm.tsx
import React, { FormEvent, useState, ChangeEvent } from "react";
import RequireAdmin from "./RequireAdmin";

type Sach = {
  maSach: number;
  tenSach: string;
  giaBan: number;
  giaNiemYet: number;
  moTa: string;
  soLuong: number;
  tenTacGia: string;
  isbn: string;
  trungBinhXepHang: number;
};

const initialSach: Sach = {
  maSach: 0,
  tenSach: "",
  giaBan: 0,
  giaNiemYet: 0,
  moTa: "",
  soLuong: 0,
  tenTacGia: "",
  isbn: "",
  trungBinhXepHang: 0,
};

const SachForm: React.FC = () => {
  const [sach, setSach] = useState<Sach>(initialSach);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "danger" | ""; text: string }>({
    type: "",
    text: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // ép kiểu số cho các field số
    if (["giaBan", "giaNiemYet", "soLuong", "maSach", "trungBinhXepHang"].includes(name)) {
      setSach((prev) => ({ ...prev, [name]: value === "" ? 0 : Number(value) }));
    } else {
      setSach((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMsg({ type: "", text: "" });

    const token = localStorage.getItem("token");
    if (!token) {
      setMsg({ type: "danger", text: "Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi thêm sách." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/sach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sach),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Gặp lỗi trong quá trình thêm sách!");
      }

      setMsg({ type: "success", text: "Đã thêm sách thành công!" });
      setSach(initialSach);
    } catch (err: any) {
      setMsg({
        type: "danger",
        text: err?.message || "Gặp lỗi trong quá trình thêm sách!",
      });
    } finally {
      setLoading(false);
    }
  };

  const pageBg: React.CSSProperties = {
    background: "linear-gradient(180deg,#f6fbff,#eef6ff)",
    minHeight: "100vh",
  };

  return (
    <div className="d-flex align-items-center" style={pageBg}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-white border-0 pt-4 pb-0">
                <h1 className="h4 text-center mb-2">Thêm sách</h1>
                <p className="text-center text-muted mb-4">
                  Điền thông tin chi tiết để thêm sách vào hệ thống
                </p>
              </div>

              <div className="card-body p-4 p-md-5">
                {msg.text && (
                  <div className={`alert alert-${msg.type}`} role="alert">
                    {msg.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <input type="hidden" name="maSach" value={sach.maSach} />

                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label" htmlFor="tenSach">
                        Tên sách
                      </label>
                      <input
                        id="tenSach"
                        name="tenSach"
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên sách"
                        value={sach.tenSach}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label" htmlFor="tenTacGia">
                        Tên tác giả
                      </label>
                      <input
                        id="tenTacGia"
                        name="tenTacGia"
                        type="text"
                        className="form-control"
                        placeholder="Tác giả"
                        value={sach.tenTacGia}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label" htmlFor="isbn">
                        ISBN
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-upc-scan" />
                        </span>
                        <input
                          id="isbn"
                          name="isbn"
                          type="text"
                          className="form-control"
                          placeholder=""
                          value={sach.isbn}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label" htmlFor="giaNiemYet">
                        Giá niêm yết
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">₫</span>
                        <input
                          id="giaNiemYet"
                          name="giaNiemYet"
                          type="number"
                          min={0}
                          step={1000}
                          className="form-control"
                          placeholder=""
                          value={sach.giaNiemYet}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label" htmlFor="giaBan">
                        Giá bán
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">₫</span>
                        <input
                          id="giaBan"
                          name="giaBan"
                          type="number"
                          min={0}
                          step={1000}
                          className="form-control"
                          placeholder=""
                          value={sach.giaBan}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label" htmlFor="soLuong">
                        Số lượng
                      </label>
                      <input
                        id="soLuong"
                        name="soLuong"
                        type="number"
                        min={0}
                        step={1}
                        className="form-control"
                        placeholder=""
                        value={sach.soLuong}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label" htmlFor="moTa">
                        Mô tả
                      </label>
                      <textarea
                        id="moTa"
                        name="moTa"
                        className="form-control"
                        rows={4}
                        placeholder="Giới thiệu ngắn về nội dung cuốn sách..."
                        value={sach.moTa}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Ẩn/không cho sửa xếp hạng trung bình (nếu backend cần trường này) */}
                  <input
                    type="hidden"
                    name="trungBinhXepHang"
                    value={sach.trungBinhXepHang}
                    readOnly
                  />

                  <div className="d-flex gap-2 mt-4">
                    <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
                      {loading && (
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                      Lưu
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-lg"
                      type="button"
                      onClick={() => {
                        setSach(initialSach);
                        setMsg({ type: "", text: "" });
                      }}
                      disabled={loading}
                    >
                      Làm mới
                    </button>
                  </div>
                </form>
              </div>

              <div className="card-footer bg-white border-0 text-center text-muted pb-4">
                <small>© {new Date().getFullYear()} – Quản lý Sách</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SachFormAdmin =RequireAdmin(SachForm);
export default SachFormAdmin;
