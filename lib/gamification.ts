"use client";

// Simple gamification logic using localStorage
export interface UserStats {
  points: number;
  streak: number;
  level: number;
  xp: number;
  lastActive: string | null;
  quizzesCompleted: number;
}

const INITIAL_STATS: UserStats = {
  points: 0,
  streak: 0,
  level: 1,
  xp: 0,
  lastActive: null,
  quizzesCompleted: 0,
};

export function getUserStats(): UserStats {
  if (typeof window === "undefined") return INITIAL_STATS;
  const stored = localStorage.getItem("quizzy_user_stats");
  if (!stored) return INITIAL_STATS;
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_STATS;
  }
}

export function saveUserStats(stats: UserStats) {
  if (typeof window === "undefined") return;
  localStorage.setItem("quizzy_user_stats", JSON.stringify(stats));
  window.dispatchEvent(new Event("quizzy_stats_updated"));
}

export function addQuizResult(score: number, total: number) {
  const stats = getUserStats();
  const today = new Date().toISOString().split("T")[0];
  
  // XP calculation: 10xp per correct answer + 50xp for completion
  const xpGained = (score * 10) + 50;
  let newXp = stats.xp + xpGained;
  let newLevel = stats.level;
  
  // Simple level up: each level requires 500xp
  while (newXp >= 500) {
    newXp -= 500;
    newLevel += 1;
  }
  
  // Streak logic
  let newStreak = stats.streak;
  if (stats.lastActive) {
    const lastDate = new Date(stats.lastActive);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    
    if (stats.lastActive === yesterdayStr) {
      newStreak += 1;
    } else if (stats.lastActive !== today) {
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }
  
  const newStats: UserStats = {
    ...stats,
    points: stats.points + (score * 5),
    xp: newXp,
    level: newLevel,
    streak: newStreak,
    lastActive: today,
    quizzesCompleted: stats.quizzesCompleted + 1,
  };
  
  saveUserStats(newStats);
  return { xpGained, levelUp: newLevel > stats.level };
}

export function getRank(level: number): string {
  if (level < 5) return "Novice";
  if (level < 10) return "Apprentice";
  if (level < 20) return "Scholar";
  if (level < 50) return "Specialist";
  return "Expert";
}
