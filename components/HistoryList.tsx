"use client";

import { useState, useEffect } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getLocalHistory, type HistoryItem } from "@/lib/history";

export default function HistoryList() {
  const [history, setHistory] = useState<HistoryItem[] | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    // Load from localStorage
    setHistory(getLocalHistory());

    // Listen for storage events (updates from other tabs / same tab via custom event)
    const onStorage = () => setHistory(getLocalHistory());
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

  const handleReattempt = (item: HistoryItem) => {
    const encodedData = encodeURIComponent(JSON.stringify(item.data));
    router.push(`/${item.mode}?data=${encodedData}`);
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      {history.map((item, i) => (
        <motion.button
          key={item._id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ x: 4 }}
          onClick={() => handleReattempt(item)}
          className="group text-left p-4 rounded-2xl border border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-border transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
              {item.mode} set
            </span>
            <span className="text-[9px] font-bold text-muted-foreground/50">
              {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <h4 className="font-bold text-[13px] line-clamp-1 group-hover:text-primary transition-colors">
            {item.topic}
          </h4>

          <div className="mt-3 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all duration-300">
            Reattempt <ArrowRight className="w-2.5 h-2.5" />
          </div>
        </motion.button>
      ))}
    </div>
  );
}
