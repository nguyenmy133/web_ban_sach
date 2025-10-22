import React, { useEffect, useState } from "react";
import "./Carousel.css";
import { SachModel } from "../../../models/SachModel";
import { lay3SachMoiNhat } from "../../../api/SachAPI";
import CarouselItem from "./CarouselItem";

const Carousel: React.FC = () => {
  const [ds, setDs] = useState<SachModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const kq = await lay3SachMoiNhat();
        if (cancel) return;
        const items = (kq?.ketQua ?? []).filter(Boolean).slice(0, 3);
        setDs(items);
        setLoading(false);
      } catch (e: any) {
        if (cancel) return;
        setError(e?.message || "Lỗi tải dữ liệu");
        setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-danger">Lỗi: {error}</p>;
  if (!ds.length) return <p>Chưa có sách để hiển thị.</p>;

  const carouselId = "carouselSachMoi";

  return (
    <div className="modern-bootstrap-carousel">
      <div
        id={carouselId}
        className="carousel carousel-dark slide"
        data-bs-ride="carousel"
        aria-roledescription="carousel"
      >
        {/* Indicators */}
        <div className="carousel-indicators">
          {ds.map((_, i) => (
            <button
              key={`ind-${i}`}
              type="button"
              data-bs-target={`#${carouselId}`}
              data-bs-slide-to={i}
              className={i === 0 ? "active" : ""}
              aria-current={i === 0 ? "true" : undefined}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Items */}
        <div className="carousel-inner">
          {ds.map((sach, i) => (
            <div
              key={sach.maSach ?? i}
              className={`carousel-item${i === 0 ? " active" : ""}`}
              data-bs-interval={8000}
            >
              {/* tăng kích thước 1 chút bằng size="mdPlus" */}
              <CarouselItem sach={sach} size="mdPlus" />
            </div>
          ))}
        </div>

        {/* Controls (giữ nguyên) */}
        <button
          className="carousel-control-prev modern-control"
          type="button"
          data-bs-target={`#${carouselId}`}
          data-bs-slide="prev"
          aria-label="Previous slide"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button
          className="carousel-control-next modern-control"
          type="button"
          data-bs-target={`#${carouselId}`}
          data-bs-slide="next"
          aria-label="Next slide"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  );
};

export default Carousel;
