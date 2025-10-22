const API_BASE = process.env.REACT_APP_API_BASE ?? "";

async function postJson<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export const api = {
  search: (q: string, topK = 8) =>
    postJson<import("./types").TimKiemResponse>("/ai/search", { q, topK }),

  // ✅ Chat hội thoại: gửi sessionId + history
  chat: (payload: import("./types").ChatRequest) =>
    postJson<import("./types").ChatResponse>("/ai/chat", payload),
};
