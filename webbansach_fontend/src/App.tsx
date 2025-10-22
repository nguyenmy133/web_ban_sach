import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./layouts/header-footer/Navbar";
import HomePage from "./layouts/homepage/HomePage";
import Footer from "./layouts/header-footer/Footer";
import About from "./layouts/about/About";
import ChiTietSanPham from "./layouts/product/ChiTietSanPham";
import DangKyNguoiDung from "./layouts/user/DangKyNguoiDung";
import KichHoatTaiKhoan from "./layouts/user/KichHoatTaiKhoan";
import DangNhap from "./layouts/user/DangNhap";
import Test from "./layouts/user/Test";
import SachFormAdmin from "./layouts/admin/SachForm";
import GioHang from "./layouts/product/GioHang";
import Checkout from "./layouts/product/Checkout";

import BookAIWidget from  "./layouts/product/components/BookAIWidget";
import "./App.css";

type User = { name: string; email?: string; avatarUrl?: string };

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = React.useState<string>("");
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  // ✅ Hydrate từ localStorage + nghe sự kiện đăng nhập
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("auth.user");
      if (raw) setCurrentUser(JSON.parse(raw));
    } catch {}

    const onLogin = (e: Event) => {
      const ce = e as CustomEvent<User>;
      setCurrentUser(ce.detail || null);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === "auth.user") {
        try {
          setCurrentUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setCurrentUser(null);
        }
      }
    };

    window.addEventListener("auth:login", onLogin as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("auth:login", onLogin as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const onLogout = () => {
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth.user");
    } catch {}
    setCurrentUser(null);
    window.location.href = "/";
  };

  return (
    <div className="App">
      <Navbar
        tuKhoaTimKiem={tuKhoaTimKiem}
        setTuKhoaTimKiem={setTuKhoaTimKiem}
        user={currentUser}
        onLogout={onLogout}
      />

      <Routes>
        <Route path="/" element={<HomePage tuKhoaTimKiem={tuKhoaTimKiem} />} />
        <Route path="/:maTheLoai" element={<HomePage tuKhoaTimKiem={tuKhoaTimKiem} />} />
        <Route path="/about" element={<About />} />
        <Route path="/sach/:maSach" element={<ChiTietSanPham />} />
        <Route path="/dang-ky" element={<DangKyNguoiDung />} />
        <Route path="/kich-hoat/:email/:maKichHoat" element={<KichHoatTaiKhoan />} />
        <Route path="/dang-nhap" element={<DangNhap />} />
        <Route path="/test" element={<Test />} />
        <Route path="/admin/them-sach" element={<SachFormAdmin />} />
        <Route path="/gio-hang" element={<GioHang />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>

      {/* ⬇️ Widget AI nổi góc phải */}
      <BookAIWidget />

      <Footer />
    </div>
  );
}

export default AppWrapper;
