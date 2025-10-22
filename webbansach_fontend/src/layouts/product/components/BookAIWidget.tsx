// src/components/ai/BookAIWidget.tsx
import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/client";              // <-- chỉnh đường dẫn nếu khác
import type { TimKiemItem, ChatMessage } from "../../../api/types"; // <-- chỉnh đường dẫn nếu khác
import "./bookai.css";

type Mode = "search" | "chat";

function getSid() {
  let sid = localStorage.getItem("bookai.sid");
  if (!sid) {
    sid = (crypto as any).randomUUID ? crypto.randomUUID() : `${Date.now()}`;
    localStorage.setItem("bookai.sid", sid);
  }
  return sid;
}

export default function BookAIWidget() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("search");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Search state
  const [results, setResults] = useState<TimKiemItem[]>([]);

  // Chat state (giữ lịch sử hội thoại)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Chào bạn! Mô tả sở thích đọc để mình gợi ý nhé 📚" },
  ]);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const placeholder = useMemo(
    () => (mode === "search" ? "Nhập tên/mô tả sách để tìm…" : "VD: trinh thám tâm lý, tiết tấu nhanh…"),
    [mode]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;

    setLoading(true);

    try {
      if (mode === "search") {
        setResults([]);
        const data = await api.search(q, 8);
        setResults(data.items || []);
      } else {
        const sid = getSid();
        const draft: ChatMessage[] = [...messages, { role: "user", content: q }];
        const resp = await api.chat({ sessionId: sid, message: q, topK: 5, history: draft });
        setMessages(resp.history ?? draft); // lịch sử đã gồm câu trả lời
      }
      setInput("");
    } catch (err: any) {
      if (mode === "chat") {
        setMessages((prev) => [...prev, { role: "assistant", content: `Lỗi: ${err?.message || "không xác định"}` }]);
      } else {
        alert(err?.message || "Có lỗi xảy ra");
      }
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  // Bắt click trong khung chat để điều hướng nội bộ khi gặp link /sach/:id
  function onChatClick(e: React.MouseEvent) {
    const el = e.target as HTMLElement;
    const a = el.closest("a") as HTMLAnchorElement | null;
    if (a) {
      const href = a.getAttribute("href") || "";
      if (href.startsWith("/sach/")) {
        e.preventDefault();
        navigate(href); // hoặc: window.location.href = href;
      }
    }
  }

  return (
    <>
      <button className="bookai-fab" onClick={() => setOpen((v) => !v)} title="Book AI">📚</button>

      {open && (
        <div className="bookai-panel">
          <div className="bookai-header">
            <div className="title">Book AI</div>
            <div className="grow" />
            <select className="mode" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
              <option value="search">Tìm tương tự</option>
              <option value="chat">Chat gợi ý</option>
            </select>
            <button className="close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="bookai-body">
            {mode === "search" ? (
              <ul className="results">
                {results.map((it) => (
                  <li key={it.maSach} className="card">
                    <div className="line1">
                      <span className="title">{it.tenSach}</span>
                      {typeof it.score === "number" && <span className="score">{it.score.toFixed(2)}</span>}
                    </div>
                    {it.tenTacGia && <div className="author">Tác giả: {it.tenTacGia}</div>}
                    {it.snippet && <div className="snippet">{it.snippet}</div>}
                    <div className="actions">
                      <a
                        href={`/sach/${it.maSach}`}
                        onClick={(ev) => { ev.preventDefault(); navigate(`/sach/${it.maSach}`); }}
                      >
                        Đi tới sách →
                      </a>
                    </div>
                  </li>
                ))}
                {!loading && results.length === 0 && <li className="empty">Không có kết quả</li>}
              </ul>
            ) : (
              <div className="chat-box" onClick={onChatClick}>
                {messages.map((m, i) => (
                  <div key={i} className={`msg ${m.role}`}>
                    <div
                      className="bubble"
                      // Cho phép link bấm được nhưng vẫn escape nội dung khác
                      dangerouslySetInnerHTML={{ __html: renderMarkdownBasic(m.content) }}
                    />
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={onSubmit} className="input-row">
              {mode === "search" ? (
                <input
                  ref={inputRef as any}
                  className="text"
                  placeholder={placeholder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
              ) : (
                <textarea
                  ref={inputRef as any}
                  className="text textarea"
                  placeholder={placeholder}
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
              )}
              <button className="send" disabled={loading || !input.trim()}>
                {loading ? "..." : "Gửi"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// --- Markdown cơ bản + linkify /sach/:id ---
function renderMarkdownBasic(s: string) {
  // Chuẩn hoá anchor mà model sinh ra thành markdown
  let t = s.replace(
    /<a\s+[^>]*href=["'](\/sach\/\d+)["'][^>]*>(.*?)<\/a>/gi,
    '[$2]($1)'
  );

  // Escape an toàn
  t = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // **đậm**
  t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // [text](url) -> <a>
  t = t.replace(
    /\[(.+?)\]\(((\/sach\/\d+|https?:\/\/[^\s)]+))\)/g,
    '<a href="$2">$1</a>'
  );

  // Tự linkify chuỗi /sach/123
  t = t.replace(/(^|[\s])((\/sach\/\d+))/g, '$1<a href="$2">$2</a>');

  // Xuống dòng
  t = t.replace(/\n/g, "<br/>");

  return t;
}
