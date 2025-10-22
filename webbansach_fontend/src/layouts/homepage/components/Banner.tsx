import React from "react";
import "./Banner.css";

export default function Banner() {
  return (
    <section className="nook-banner" aria-label="Banner Khám phá sách">
      <div className="container-lg py-5">
        <div className="banner-card d-flex flex-column flex-md-row align-items-center gap-4 p-4 p-md-5 rounded-3">
          <div className="banner-text flex-grow-1">
            <h2 className="banner-title display-6 fw-bold mb-2">
              Đọc sách chính là hộ chiếu <br /> cho vô số cuộc phiêu lưu!
            </h2>
            <p className="banner-author mb-3">— Mary Pope Osborne</p>
          </div>

          <div className="banner-action text-md-end">
            <a
              href="/books"
              className="btn btn-pastel btn-lg rounded-pill shadow-sm"
              aria-label="Khám phá sách tại NookBooks.vn"
            >
              Khám phá sách tại NookBooks.vn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
