"use client";

import { History, UserCircle, Plus, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import HistoryList from "./HistoryList";

export default function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={cn("w-64 h-screen border-r bg-card/50 backdrop-blur-sm flex flex-col pt-4 overflow-hidden", className)}>
      <div className="flex items-center justify-between mb-8 px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black">Q</div>
          <span className="font-bold text-sm tracking-tight">Quizzy AI</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 mb-4">
          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
            <History className="w-3 h-3" /> Recent History
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <HistoryList />
        </div>
      </div>

      <div className="mt-auto border-t border-border p-6 flex items-center gap-3 bg-muted/20">
        <div className="w-9 h-9 rounded-full bg-background border-2 border-border flex items-center justify-center text-muted-foreground">
           <GraduationCap className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Student</span>
          <span className="text-xs font-bold leading-none">Free Plan</span>
        </div>
      </div>
    </aside>
  );
}
