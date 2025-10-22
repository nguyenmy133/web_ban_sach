import React from "react";
import type { Book } from "../../../models/Book";
import "./BookProps.css";

interface BookProps {
  book: Book;
  onAddToCart?: (book: Book) => void;
  onToggleWishlist?: (book: Book) => void;
}

// Format VND
const formatVND = (v?: number | string) => {
  if (v === undefined || v === null) return "";
  const n = typeof v === "string" ? Number(v) : v;
  if (Number.isNaN(n)) return String(v);
  return n.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
};

// % giảm
const calcDiscount = (price?: number, original?: number) => {
  if (!price || !original || original <= price) return null;
  const pct = Math.round(((original - price) / original) * 100);
  return pct > 0 ? pct : null;
};

const BookProps: React.FC<BookProps> = ({ book, onAddToCart, onToggleWishlist }) => {
  const discount = calcDiscount((book as any).price, (book as any).originalPrice);

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mt-3">
      <article className="bookcard card h-100">
        {/* Ảnh */}
        <div className="bookcard__media">
          {discount && <span className="bookcard__badge">-{discount}%</span>}

          <button
            type="button"
            className="bookcard__wish"
            aria-label="Thêm vào yêu thích"
            onClick={() => onToggleWishlist?.(book)}
          >
            <i className="fas fa-heart" />
          </button>

          <img
            src={book.imageUrl || "https://placehold.co/400x560?text=No+Image"}
            className="bookcard__img"
            alt={book.title}
            loading="lazy"
          />
        </div>

        {/* Nội dung */}
        <div className="card-body d-flex flex-column">
          {(book as any).author && <p className="bookcard__author mb-1">{(book as any).author}</p>}
          <h3 className="bookcard__title">{book.title}</h3>
          {book.description && <p className="bookcard__desc mb-3">{book.description}</p>}

          {/* Giá */}
          <div className="bookcard__price mt-auto">
            <span className="bookcard__price--current">{formatVND((book as any).price)}</span>
            {(book as any).originalPrice && (book as any).originalPrice > ((book as any).price || 0) && (
              <span className="bookcard__price--old ms-2">
                <del>{formatVND((book as any).originalPrice)}</del>
              </span>
            )}
          </div>

          {/* Nút */}
          <div className="d-grid gap-2 mt-3">
            <button
              type="button"
              className="btn btn-primary bookcard__btn"
              onClick={() => onAddToCart?.(book)}
              aria-label="Thêm vào giỏ hàng"
            >
              <i className="fas fa-shopping-cart me-2" /> Thêm vào giỏ
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BookProps;
