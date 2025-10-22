import React, { useEffect, useState } from "react";
import "./HinhAnhSanPham.css";
import { layToanBoHinhAnhCuaMotSach } from "../../../api/HinhAnhAPI";

/** Dùng interface nhẹ để tránh lỗi import type */
type HinhAnhModelLite = {
  duLieuAnh?: string | null;   // base64 hoặc data-uri
  duongDan?: string | null;    // tên file hoặc URL
  link?: string | null;        // URL
  url?: string | null;
  url_image?: string | null;
  laIcon?: boolean | number;   // thumbnail?
};



const NO_IMAGE = "/images/no-image.png";

/* ---------- Helpers ảnh ---------- */
function isValidBase64Image(s?: string | null): boolean {
  if (!s) return false;
  const t = s.trim();
  if (!t) return false;
  if (t.startsWith("data:image/")) return true;
  const b64 = /^[A-Za-z0-9+/]+={0,2}$/;
  return t.length >= 80 && b64.test(t);
}

function normalizePath(p?: string | null): string {
  if (!p) return "";
  const s = p.trim();
  if (!s) return "";
  const low = s.toLowerCase();
  if (low.startsWith("http://") || low.startsWith("https://") || low.startsWith("data:")) return s;
  if (s.startsWith("/")) return s;
  // File tĩnh để trong public/images
  return `/images/${s}`;
}

function pickSrc(rec: HinhAnhModelLite): string {
  const base64 = rec?.duLieuAnh ?? undefined;
  const path =
    rec?.duongDan ?? rec?.link ?? rec?.url ?? rec?.url_image ?? undefined;

  if (isValidBase64Image(base64)) {
    return base64!.startsWith("data:image") ? base64! : `data:image/jpeg;base64,${base64}`;
  }
  const fixed = normalizePath(path);
  return fixed || NO_IMAGE;
}

/* ---------- Component ---------- */
export default function HinhAnhSanPham({ maSach }: { maSach: number }) {
  const [list, setList] = useState<string[]>([]);
  const [current, setCurrent] = useState<string>(NO_IMAGE);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    let cancel = false;
    setList([]);
    setCurrent(NO_IMAGE);
    setLoaded(false);

    // Gọi API lấy danh sách ảnh
    layToanBoHinhAnhCuaMotSach(maSach)
      .then((arr) => {
        if (cancel) return;
        const raw: HinhAnhModelLite[] = Array.isArray(arr) ? arr : [];

        // Ưu tiên ảnh thumbnail trước
        const sorted = [
          ...raw.filter((i) => i?.laIcon === true || i?.laIcon === 1),
          ...raw.filter((i) => !(i?.laIcon === true || i?.laIcon === 1)),
        ];

        const srcs = sorted.map(pickSrc).filter(Boolean);
        const finalList = srcs.length ? srcs : [NO_IMAGE];

        setList(finalList);
        setCurrent(finalList[0]);
      })
      .catch(() => {
        if (cancel) return;
        setList([NO_IMAGE]);
        setCurrent(NO_IMAGE);
      });

    return () => { cancel = true; };
  }, [maSach]);

  return (
    <div className="ha">
      <div className="ha-main">
        <img
          src={current}
          alt="Ảnh sản phẩm"
          className="ha-main__img"
          style={{ opacity: loaded ? 1 : 0 }}
          onLoad={() => setLoaded(true)}
          onError={() => { setCurrent(NO_IMAGE); setLoaded(true); }}
        />
        {!loaded && <div className="ha-skeleton" aria-hidden />}
      </div>

      {list.length > 1 && (
        <div className="ha-thumb">
          {list.map((src, i) => (
            <button
              key={i}
              type="button"
              className={`ha-thumb__btn ${src === current ? "is-active" : ""}`}
              onClick={() => { setCurrent(src); setLoaded(false); }}
              aria-label={`Ảnh ${i + 1}`}
            >
              <img
                src={src}
                alt={`thumb-${i + 1}`}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = NO_IMAGE; }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
