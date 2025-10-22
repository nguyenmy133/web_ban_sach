import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUserId } from "../../lib/user-storage";

const API_BASE_URL = "http://localhost:8080";

type MsgType = "success" | "danger" | "";
interface Msg { type: MsgType; text: string; }
interface User { id?: string; username?: string; name: string; email?: string; avatarUrl?: string }

export default function DangNhap(): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPw, setShowPw] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<Msg>({ type: "", text: "" });

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/tai-khoan/dang-nhap`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const text = await res.text();
      let data: any = {};
      try { data = text ? JSON.parse(text) : {}; } catch {}

      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Đăng nhập thất bại.");
      }

      // Map token
      const token: string = data?.jwt || data?.token || data?.access_token;
      if (!token) throw new Error("Thiếu token từ máy chủ.");

      // Map user — đảm bảo có id/username để làm UID ổn định
      const user: User = data?.user
        ? {
            id: data.user.id ?? data.user.userId ?? data.user.username ?? username,
            username: data.user.username ?? username,
            name: data.user.name || data.user.fullName || data.user.username || username,
            email: data.user.email,
            avatarUrl: data.user.avatar || data.user.avatarUrl,
          }
        : { id: username, username, name: username };

      // Persist
      try {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth.user", JSON.stringify(user));
        // ✅ set UID rõ ràng
        setCurrentUserId(user.id || user.username || username);
      } catch {}

      // Thông báo cho App/Navbar cập nhật ngay
      window.dispatchEvent(new CustomEvent<User>("auth:login", { detail: user }));

      setMsg({ type: "success", text: "Đăng nhập thành công!" });
      navigate("/", { replace: true });
    } catch (err: any) {
      setMsg({
        type: "danger",
        text: err?.message || "Đăng nhập thất bại. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  const bgStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #eef5ff, #dbeafe)",
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={bgStyle}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div
              className="card shadow-lg border-0"
              style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", borderRadius: "1.25rem" }}
            >
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="fw-bold fs-4">Nook Books</div>
                  <div className="text-secondary small">Đăng nhập để tiếp tục</div>
                </div>

                {msg.text && (
                  <div className={`alert alert-${msg.type} mb-4`} role="alert">
                    {msg.text}
                  </div>
                )}

                <form onSubmit={handleLogin} noValidate>
                  <div className="form-floating mb-3">
                    <input
                      id="username"
                      type="text"
                      className="form-control"
                      placeholder="Tên đăng nhập"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      required
                    />
                    <label htmlFor="username">Tên đăng nhập</label>
                  </div>

                  <div className="position-relative">
                    <div className="form-floating mb-3">
                      <input
                        id="password"
                        type={showPw ? "text" : "password"}
                        className="form-control"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                      />
                      <label htmlFor="password">Mật khẩu</label>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
                      onClick={() => setShowPw((s) => !s)}
                      aria-label="Hiện/ẩn mật khẩu"
                    >
                      {showPw ? "Ẩn" : "Hiện"}
                    </button>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="remember" />
                      <label className="form-check-label" htmlFor="remember">Ghi nhớ tôi</label>
                    </div>
                    <Link to="/quen-mat-khau" className="small text-decoration-none">
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading || !username || !password}
                  >
                    {loading && (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    )}
                    Đăng nhập
                  </button>
                </form>

                <hr className="my-4" />
                <p className="text-center text-muted mb-0">
                  Chưa có tài khoản?{" "}
                  <Link to="/dang-ky" className="text-decoration-none">Đăng ký ngay</Link>
                </p>
              </div>
            </div>

            <p className="text-center text-white-50 small mt-3 mb-0">
              © {new Date().getFullYear()} Nook Books
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
