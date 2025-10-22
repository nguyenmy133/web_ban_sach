import React, { useEffect, useRef, useState } from "react";
import "../../App.css";
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";

interface User {
  name: string;
  email?: string;
  avatarUrl?: string;
}

interface NavbarProps {
  tuKhoaTimKiem: string;
  setTuKhoaTimKiem: (tuKhoa: string) => void;
  user?: User | null;
  onLogout?: () => void;
}

function Navbar({ tuKhoaTimKiem, setTuKhoaTimKiem, user: userProp = null, onLogout }: NavbarProps) {
  const [tuKhoaTamThoi, setTuKhoaTamThoi] = useState(tuKhoaTimKiem ?? "");
  const [openProfile, setOpenProfile] = useState(false);
  const [user, setUser] = useState<User | null>(userProp);

  const profileButtonRef = useRef<HTMLAnchorElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  // 🔄 đồng bộ theo prop từ App
  useEffect(() => {
    setUser(userProp ?? null);
  }, [userProp]);

  // 🛟 safety net: nếu prop chưa có, đọc từ localStorage + nghe auth:login
  useEffect(() => {
    if (!userProp) {
      try {
        const raw = localStorage.getItem("auth.user");
        if (raw) setUser(JSON.parse(raw));
      } catch {}
    }
    const onLogin = (e: Event) => {
      const ce = e as CustomEvent<User>;
      setUser(ce.detail || null);
    };
    window.addEventListener("auth:login", onLogin as EventListener);
    return () => window.removeEventListener("auth:login", onLogin as EventListener);
  }, [userProp]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTuKhoaTimKiem(tuKhoaTamThoi.trim());
  };

  const toggleProfile = () => setOpenProfile((s) => !s);

  useEffect(() => {
    function handleDocumentClick(e: MouseEvent) {
      const t = e.target as Node;
      if (openProfile && profileMenuRef.current && profileButtonRef.current &&
          !profileMenuRef.current.contains(t) && !profileButtonRef.current.contains(t)) {
        setOpenProfile(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenProfile(false);
        profileButtonRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [openProfile]);

  const handleLogout = () => {
    setOpenProfile(false);
    if (onLogout) onLogout();
    else {
      try {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth.user");
      } catch {}
      window.location.href = "/";
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-custom shadow-sm">
      <div className="container-fluid">
        {/* BRAND */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="/book-open-text.svg" alt="Nook Books logo" className="brand-logo" width="40" height="40" loading="lazy" />
          <span className="brand-text ms-2">Nook Books</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENU */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} aria-current="page">Trang chủ</NavLink>
            </li>

            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown1" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Thể loại sách
              </Link>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown1">
                <li><Link className="dropdown-item" to="/the-loai/khoa-hoc">Khoa học</Link></li>
                <li><Link className="dropdown-item" to="/the-loai/tieu-thuyet">Tiểu thuyết</Link></li>
                <li><Link className="dropdown-item" to="/the-loai/tam-ly-hoc">Tâm lý học</Link></li>
                <li><Link className="dropdown-item" to="/the-loai/lich-su">Lịch sử</Link></li>
              </ul>
            </li>

            <li className="nav-item"><a className="nav-link" href="#contact">Liên hệ</a></li>
          </ul>
        </div>

        {/* SEARCH */}
        <form className="d-flex align-items-center search-wrapper" role="search" onSubmit={handleSubmit}>
          <div className="search-input-group pastel">
            <input className="form-control search-input" type="search" placeholder="Tìm sách, tác giả, ISBN..."
              aria-label="Search" value={tuKhoaTamThoi} onChange={(e) => setTuKhoaTamThoi(e.target.value)} />
            <button className="btn search-btn pastel" type="submit" aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </form>

        {/* CART */}
        <ul className="navbar-nav me-1">
          <li className="nav-item">
            <Link className="nav-link icon-link" to="/gio-hang" aria-label="Giỏ hàng">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6h15l-1.5 9h-12L6 6z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="10" cy="20" r="1" fill="currentColor" />
                <circle cx="18" cy="20" r="1" fill="currentColor" />
              </svg>
            </Link>
          </li>
        </ul>

        {/* USER + POPOVER */}
        <ul className="navbar-nav me-1">
          <li className="nav-item position-relative">
            <a
              ref={profileButtonRef}
              className="nav-link icon-link profile-button"
              href="#"
              onClick={(e) => { e.preventDefault(); toggleProfile(); }}
              aria-haspopup="menu"
              aria-expanded={openProfile}
              aria-controls="profile-popover"
              aria-label="Hồ sơ"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            {openProfile && (
              <div ref={profileMenuRef} id="profile-popover" role="menu" aria-label="Profile menu" className="profile-popover shadow-sm">
                <div className="profile-head">
                  <div className="profile-avatar">
                    {user?.avatarUrl
                      ? <img src={user.avatarUrl} alt={`${user.name} avatar`} />
                      : <div className="profile-avatar-fallback" aria-hidden>{(user?.name || "NN").slice(0,2).toUpperCase()}</div>
                    }
                  </div>
                  <div className="profile-meta">
                    <div className="profile-name">{user?.name ?? "Khách"}</div>
                    {user?.email && <div className="profile-email">{user.email}</div>}
                  </div>
                </div>

                <div className="profile-actions" role="none">
                  <Link to="/ho-so" className="profile-action" role="menuitem" onClick={() => setOpenProfile(false)}>Hồ sơ</Link>
                  {user
                    ? <button className="profile-action btn-ghost" onClick={handleLogout} role="menuitem">Đăng xuất</button>
                    : <>
                        <Link to="/dang-nhap" className="profile-action" role="menuitem" onClick={() => setOpenProfile(false)}>Đăng nhập</Link>
                        <Link to="/dang-ky" className="profile-action" role="menuitem" onClick={() => setOpenProfile(false)}>Đăng ký</Link>
                      </>
                  }
                </div>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
