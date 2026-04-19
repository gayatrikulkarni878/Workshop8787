"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Trophy, Medal, Star, Clock, Home, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BackgroundParticles from "@/components/BackgroundParticles";
import FloatingDecoIcons from "@/components/FloatingDecoIcons";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
  const leaders = useQuery(api.attempts.getLeaderboard) || [];
  const loading = leaders === undefined;

  return (
    <div className="min-h-screen relative overflow-hidden bg-background dot-grid text-foreground pb-20">
      <BackgroundParticles />
      <FloatingDecoIcons />

      <header className="w-full max-w-6xl mx-auto flex items-center justify-between p-8 md:p-12 z-20 relative">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Button variant="outline" size="icon" className="rounded-2xl glass border-white/80 hover:scale-110 transition-transform">
              <Home className="w-5 h-5 text-primary" />
            </Button>
          </Link>
          <div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 leading-none mb-2">Global Hierarchy</p>
             <h1 className="text-xl font-black tracking-tight">Intelligence Leaderboard</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Querying Intelligence Hierarchy...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {leaders.map((leader: any, i: number) => (
              <motion.div
                key={leader._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "p-8 rounded-[2rem] border-2 transition-all duration-500 relative overflow-hidden flex items-center gap-8",
                  i === 0 ? "bg-white border-yellow-400/30 shadow-xl shadow-yellow-100/20" : 
                  i === 1 ? "bg-white border-zinc-300/30 shadow-xl shadow-zinc-100/20" :
                  i === 2 ? "bg-white border-orange-300/30 shadow-xl shadow-orange-100/20" :
                  "bg-white/40 border-primary/5 hover:border-primary/20 backdrop-blur-xl"
                )}
              >
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 shadow-lg",
                    i === 0 ? "bg-yellow-400 text-white" : 
                    i === 1 ? "bg-zinc-400 text-white" : 
                    i === 2 ? "bg-orange-400 text-white" : 
                    "bg-zinc-100 text-zinc-400"
                )}>
                    {i === 0 ? <Trophy className="w-6 h-6" /> : i + 1}
                </div>

                <div className="flex-1 space-y-1">
                   <div className="flex items-center gap-2">
                      <span className="text-lg font-bold tracking-tight text-zinc-800">{leader.userName}</span>
                      {i < 3 && <Medal className={cn("w-4 h-4", i === 0 ? "text-yellow-400" : i === 1 ? "text-zinc-400" : "text-orange-400")} />}
                   </div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{leader.topic}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                   <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-primary">{Math.round((leader.score/leader.total)*100)}%</span>
                      <span className="text-[10px] font-bold text-zinc-300 tracking-widest">RANK</span>
                   </div>
                   <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                       <span className="flex items-center gap-1"><Medal className="w-3 h-3" /> {leader.score}/{leader.total}</span>
                       <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {leader.timeTaken}s</span>
                   </div>
                </div>

                {i === 0 && (
                   <div className="absolute top-0 right-0 p-1 bg-yellow-400/10 rounded-bl-2xl">
                      <Star className="w-3 h-3 text-yellow-400" />
                   </div>
                )}
              </motion.div>
            ))}
            
            {leaders.length === 0 && (
               <div className="p-20 text-center glass rounded-[3rem] border-primary/5">
                  <p className="text-zinc-400 font-bold italic tracking-widest uppercase text-xs">The hierarchy is currently empty.</p>
               </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
