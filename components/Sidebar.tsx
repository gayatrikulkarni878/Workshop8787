"use client";

import { History, GraduationCap, Sparkles, Star, Command, Info, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import HistoryList from "./HistoryList";
import { Button } from "./ui/button";

export default function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={cn("w-80 h-screen border-r border-zinc-100 bg-white/70 backdrop-blur-3xl flex flex-col pt-16 overflow-hidden relative dot-grid", className)}>
      <div className="px-10 mb-16 relative z-10">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-primary shadow-2xl flex items-center justify-center text-white font-black text-2xl transition-all duration-700 group-hover:rotate-[360deg]">
             Q
          </div>
          <div className="flex flex-col">
             <span className="font-bold text-xl tracking-tight leading-none">Quizzy</span>
             <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mt-1">Intelligence</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden px-6 relative z-10">
        <div className="px-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Command className="w-3.5 h-3.5 text-primary" />
             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Archives</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <HistoryList />
        </div>
      </div>

      <div className="mt-auto p-8 pt-0 relative z-10 space-y-8">


        <div className="pt-6 flex flex-col gap-4 border-t border-zinc-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
               <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold tracking-tight leading-none">Research Mode</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-zinc-300 hover:text-primary transition-colors">
               <Info className="w-4 h-4" />
            </Button>
          </div>

          <Button 
            variant="ghost" 
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              window.location.href = "/login";
            }}
            className="w-full h-12 rounded-2xl gap-4 justify-start px-0 text-zinc-400 hover:text-rose-500 hover:bg-rose-50/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-transparent group-hover:bg-rose-500/10 flex items-center justify-center transition-all ml-4">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">End Protocol</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
