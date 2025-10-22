// Kiểu dữ liệu AI
export type TimKiemItem = {
  maSach: number;
  tenSach: string;
  tenTacGia?: string;
  snippet?: string;
  url: string;
  score?: number;
};

export type TimKiemResponse = {
  q: string;
  items: TimKiemItem[];
};

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type ChatRequest = {
  sessionId: string;
  message: string;
  topK?: number;
  history?: ChatMessage[];
};

export type ChatResponse = {
  answer: string;
  retrieved: number;
  history: ChatMessage[];
};
