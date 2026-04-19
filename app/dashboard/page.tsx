"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { 
  Home, 
  BarChart3, 
  Target, 
  Clock, 
  Medal, 
  BookOpen, 
  Calendar, 
  Loader2,
  Trophy,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BackgroundParticles from "@/components/BackgroundParticles";
import FloatingDecoIcons from "@/components/FloatingDecoIcons";
import { cn } from "@/lib/utils";
import ScoreCircle from "@/components/ScoreCircle";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const attempts = useQuery(api.attempts.getUserAttempts, user ? { userId: user.uid } : "skip") || [];
  const loading = attempts === undefined && !authLoading;

  // Calculations
  const totalQuizzes = attempts.length;
  const bestScore = totalQuizzes > 0 ? Math.max(...attempts.map((a: any) => (a.score/a.total)*100)) : 0;
  const avgScore = totalQuizzes > 0 ? attempts.reduce((acc: number, a: any) => acc + (a.score/a.total)*100, 0) / totalQuizzes : 0;
  const totalTime = attempts.reduce((acc: number, a: any) => acc + a.timeTaken, 0);

  if (!user && !authLoading) {
    return (
       <div className="min-h-screen bg-background dot-grid flex flex-col items-center justify-center p-6 text-center">
          <Target className="w-12 h-12 text-primary/20 mb-6" />
          <h2 className="text-2xl font-black italic tracking-tight text-zinc-800 uppercase mb-4">Secure Profile</h2>
          <p className="text-zinc-500 mb-8 max-w-xs text-sm">Please synchronize your identity to access the intelligence vault.</p>
          <Link href="/login">
            <Button className="rounded-2xl h-14 px-10 bg-primary font-black uppercase tracking-[0.2em] text-[10px] text-white">Login Required</Button>
          </Link>
       </div>
    );
  }

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
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 leading-none mb-2">Researcher Analytics</p>
             <h1 className="text-xl font-black tracking-tight">{user?.displayName || user?.email?.split('@')[0]}'s Profile</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        {loading ? (
             <div className="flex flex-col items-center justify-center p-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
             </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Stats Overview */}
            <div className="lg:col-span-4 space-y-10">
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-10 rounded-[3rem] glass border-white text-center space-y-8">
                  <div className="flex justify-center">
                     <ScoreCircle score={Math.round(bestScore)} total={100} />
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Intelligence Peak</p>
                     <p className="text-xs font-bold text-zinc-400">Your highest conceptual integration</p>
                  </div>
               </motion.div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-white border border-primary/5 space-y-2">
                     <BookOpen className="w-4 h-4 text-primary" />
                     <p className="text-2xl font-black">{totalQuizzes}</p>
                     <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Sessions</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-white border border-primary/5 space-y-2">
                     <Clock className="w-4 h-4 text-primary" />
                     <p className="text-2xl font-black">{Math.round(totalTime/60)}m</p>
                     <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Study Time</p>
                  </div>
               </div>
            </div>

            {/* Activity Stream */}
            <div className="lg:col-span-8 space-y-8">
               <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                     <Calendar className="w-4 h-4 text-primary" />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Intelligence Stream</span>
                  </div>
                  <Link href="/leaderboard" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-primary transition-colors flex items-center gap-1">
                     Global Hierarchy <ArrowUpRight className="w-3 h-3" />
                  </Link>
               </div>

               <div className="space-y-4">
                  {attempts.map((attempt: any, i: number) => (
                    <motion.div
                      key={attempt._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-6 rounded-2xl bg-white border border-zinc-100 hover:border-primary/20 transition-all flex items-center justify-between group"
                    >
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                             <Target className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                             <p className="font-bold text-zinc-800 tracking-tight">{attempt.topic}</p>
                             <div className="flex items-center gap-4 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                                <span>{attempt.score}/{attempt.total} Score</span>
                                <span>•</span>
                                <span>{attempt.timeTaken}s</span>
                                <span>•</span>
                                <span>{new Date(attempt.timestamp).toLocaleDateString() || 'Recent'}</span>
                             </div>
                          </div>
                       </div>
                       <div className="h-10 w-24 bg-zinc-50 rounded-full overflow-hidden p-1 border border-zinc-100">
                          <div className="h-full bg-primary/20 rounded-full" style={{ width: `${(attempt.score/attempt.total)*100}%` }} />
                       </div>
                    </motion.div>
                  ))}

                  {attempts.length === 0 && (
                     <div className="p-20 text-center glass rounded-[3rem] border-primary/5">
                        <p className="text-zinc-400 font-bold italic tracking-widest uppercase text-xs mb-6">No session data synchronized yet.</p>
                        <Link href="/">
                          <Button variant="outline" className="rounded-2xl px-8 border-primary/20 text-xs font-bold">Start First Session</Button>
                        </Link>
                     </div>
                  ) }
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
