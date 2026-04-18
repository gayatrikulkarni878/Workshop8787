const HISTORY_KEY = "quizzy_history";

export interface HistoryItem {
  _id: string;
  topic: string;
  mode: "quiz" | "flashcard";
  data: unknown;
  createdAt: number;
}

export function saveToLocalHistory(item: Omit<HistoryItem, "_id" | "createdAt">): string {
  const id = `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const newItem: HistoryItem = {
    _id: id,
    ...item,
    createdAt: Date.now(),
  };
  const existing = getLocalHistory();
  // Keep only the last 50 entries
  const updated = [newItem, ...existing].slice(0, 50);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to save history to localStorage:", e);
  }
  return id;
}

export function getLocalHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryItem[];
  } catch {
    return [];
  }
}

export function getLocalHistoryItem(id: string): HistoryItem | null {
  const items = getLocalHistory();
  return items.find((i) => i._id === id) ?? null;
}
