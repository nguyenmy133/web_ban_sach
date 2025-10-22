import React from "react";
import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <div className="footer-root">
      <footer className="footer container">
        {/* ===== Top: 4 columns ===== */}
        <div className="row gy-4 py-5">
          {/* Brand + intro */}
          <div className="col-12 col-md-4">
            <h1 className="footer-brand">Nhà sách Nook Books</h1>
            <p className="footer-desc">
              Chọn lọc sách hay, giao nhanh, giá tốt. Cùng bạn xây dựng thói quen đọc mỗi ngày.
            </p>

            <ul className="list-unstyled d-flex gap-3 mt-3 mb-0">
              <li>
                <a className="social-link" href="#" aria-label="Twitter">
                  {/* Twitter */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </li>
              <li>
                <a className="social-link" href="#" aria-label="Instagram">
                  {/* Instagram */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.1"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </li>
              <li>
                <a className="social-link" href="#" aria-label="Facebook">
                  {/* Facebook */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div className="col-6 col-md-2">
            <p className="footer-title">Khám phá</p>
            <ul className="nav flex-column footer-nav">
              <li className="nav-item"><a href="#" className="footer-link">Trang chủ</a></li>
              <li className="nav-item"><a href="#" className="footer-link">Sách mới</a></li>
              <li className="nav-item"><a href="#" className="footer-link">Bán chạy</a></li>
              <li className="nav-item"><a href="#" className="footer-link">Khuyến mãi</a></li>
              <li className="nav-item"><a href="#" className="footer-link">About</a></li>
            </ul>
          </div>

          {/* Policy / Support */}
          <div className="col-6 col-md-2">
            <p className="footer-title">Hỗ trợ</p>
            <ul className="nav flex-column footer-nav">
              <li className="nav-item"><a href="#" className="footer-link">FAQ</a></li>
              <li className="nav-item"><a href="#" className="footer-link">Hướng dẫn mua hàng</a></li>
              <li className="nav-item"><a href="#" className="footer-link">Chính sách đổi trả</a></li>
              <li className="nav-item"><a href="#" className="footer-link">Vận chuyển</a></li>
              <li className="nav-item"><a href="#" className="footer-link">Điều khoản sử dụng</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-12 col-md-4">
            <form
              className="newsletter-form"
              onSubmit={(e) => e.preventDefault()}
              aria-labelledby="newsletter-heading"
            >
              <p id="newsletter-heading" className="footer-title">Đăng ký nhận bản tin</p>
              <p className="footer-sub">Cập nhật sách mới & ưu đãi mỗi tháng.</p>

              <div className="newsletter-input-group">
                <label htmlFor="newsletter-email" className="visually-hidden">Email</label>
                <input
                  id="newsletter-email"
                  type="email"
                  className="form-control newsletter-input"
                  placeholder="Nhập email của bạn"
                  aria-label="Nhập email của bạn"
                />
                <button className="btn newsletter-btn" type="submit" aria-label="Subscribe">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="btn-text">Subscribe</span>
                </button>
              </div>

              <small className="newsletter-note">
                Bằng việc đăng ký, bạn đồng ý nhận email từ Nook Books. Có thể huỷ bất cứ lúc nào.
              </small>
            </form>
          </div>
        </div>

        {/* ===== Bottom bar ===== */}
        <div className="footer-bottom d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 py-4 border-top">
          <p className="mb-0 copyright">© {year} Nook Books. All rights reserved.</p>
          <ul className="list-unstyled d-flex gap-3 mb-0 small">
            <li><a href="#" className="footer-link muted">Quyền riêng tư</a></li>
            <li><a href="#" className="footer-link muted">Điều khoản</a></li>
            <li><a href="#" className="footer-link muted">Liên hệ</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
