"use client";

import { useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Layers, Star, Loader2, RefreshCw, BarChart3, Clock, Send, Share, Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ScoreCircle from "@/components/ScoreCircle";
import BackgroundParticles from "@/components/BackgroundParticles";
import FloatingDecoIcons from "@/components/FloatingDecoIcons";
import { saveQuizResult } from "@/lib/history";
import confetti from "canvas-confetti";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter(); 
  const data = searchParams.get("data");

  const sessionData = useMemo(() => {
    if (!data) return null;
    try {
      return JSON.parse(decodeURIComponent(data));
    } catch (e) {
      console.error("Failed to parse results data", e);
      return null;
    }
  }, [data]);

  const results = sessionData?.results || [];
  const timeTaken = sessionData?.timeTaken || 0;
  const sessionId = sessionData?.sessionId;

  const { score, percentage } = useMemo(() => {
    const s = results.filter((r: any) => r.correct).length;
    const p = results.length > 0 ? (s / results.length) * 100 : 0;
    return { score: s, percentage: p };
  }, [results]);

  const topicAnalysis = useMemo(() => {
    const topics: Record<string, { correct: number; total: number }> = {};
    results.forEach((r: any) => {
      const t = r.topic || "General";
      if (!topics[t]) topics[t] = { correct: 0, total: 0 };
      topics[t].total++;
      if (r.correct) topics[t].correct++;
    });
    return Object.entries(topics);
  }, [results]);

  useEffect(() => {
    if (results.length > 0) {
      saveQuizResult({
        topic: results[0]?.topic || "AI Synthesis",
        score,
        total: results.length,
        sessionId: sessionId
      });

      if (percentage >= 70) {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) return clearInterval(interval);
          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      }
    }
  }, [results, score, percentage, sessionId]);

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-background dot-grid flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
        <p className="font-bold text-primary italic uppercase tracking-widest text-[10px]">Assembling Neural Outcome...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col items-center bg-background dot-grid text-foreground">
      <BackgroundParticles />
      <FloatingDecoIcons />
      
      <header className="w-full max-w-6xl flex items-center justify-between p-6 md:p-12 z-10 sticky top-0 backdrop-blur-3xl border-b border-primary/5">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Button variant="outline" size="icon" className="rounded-2xl glass border-white/80 hover:scale-110 transition-transform">
              <Home className="w-5 h-5 text-primary" />
            </Button>
          </Link>
          <div className="hidden md:block">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 leading-none mb-2">Analysis Report</p>
             <h1 className="text-xl font-black tracking-tight">Conceptual Diagnostics</h1>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => router.push("/")} className="rounded-2xl gap-3 font-black text-[10px] uppercase tracking-[0.3em] px-8 bg-primary shadow-xl shadow-primary/20 hover:scale-105 transition-transform text-white border-none">
            <Plus className="w-4 h-4" /> New Session
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl p-4 md:p-16 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 rounded-[3rem] glass border-white text-center relative overflow-hidden"
            >
              <div className="mb-10 flex justify-center">
                <ScoreCircle score={score} total={results.length} />
              </div>
              <p className="text-[12px] font-black uppercase tracking-[0.4em] text-primary mb-2">Mastery Index</p>
              <p className="text-4xl font-black italic tracking-tighter text-zinc-800">
                {score}/{results.length}
              </p>
              <div className="mt-8 pt-8 border-t border-primary/5 space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Status: {percentage >= 80 ? 'Elite' : percentage >= 50 ? 'Proficient' : 'Training'}</p>
                 <div className="flex items-center justify-center gap-2 text-primary">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{timeTaken}s Total Time</span>
                 </div>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10 text-center"
            >
               <p className="text-sm font-semibold text-primary italic">
                 {percentage === 100 ? "Pure brilliance. You've mastered this domain." : 
                  percentage >= 80 ? "Exceptional performance. Minor refinements needed." :
                  percentage >= 50 ? "Solid foundation. Keep synthesizing." :
                  "The path to mastery begins with persistence. Try again."}
               </p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="p-10 rounded-[2.5rem] bg-white/40 border border-white/50 backdrop-blur-xl space-y-8"
            >
               <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Topic Mastery</span>
               </div>
               <div className="space-y-6">
                  {topicAnalysis.map(([topic, stats]: any, idx) => (
                    <div key={topic} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          <span className="truncate max-w-[120px]">{topic}</span>
                          <span>{Math.round((stats.correct / stats.total) * 100)}%</span>
                       </div>
                       <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.correct / stats.total) * 100}%` }} transition={{ duration: 2, delay: idx * 0.1 }} className="h-full bg-primary/40" />
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          </div>

          <div className="lg:col-span-8 space-y-10">
            <div className="flex items-center justify-between mb-2 px-4">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Conceptual Review</span>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                     <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-wider">Mastered</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-lg shadow-rose-500/20" />
                     <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-wider">Revision</span>
                  </div>
               </div>
            </div>

            <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-4 no-scrollbar">
              {results.map((r: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "p-8 rounded-[2rem] border-2 transition-all duration-700 relative overflow-hidden hover:scale-[1.01]",
                    r.correct 
                      ? "bg-white border-primary/10" 
                      : "bg-white border-rose-100/50"
                  )}
                >
                  <div className="flex gap-8">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                      r.correct ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                    )}>
                      {r.correct ? <Sparkles className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                    </div>
                    <div className="space-y-4 flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-xl font-bold tracking-tight text-zinc-900 leading-snug lg:max-w-[80%]">
                           {r.q}
                        </p>
                        {r.topic && <span className="text-[8px] font-black border border-zinc-100 px-2 py-1 rounded-full text-zinc-400 uppercase tracking-widest">{r.topic}</span>}
                      </div>
                      <div className="flex flex-wrap gap-x-12 gap-y-4 pt-2">
                         <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Result</span>
                            <p className={cn("text-sm font-bold", r.correct ? "text-emerald-600" : "text-rose-600")}>{r.userAnswer || 'No Selection'}</p>
                         </div>
                          {!r.correct && (
                           <div className="space-y-1">
                              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Correct Answer</span>
                              <p className="text-sm font-bold text-emerald-600">{r.answer}</p>
                           </div>
                          )}
                      </div>
                      <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100/50">
                         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Intelligence Insight</p>
                         <p className="text-xs text-zinc-500 leading-relaxed italic">{r.explanation || "No further data available for this node."}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <footer className="pt-10 flex flex-col md:flex-row items-center justify-center gap-6">
              <Link href="/">
                <Button size="lg" className="h-16 px-12 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] gap-3 bg-primary text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95 border-none">
                  <RefreshCw className="w-4 h-4" /> Reset Mastery Session
                </Button>
              </Link>
              <div className="flex gap-4">
                 <Button 
                   variant="outline" 
                   onClick={() => window.print()}
                   className="h-16 w-16 rounded-[2rem] glass border-white/80 hover:scale-110 transition-transform"
                 >
                    <Send className="w-5 h-5 text-primary" />
                 </Button>
                 <Button 
                   variant="outline" 
                   onClick={() => {
                     const text = `I just scored ${score}/${results.length} on Quizzy AI! 🧠🔥 Check it out!`;
                     window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`, '_blank');
                   }}
                   className="h-16 w-16 rounded-[2rem] glass border-white/80 hover:scale-110 transition-transform"
                 >
                    <Share className="w-5 h-5 text-primary" />
                 </Button>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Results() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-background dot-grid flex flex-col items-center justify-center p-6 text-center">
         <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
         <p className="font-bold text-primary italic uppercase tracking-widest text-[10px]">Assembling Neural Outcome...</p>
       </div>
    }>
       <ResultsContent />
    </Suspense>
  )
}
