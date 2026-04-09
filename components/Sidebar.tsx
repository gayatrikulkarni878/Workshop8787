"use client";

import { History, UserCircle, Plus, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Sidebar({ className }: { className?: string }) {
  const historyItems = [
    "Quantum Physics Basics",
    "Modern Art History",
    "JavaScript Closures",
    "Plant Biology 101",
  ];

  return (
    <aside className={cn("w-64 h-screen border-r bg-card/50 backdrop-blur-sm flex flex-col p-4", className)}>
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="w-10 h-10 rounded-xl border-2 border-border flex items-center justify-center text-muted-foreground/50">
           <div className="w-6 h-6 border-2 border-current rounded-md overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-current" />
              <div className="absolute bottom-0 left-0 w-[40%] h-[30%] border-t-2 border-r-2 border-current" />
           </div>
        </div>
      </div>
      
      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-2">History</div>
      <div className="h-[2px] w-full bg-border mb-4" />

      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-4 px-3">
          <History className="w-3 h-3" /> Recent History
        </div>
        <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-300px)] pr-1">
          {historyItems.map((item, i) => (
            <button
              key={i}
              className="w-full text-left px-3 py-2.5 text-sm rounded-lg hover:bg-accent/50 transition-all text-muted-foreground hover:text-foreground truncate group"
            >
              <span className="opacity-0 group-hover:opacity-100 mr-1 transition-opacity">→</span>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t-2 border-border pt-4 px-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center text-muted-foreground">
           <UserCircle className="w-6 h-6" />
        </div>
        <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Account</span>
      </div>
    </aside>
  );
}
