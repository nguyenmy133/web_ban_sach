import React, { useId } from "react";

export type SaoDanhGiaProps = {
  value: number | string;     // 0..5 hoặc "4,5"
  max?: number;               // mặc định 5
  size?: number;              // px, mặc định 18
  gap?: number;               // khoảng cách giữa sao, mặc định 4
  showValue?: boolean;        // hiện “x.y/5”
  ariaLabel?: string;         // mô tả cho screen reader
  className?: string;
  color?: string;         // màu sao
};

const parseDecimal = (raw: number | string): number => {
  if (typeof raw === "number") return raw;
  const n = Number(String(raw).replace(",", "."));
  return isNaN(n) ? 0 : n;
};

const Star: React.FC<{ type: "full" | "half" | "empty"; size: number; gradientId?: string }> = ({ type, size, gradientId }) => {
  const path = "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27z";
  if (type === "full") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <path d={path} fill="currentColor" />
      </svg>
    );
  }
  if (type === "half") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id={gradientId}>
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path d={path} fill={`url(#${gradientId})`} stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }
  // empty
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
};

const SaoDanhGia: React.FC<SaoDanhGiaProps> = ({
  value,
  max = 5,
  size = 18,
  gap = 4,
  showValue = false,
  ariaLabel,
  className = "",
  color = "#FFC107", 
}) => {
  const id = useId();
  const v = Math.max(0, Math.min(max, parseDecimal(value)));
  const full = Math.floor(v);
  const hasHalf = v - full >= 0.25 && v - full < 0.75; // làm tròn nửa sao
  const extraFull = v - full >= 0.75 ? 1 : 0;          // làm tròn lên full nếu ≥ 0.75
  const stars: ("full" | "half" | "empty")[] = [];

  for (let i = 0; i < max; i++) {
    if (i < full) stars.push("full");
    else if (i === full && hasHalf) stars.push("half");
    else if (i === full && extraFull) stars.push("full");
    else stars.push("empty");
  }

  return (
    <span
      className={`sao-danh-gia ${className}`}
      style={{ display: "inline-flex", alignItems: "center", gap ,color}}
      aria-label={ariaLabel ?? `Xếp hạng ${v.toFixed(1)} trên ${max}`}
    >
      {stars.map((t, idx) => (
        <Star key={idx} type={t} size={size} gradientId={`${id}-g-${idx}`} />
      ))}
      {showValue && (
        <span style={{ marginLeft: 6, fontWeight: 600 }}>{v.toFixed(1)}/{max}</span>
      )}
    </span>
  );
};

export default SaoDanhGia;
