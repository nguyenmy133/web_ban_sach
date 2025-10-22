// src/lib/checkout-storage.ts
import type { CartItem } from "./cart-storage";

const KEY = "checkout.intent";

export type CheckoutIntent =
  | { type: "buyNow"; items: CartItem[]; createdAt: number }
  | { type: "cart"; items: CartItem[]; createdAt: number };

export function setCheckoutIntent(intent: CheckoutIntent) {
  try { localStorage.setItem(KEY, JSON.stringify(intent)); } catch {}
}

export function getCheckoutIntent(): CheckoutIntent | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CheckoutIntent;
  } catch {
    return null;
  }
}

export function clearCheckoutIntent() {
  try { localStorage.removeItem(KEY); } catch {}
}
