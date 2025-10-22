import React, { useState } from "react";
import "./DangKy.css";

function DangKyNguoiDung() {
  const [tenDangNhap, setTenDangNhap] = useState("");
  const [email, setEmail] = useState("");
  const [hoDem, setHoDen] = useState("");
  const [ten, setTen] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [matKhauLapLai, setMatKhauLapLai] = useState("");
  const [gioiTinh, setGioiTinh] = useState(""); 
  const [daKichHoat,setDaKichHoat]=useState("");
  const [maKichHoat,setMaKichHoat]=useState("")
  
  const [showPw2, setShowPw2] = useState<boolean>(false); // ô Nhập lại mật khẩu// giữ nguyên logic
  const [showPw, setShowPw] = useState(false);
  const [errorTenDangNhap, setErrorTenDangNhap] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorMatKhau, setErrorMatKhau] = useState("");
  const [errorMatKhauLapLai, setErrorMatKhauLapLai] = useState("");
  const [thongBao, setThongBao] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    setErrorTenDangNhap('');
    setErrorEmail('');
    setErrorMatKhau('');
    setErrorMatKhauLapLai('');
    e.preventDefault();

    const isTenDangNhapValid = !await kiemTraTenDangNhapDaTonTai(tenDangNhap);
    const isEmailValid = !await kiemTraEmailDaTonTai(email);
    const isMatKhauValid = !kiemTraMatKhau(matKhau);
    const isMatKhauLapLaiValid = !kiemTraMatKhauLapLai(matKhauLapLai);

    if (isTenDangNhapValid && isEmailValid && isMatKhauValid && isMatKhauLapLaiValid) {
      try {
        const url = 'http://localhost:8080/tai-khoan/dang-ky';
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-type' : 'application/json' },
          body: JSON.stringify({
            tenDangNhap, email, matKhau, hoDem, ten, soDienThoai, gioiTinh,daKichHoat,maKichHoat
          })
        });

        if(response.ok){
          setThongBao("Đăng ký thành công, vui lòng kiểm tra email để kích hoạt!");
        }else{
          try { console.log(await response.json()); } catch {}
          setThongBao("Đã xảy ra lỗi trong quá trình đăng ký tài khoản.");
        }
      } catch (error) {
        setThongBao("Đã xảy ra lỗi trong quá trình đăng ký tài khoản.");
      }
    }
  };

  const kiemTraTenDangNhapDaTonTai = async (tenDangNhap: string) => {
    const url = `http://localhost:8080/nguoi-dung/search/existsByTenDangNhap?tenDangNhap=${tenDangNhap}`;
    try {
      const response = await fetch(url);
      const data = await response.text();
      if (data === "true") { setErrorTenDangNhap("Tên đăng nhập đã tồn tại!"); return true; }
      return false;
    } catch (error) {
      console.error("Lỗi khi kiểm tra tên đăng nhập:", error);
      return false;
    }
  };

  const handleTenDangNhapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTenDangNhap(e.target.value);
    setErrorTenDangNhap('');
    return kiemTraTenDangNhapDaTonTai(e.target.value);
  };

  const kiemTraEmailDaTonTai = async (email: string) => {
    const url = `http://localhost:8080/nguoi-dung/search/existsByEmail?email=${email}`;
    try {
      const response = await fetch(url);
      const data = await response.text();
      if (data === "true") { setErrorEmail("Email đã tồn tại!"); return true; }
      return false;
    } catch (error) {
      console.error("Lỗi khi kiểm tra email:", error);
      return false;
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorEmail('');
    return kiemTraEmailDaTonTai(e.target.value);
  };

  const kiemTraMatKhau = (matKhau: string) => {
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(matKhau)) {
      setErrorMatKhau("Mật khẩu phải có ít nhất 8 ký tự và bao gồm ít nhất 1 ký tự đặc biệt (!@#$%^&*)");
      return true;
    } else {
      setErrorMatKhau("");
      return false;
    }
  };

  const handleMatKhauChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMatKhau(e.target.value);
    setErrorMatKhau('');
    return kiemTraMatKhau(e.target.value);
  };

  const kiemTraMatKhauLapLai = (matKhauLapLai: string) => {
    if (matKhauLapLai !== matKhau) {
      setErrorMatKhauLapLai("Mật khẩu không trùng khớp.");
      return true;
    } else {
      setErrorMatKhauLapLai("");
      return false;
    }
  };

  const handleMatKhauLapLaiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMatKhauLapLai(e.target.value);
    setErrorMatKhauLapLai('');
    return kiemTraMatKhauLapLai(e.target.value);
  };

  const isSuccess = thongBao.startsWith("Đăng ký thành công");

  return (
    <div className="pastel-page d-flex align-items-center">
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 pt-4 pb-0">
                <h1 className="h4 text-center mb-2">Đăng ký</h1>
                <p className="text-center text-muted mb-0">Tạo tài khoản để bắt đầu sử dụng hệ thống</p>
              </div>

              <div className="card-body p-4 p-md-5">
                {thongBao && (
                  <div className={`alert ${isSuccess ? "alert-success" : "alert-danger"}`} role="alert">
                    {thongBao}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                  {/* Tên đăng nhập */}
                  <div className="mb-3">
                    <label htmlFor="tenDangNhap" className="form-label fw-medium text-start w-100">Tên đăng nhập</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-person-fill" /></span>
                      <input
                        type="text"
                        id="tenDangNhap"
                        className={`form-control ${errorTenDangNhap ? "is-invalid" : ""}`}
                        placeholder="Nhập tên đăng nhập"
                        value={tenDangNhap}
                        onChange={handleTenDangNhapChange}
                      />
                    </div>
                    {errorTenDangNhap && <div className="invalid-feedback d-block">{errorTenDangNhap}</div>}
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-medium text-start w-100">Email</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-envelope-fill" /></span>
                      <input
                        type="email"
                        id="email"
                        className={`form-control ${errorEmail ? "is-invalid" : ""}`}
                        placeholder="Nhập email"
                        value={email}
                        onChange={handleEmailChange}
                      />
                    </div>
                    {errorEmail && <div className="invalid-feedback d-block">{errorEmail}</div>}
                  </div>

                  {/* Mật khẩu & Nhập lại mật khẩu */}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="matKhau" className="form-label fw-medium text-start w-100">Mật khẩu</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-lock-fill" /></span>
                        <input
                          type={showPw ? "text" : "password"}
                          id="matKhau"
                          className={`form-control ${errorMatKhau ? "is-invalid" : ""}`}
                          placeholder="Ít nhất 8 ký tự & ký tự đặc biệt"
                          value={matKhau}
                          onChange={handleMatKhauChange}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-primary"  /* đổi sang outline-primary (xanh pastel) */
                          onClick={() => setShowPw(s => !s)}
                          aria-label="Hiện/Ẩn mật khẩu"
                        >
                          <i className={`bi ${showPw ? "bi-eye-slash" : "bi-eye"}`} />
                        </button>
                      </div>
                      {errorMatKhau && <div className="invalid-feedback d-block">{errorMatKhau}</div>}
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="matKhauLapLai" className="form-label fw-medium text-start w-100">Nhập lại mật khẩu</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-shield-lock-fill" /></span>
                        <input
                          type={showPw2 ? "text" : "password"}
                          id="matKhauLapLai"
                          className={`form-control ${errorMatKhauLapLai ? "is-invalid" : ""}`}
                          placeholder="Xác nhận mật khẩu "
                          value={matKhauLapLai}
                          onChange={handleMatKhauLapLaiChange}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => setShowPw2(s => !s)}
                          aria-label="Hiện/Ẩn mật khẩu"
                        >
                          <i className={`bi ${showPw2 ? "bi-eye-slash" : "bi-eye"}`} />
                        </button>
                      </div>
                      {errorMatKhauLapLai && <div className="invalid-feedback d-block">{errorMatKhauLapLai}</div>}
                    </div>
                  </div>

                  {/* Họ đệm & Tên */}
                  <div className="row g-3 mt-1">
                    <div className="col-md-6">
                      <label htmlFor="hoDem" className="form-label fw-medium text-start w-100">Họ đệm</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-card-text" /></span>
                        <input
                          type="text"
                          id="hoDem"
                          className="form-control"
                          placeholder="Nhập họ đệm"
                          value={hoDem}
                          onChange={(e) => setHoDen(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="ten" className="form-label fw-medium text-start w-100">Tên</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-type-bold" /></span>
                        <input
                          type="text"
                          id="ten"
                          className="form-control"
                          placeholder="Nhập tên"
                          value={ten}
                          onChange={(e) => setTen(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Số điện thoại & Giới tính (GIỮ LOGIC GIỚI TÍNH) */}
                  <div className="row g-3 mt-1">
                    <div className="col-md-6">
                      <label htmlFor="soDienThoai" className="form-label fw-medium text-start w-100">Số điện thoại</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-telephone-fill" /></span>
                        <input
                          type="text"
                          id="soDienThoai"
                          className="form-control"
                          placeholder="Nhập số điện thoại"
                          value={soDienThoai}
                          onChange={(e) => setSoDienThoai(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="gioiTinh" className="form-label fw-medium text-start w-100">Giới tính</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-people-fill" /></span>
                        <input
                          type="text"
                          id="gioiTinh"
                          className="form-control"
                          value={gioiTinh}  /* GIỮ NGUYÊN */
                          placeholder="Nhập giới tính"
                          onChange={(e) => setGioiTinh(e.target.value)} /* GIỮ NGUYÊN */
                        />
                      </div>
                    </div>
                  </div>

                  <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-primary btn-lg">
                      <i className="bi bi-person-plus-fill me-2" />
                      Đăng Ký
                    </button>
                  </div>
                </form>
              </div>

              <div className="card-footer bg-white border-0 text-center text-muted pb-4">
                <small>© {new Date().getFullYear()} – Nook Books</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* GIỮ NGUYÊN EXPORT */
export default DangKyNguoiDung;
