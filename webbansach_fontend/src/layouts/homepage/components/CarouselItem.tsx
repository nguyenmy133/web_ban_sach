import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SachModel } from "../../../models/SachModel";
import { lay1AnhCuaMotSach } from "../../../api/HinhAnhAPI";
import type { HinhAnhModel } from "../../../models/HinhAnhModel";

const NO_IMAGE = "/images/no-image.png";

/* Helpers ảnh */
const cleanBase64 = (s?: string | null) => (s ? s.replace(/\s+/g, "") : "");
const isValidBase64Image = (s?: string | null) => {
  const t = cleanBase64(s);
  if (!t) return false;
  if (t.startsWith("data:image/")) return true;
  return t.length >= 40 && /^[A-Za-z0-9+/_-]+={0,2}$/.test(t);
};
const ensureDataUrl = (b64OrDataUrl: string, mime?: string | null) => {
  const s = cleanBase64(b64OrDataUrl);
  if (s.startsWith("data:image/")) return s;
  const ct = mime && /^image\//i.test(mime) ? mime : "image/jpeg";
  return `data:${ct};base64,${s}`;
};
const normalizePath = (p?: string | null) => {
  if (!p) return "";
  const s = p.trim();
  const low = s.toLowerCase();
  if (low.startsWith("http://") || low.startsWith("https://") || low.startsWith("data:")) return s;
  if (s.startsWith("/")) return s;
  return `/images/${s}`;
};
function pickSrc(rec?: Partial<HinhAnhModel> & { kieuNoiDung?: string | null } | null): string {
  if (!rec) return NO_IMAGE;
  const base64 = rec.duLieuAnh ?? undefined;
  const path = (rec as any)?.duongDan ?? (rec as any)?.url ?? (rec as any)?.link ?? undefined;
  if (isValidBase64Image(base64)) return ensureDataUrl(base64!, (rec as any)?.kieuNoiDung || undefined);
  const fixed = normalizePath(path);
  return fixed || NO_IMAGE;
}

/* Props */
interface Props {
  sach: SachModel;
  /** sm | md | mdPlus | lg */
  size?: "sm" | "md" | "mdPlus" | "lg";
}

const CarouselItem: React.FC<Props> = ({ sach, size = "mdPlus" }) => {
  const [anh, setAnh] = useState<HinhAnhModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const arr = await lay1AnhCuaMotSach(sach.maSach);
        if (cancel) return;
        const first = Array.isArray(arr) ? (arr[0] ?? null) : (arr as any) ?? null;
        setAnh(first);
        setLoading(false);
      } catch (e: any) {
        if (cancel) return;
        setError(e?.message || "Lỗi tải hình ảnh");
        setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [sach.maSach]);

  const src = useMemo(() => pickSrc(anh), [anh]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-danger">Lỗi: {error}</p>;

  return (
    <div className="row align-items-center gx-3">
      {/* Khung ảnh: contain để hiện đủ hình, kích thước tăng nhẹ */}
      <div className="col-12 col-md-5">
        <Link to={`/sach/${sach.maSach}`} className="text-decoration-none">
          <div className={`carousel-media carousel-media--${size}`} aria-label={`Ảnh bìa ${sach.tenSach}`}>
            <img
              src={src}
              alt={sach.tenSach}
              className="carousel-media__img"
              loading="lazy"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = NO_IMAGE; }}
            />
          </div>
        </Link>
      </div>

      <div className="col-12 col-md-6">
        <h5 className="carousel-title">{sach.tenSach}</h5>
        <p className="carousel-text">{sach.moTa}</p>
        <Link to={`/sach/${sach.maSach}`} className="btn btn-pastel btn-sm">
          Khám phá
        </Link>
      </div>
    </div>
  );
};

export default CarouselItem;
