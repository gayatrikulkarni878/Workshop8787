"use client";

import { useState, useEffect } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getQuizHistory, type QuizResult } from "@/lib/history";

export default function HistoryList() {
  const [history, setHistory] = useState<QuizResult[] | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    // Load from localStorage
    setHistory(getQuizHistory());

    // Listen for storage events (updates from other tabs / same tab via custom event)
    const onStorage = () => setHistory(getQuizHistory());
    window.addEventListener("storage", onStorage);
    window.addEventListener("quizzy_history_updated", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("quizzy_history_updated", onStorage);
    };
  }, []);

  if (history === undefined) {
    return (
      <div className="flex flex-col gap-2 p-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-2xl bg-muted animate-pulse border border-border" />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center gap-4">
        <Clock className="w-6 h-6 text-muted-foreground/30" />
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No activity found</p>
      </div>
    );
  }

  const handleReattempt = (item: QuizResult) => {
    // Navigate home to regenerate for this topic
    router.push(`/?topic=${encodeURIComponent(item.topic)}`);
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      {history.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group text-left p-4 rounded-2xl border border-transparent bg-white/50 border-zinc-100 hover:border-primary/20 transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-primary/40">
              Conceptual Set
            </span>
            <span className="text-[9px] font-bold text-muted-foreground/50">
              {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="flex justify-between items-end">
            <h4 className="font-bold text-[13px] line-clamp-1 group-hover:text-primary transition-colors uppercase">
              {item.topic}
            </h4>
            <div className="text-[12px] font-black text-primary">
              {item.score}/{item.total}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
