/**
 * Lưu trữ theo từng user qua key: `${USER_NS}:${uid}:${key}`
 * Nếu app chưa có đăng nhập, sẽ dùng uid "guest".
 */

const USER_NS = "app.user";

/* -------------------- Helpers -------------------- */

function normalizeUid(v: unknown): string | null {
  if (!v) return null;
  const s = String(v).trim();
  if (!s) return null;
  return s.toLowerCase();
}

// Giải mã payload JWT an toàn (nếu có)
function decodeJwtSub(token?: string | null): string | null {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1]));
    // ưu tiên các field phổ biến
    const cand =
      payload?.sub ||
      payload?.user_id ||
      payload?.uid ||
      payload?.id ||
      payload?.username ||
      payload?.email;
    return normalizeUid(cand);
  } catch {
    return null;
  }
}

/** Lấy userId hiện tại (tùy biến theo app của bạn). */
export function getCurrentUserId(): string {
  try {
    // 1) Global tạm thời (nếu app có set)
    const g: any = (globalThis as any);
    if (g && typeof g.__CURRENT_USER_ID__ === "string" && g.__CURRENT_USER_ID__) {
      const n = normalizeUid(g.__CURRENT_USER_ID__);
      if (n) return n;
    }

    // 2) Key trực tiếp (nên set khi login)
    const direct = localStorage.getItem("currentUserId");
    if (direct) {
      const n = normalizeUid(direct);
      if (n) return n;
    }

    // 3) Đọc từ auth.user (JSON) → ưu tiên id, username, email, name
    const au = localStorage.getItem("auth.user");
    if (au) {
      try {
        const obj = JSON.parse(au);
        const n =
          normalizeUid(obj?.id) ||
          normalizeUid(obj?.username) ||
          normalizeUid(obj?.email) ||
          normalizeUid(obj?.name);
        if (n) return n;
      } catch {}
    }

    // 4) Thử giải mã JWT để lấy sub/username/id
    const token =
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token");
    const sub = decodeJwtSub(token);
    if (sub) return sub;

  } catch { /* ignore */ }

  // 5) Mặc định
  return "guest";
}

/** Ghép key chuẩn hóa theo user */
function makeKey(uid: string, key: string) {
  return `${USER_NS}:${uid}:${key}`;
}

/** Đọc JSON từ localStorage theo user */
export function getItem<T>(uid: string, key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(makeKey(uid, key));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Ghi JSON vào localStorage theo user */
export function setItem<T>(uid: string, key: string, value: T): void {
  try {
    localStorage.setItem(makeKey(uid, key), JSON.stringify(value));
  } catch {
    // quota đầy -> bỏ qua
  }
}

/** Xóa 1 key theo user (tuỳ chọn dùng) */
export function removeItem(uid: string, key: string): void {
  try {
    localStorage.removeItem(makeKey(uid, key));
  } catch {}
}

/** Gợi ý: set UID rõ ràng khi login để ổn định */
export function setCurrentUserId(uid: string) {
  try {
    const n = normalizeUid(uid) || "guest";
    localStorage.setItem("currentUserId", n);
    // có thể set vào global để dùng nơi khác nếu muốn
    (globalThis as any).__CURRENT_USER_ID__ = n;
  } catch {}
}
