import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HinhAnhModel } from "../../../models/HinhAnhModel";
import { layToanBoHinhAnhCuaMotSach } from "../../../api/HinhAnhAPI";
import { SachModel } from "../../../models/SachModel";
import { addItem } from "../../../lib/cart-storage";
import "./SachProps.css";

const NO_IMAGE = "/images/no-image.png";

/** Chỉ nhận base64 hợp lệ: dài đủ, ký tự đúng hoặc đã là data: */
function isValidBase64Image(s?: string): boolean {
  if (!s) return false;
  const str = s.trim();
  if (!str) return false;
  if (str.startsWith("data:image/")) return true; // đã là data URI
  // base64 “thật” thường khá dài; lọc tạm bằng regex + độ dài
  const b64 = /^[A-Za-z0-9+/]+={0,2}$/;
  return str.length >= 80 && b64.test(str); // ngưỡng 80 để loại các chuỗi demo
}

/** Map đường dẫn tên file trần -> /images/... (public/images) */
function normalizePath(p?: string): string {
  if (!p) return "";
  const s = p.trim();
  if (!s) return "";
  const low = s.toLowerCase();
  if (low.startsWith("http://") || low.startsWith("https://") || low.startsWith("data:")) return s;
  if (s.startsWith("/")) return s;
  return `/images/${s}`;
}

/** CHỌN ẢNH: ưu tiên base64 hợp lệ; không thì dùng path (đã normalize) */
function pickImageSrc(images?: HinhAnhModel[]): string {
  if (!images?.length) return NO_IMAGE;

  const pick =
    (images.find((i: any) => i?.laIcon === true || i?.laIcon === 1) as any) ??
    (images[0] as any);

  const base64: string | undefined = pick?.duLieuAnh;
  const path: string | undefined = pick?.duongDan || pick?.link;

  if (isValidBase64Image(base64)) {
    return base64!.startsWith("data:image")
      ? base64!
      : `data:image/jpeg;base64,${base64}`;
  }

  const fixed = normalizePath(path);
  return fixed || NO_IMAGE;
}

interface Props {
  sach: SachModel;
}

/** Helper: format giá tiền */
const formatVND = (v: any) => {
  const n = Number(v);
  if (Number.isNaN(n)) return v ?? "";
  return n.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
};

const calcDiscount = (giaBan: any, giaNiemYet: any) => {
  const ban = Number(giaBan),
    niemYet = Number(giaNiemYet);
  if (Number.isNaN(ban) || Number.isNaN(niemYet) || niemYet <= ban) return null;
  return Math.round(((niemYet - ban) / niemYet) * 100);
};

const SachProps: React.FC<Props> = ({ sach }) => {
  const [resolvedSrc, setResolvedSrc] = useState<string>(NO_IMAGE);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setImgLoaded(false);
    setResolvedSrc(NO_IMAGE);

    layToanBoHinhAnhCuaMotSach(sach.maSach)
      .then((data) => {
        if (cancelled) return;
        const src = pickImageSrc(Array.isArray(data) ? data : []);
        setResolvedSrc(src);
        setErr(null);
      })
      .catch((e) => {
        if (cancelled) return;
        setResolvedSrc(NO_IMAGE);
        setErr(e?.message ?? "Không tải được ảnh");
      });

    return () => {
      cancelled = true;
    };
  }, [sach.maSach]);

  useEffect(() => {
    // Debug để chắc chắn đường dẫn đúng dạng /images/duongdan1.jpg
    console.log("IMG SRC =>", resolvedSrc);
  }, [resolvedSrc]);

  const discount = calcDiscount((sach as any).giaBan, (sach as any).giaNiemYet);

  const handleAddToCart = () => {
    const idSafe = (sach.maSach ?? 0) as number;
    const tenSachSafe =
      (sach.tenSach ?? "").toString().trim() || `Sách #${idSafe}`;
    const giaBanSafe = Number(sach.giaBan ?? 0);
    const giaNiemYetSafe =
      typeof (sach as any)?.giaNiemYet === "number" ? (sach as any).giaNiemYet : null;

    addItem({
      id: idSafe,
      maSach: idSafe,
      tenSach: tenSachSafe,
      giaBan: giaBanSafe,
      giaNiemYet: giaNiemYetSafe,
      image: resolvedSrc && resolvedSrc !== NO_IMAGE ? resolvedSrc : undefined,
      qty: 1,
    });

    window.dispatchEvent(new CustomEvent("cart:changed"));
  };

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mt-3">
      <article className="sach-card card h-100">
        {/* Media */}
        <Link
          to={`/sach/${sach.maSach}`}
          className="sach-card__media"
          aria-label={sach.tenSach}
        >
          {discount ? (
            <span className="sach-card__badge">-{discount}%</span>
          ) : null}

          <img
            src={resolvedSrc}
            className="sach-card__img"
            alt={sach.tenSach}
            loading="lazy"
            decoding="async"
            style={{ opacity: imgLoaded ? 1 : 0 }}
            onLoad={() => setImgLoaded(true)}
            onError={() => {
              setResolvedSrc(NO_IMAGE);
              setImgLoaded(true);
            }}
          />
          {!imgLoaded && <div className="sach-card__skeleton" aria-hidden="true" />}
        </Link>

        {/* Body */}
        <div className="card-body d-flex flex-column">
          <Link
            to={`/sach/${sach.maSach}`}
            className="sach-card__title link-unstyled"
            title={sach.tenSach}
          >
            {sach.tenSach}
          </Link>

          {/* Giá */}
          <div className="sach-price mt-2">
            <div className="sach-price__current">
              {formatVND((sach as any).giaBan)}
            </div>

            {(sach as any).giaNiemYet &&
              (sach as any).giaNiemYet > ((sach as any).giaBan || 0) && (
                <div className="sach-price__old">
                  <del>{formatVND((sach as any).giaNiemYet)}</del>
                </div>
              )}
          </div>

          {/* Actions */}
          <div className="d-grid gap-2 mt-3">
            <div className="row g-2" role="group" aria-label="Hành động với sách">
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100 sach-card__btn--wish"
                  aria-label="Yêu thích"
                >
                  <i className="fas fa-heart" aria-hidden="true"></i>
                </button>
              </div>

              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={handleAddToCart}
                  aria-label="Thêm vào giỏ"
                >
                  Thêm giỏ
                </button>
              </div>
            </div>
          </div>

          {err && <small className="text-muted d-block mt-2">{err}</small>}
        </div>
      </article>
    </div>
  );
};

export default SachProps;
