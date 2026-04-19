import { History, GraduationCap, Info, LogOut, Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getQuizHistory, QuizResult, clearHistory } from "@/lib/history";
import { Button } from "./ui/button";

export default function Sidebar({ className }: { className?: string }) {
  const [history, setHistory] = useState<QuizResult[]>([]);

  useEffect(() => {
    const update = () => setHistory(getQuizHistory());
    update();
    window.addEventListener("quizzy_history_updated", update);
    return () => window.removeEventListener("quizzy_history_updated", update);
  }, []);

  return (
    <aside className={cn("w-80 h-screen border-r border-zinc-100 bg-white/70 backdrop-blur-3xl flex flex-col pt-16 overflow-hidden relative", className)}>
      <div className="px-10 mb-12 relative z-10 flex flex-col gap-6">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-primary shadow-2xl flex items-center justify-center text-white font-black text-2xl transition-all duration-700 group-hover:rotate-[360deg]">
             Q
          </div>
          <div className="flex flex-col">
             <span className="font-bold text-xl tracking-tight leading-none">Quizzy</span>
             <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mt-1">Intelligence</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden px-8 relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <History className="w-3.5 h-3.5 text-primary" />
             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Recent Sessions</p>
          </div>
          {history.length > 0 && (
            <button onClick={clearHistory} className="text-[8px] font-black text-zinc-300 hover:text-rose-500 uppercase tracking-tighter">Clear</button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
          <AnimatePresence>
            {history.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 rounded-2xl bg-white border border-zinc-100 hover:border-primary/20 transition-all group relative overflow-hidden"
              >
                 <div className="flex items-center justify-between relative z-10">
                    <div className="flex flex-col min-w-0">
                       <span className="text-[10px] font-black text-zinc-800 truncate uppercase mt-1">{item.topic}</span>
                       <span className="text-[8px] font-bold text-zinc-400">Score: {item.score}/{item.total}</span>
                    </div>
                    <div className="text-[14px] font-black text-primary/20 group-hover:text-primary/40 transition-colors">
                       {Math.round((item.score/item.total)*100)}%
                    </div>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {history.length === 0 && (
            <div className="py-20 text-center">
               <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest italic">No data archived.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto p-8 pt-0 relative z-10">
        <div className="pt-6 flex flex-col gap-4 border-t border-zinc-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
               <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold tracking-tight leading-none">Local Research</p>
              <p className="text-[8px] font-black text-zinc-300 uppercase mt-1">Single User Mode</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-zinc-300 hover:text-primary transition-colors">
               <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
