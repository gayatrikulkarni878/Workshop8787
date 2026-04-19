const HISTORY_KEY = "quizzy_history_v2";

export interface QuizResult {
  id: string;
  sessionId?: string;
  topic: string;
  score: number;
  total: number;
  date: string;
}

export const saveQuizResult = (result: Omit<QuizResult, "id" | "date">) => {
  if (typeof window === "undefined") return;
  const history = getQuizHistory();
  
  // Prevent duplicate saving of the same session
  if (result.sessionId && history.some(item => item.sessionId === result.sessionId)) {
    console.log("Session already recorded, skipping.");
    return;
  }

  const newEntry: QuizResult = {
    ...result,
    id: Math.random().toString(36).substring(2, 9),
    date: new Date().toISOString(),
  };

  const updatedHistory = [newEntry, ...history].slice(0, 15); // Increased to 15
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  // Trigger UI update
  window.dispatchEvent(new Event("quizzy_history_updated"));
};

export const getQuizHistory = (): QuizResult[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("History parse error", e);
    return [];
  }
};

export const clearHistory = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
  window.dispatchEvent(new Event("quizzy_history_updated"));
};
