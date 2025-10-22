// Pagination
import React from "react";

type Size = "sm" | "md" | "lg";
interface PhanTrangProps {
  trangHienTai: number;
  tongSoTrang: number;
  phanTrang: (page: number) => void;
  size?: Size;
}

function buildPages(current: number, total: number) {
  if (total <= 1) return [1];
  const delta = 2;
  const range: (number | "…")[] = [];

  const start = Math.max(1, current - delta);
  const end = Math.min(total, current + delta);

  if (start > 1) {
    range.push(1);
    if (start > 2) range.push("…");
  }
  for (let i = start; i <= end; i++) range.push(i);
  if (end < total) {
    if (end < total - 1) range.push("…");
    range.push(total);
  }
  return range;
}

export const PhanTrang: React.FC<PhanTrangProps> = ({
  trangHienTai,
  tongSoTrang,
  phanTrang,
  size = "md",
}) => {
  const pages = buildPages(trangHienTai, tongSoTrang);
  const sizeClass =
    size === "lg" ? "pagination-lg" : size === "sm" ? "pagination-sm" : "";
  const go = (p: number) => () => phanTrang(p);

  return (
    <nav aria-label="Phân trang">
      <ul className={`pagination ${sizeClass} justify-content-center my-3 gap-1`}>
        <li className={`page-item ${trangHienTai === 1 ? "disabled" : ""}`}>
          <button className="page-link rounded-pill" onClick={go(1)} aria-label="Trang đầu">
            «
          </button>
        </li>
        <li className={`page-item ${trangHienTai === 1 ? "disabled" : ""}`}>
          <button
            className="page-link rounded-pill"
            onClick={go(Math.max(1, trangHienTai - 1))}
            aria-label="Trang trước"
          >
            ‹
          </button>
        </li>

        {pages.map((p, i) =>
          p === "…" ? (
            <li key={`dots-${i}`} className="page-item disabled">
              <span className="page-link rounded-pill">…</span>
            </li>
          ) : (
            <li
              key={p}
              className={`page-item ${trangHienTai === p ? "active" : ""}`}
              aria-current={trangHienTai === p ? "page" : undefined}
            >
              <button className="page-link rounded-pill" onClick={go(p as number)}>
                {p}
              </button>
            </li>
          )
        )}

        <li className={`page-item ${trangHienTai === tongSoTrang ? "disabled" : ""}`}>
          <button
            className="page-link rounded-pill"
            onClick={go(Math.min(tongSoTrang, trangHienTai + 1))}
            aria-label="Trang sau"
          >
            ›
          </button>
        </li>
        <li className={`page-item ${trangHienTai === tongSoTrang ? "disabled" : ""}`}>
          <button
            className="page-link rounded-pill"
            onClick={go(tongSoTrang)}
            aria-label="Trang cuối"
          >
            »
          </button>
        </li>
      </ul>
    </nav>
  );
};
