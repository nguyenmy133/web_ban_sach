// src/lib/cart-storage.ts
import { getItem, setItem, getCurrentUserId } from "./user-storage";

export type CartItem = {
  id: string | number;          // duy nhất trong giỏ (thường = maSach)
  maSach: string | number;
  tenSach: string;
  giaBan: number;               // VND
  giaNiemYet?: number | null;   // VND (nếu có)
  image?: string | null;        // URL/base64 đã resolve
  qty: number;                  // 1..99
};

const CART_KEY = "cart.items";

export function loadCart(uid = getCurrentUserId()): CartItem[] {
  return getItem<CartItem[]>(uid, CART_KEY, []);
}
export function saveCart(items: CartItem[], uid = getCurrentUserId()) {
  setItem(uid, CART_KEY, items);
}

/** Thêm hoặc cộng dồn số lượng */
export function addItem(newItem: Omit<CartItem, "qty"> & { qty?: number }, uid = getCurrentUserId()) {
  const items = loadCart(uid);
  const idx = items.findIndex(i => i.id === newItem.id);
  const addQty = Math.min(Math.max(newItem.qty ?? 1, 1), 99);
  if (idx >= 0) {
    items[idx].qty = Math.min(items[idx].qty + addQty, 99);
  } else {
    items.push({ ...newItem, qty: addQty });
  }
  saveCart(items, uid);
  return items;
}

export function updateQty(id: CartItem["id"], qty: number, uid = getCurrentUserId()) {
  const items = loadCart(uid);
  const idx = items.findIndex(i => i.id === id);
  if (idx >= 0) {
    items[idx].qty = Math.min(Math.max(Math.trunc(qty || 0), 1), 99);
    saveCart(items, uid);
  }
  return items;
}

export function removeItem(id: CartItem["id"], uid = getCurrentUserId()) {
  const items = loadCart(uid).filter(i => i.id !== id);
  saveCart(items, uid);
  return items;
}

export function clearCart(uid = getCurrentUserId()) {
  saveCart([], uid);
  return [];
}

export function getTotals(items: CartItem[]) {
  const subtotal = items.reduce((s, i) => s + i.giaBan * i.qty, 0);
  const originalTotal = items.reduce((s, i) => s + (i.giaNiemYet ?? i.giaBan) * i.qty, 0);
  const discountTotal = Math.max(originalTotal - subtotal, 0);
  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  return { subtotal, originalTotal, discountTotal, totalItems };
}
