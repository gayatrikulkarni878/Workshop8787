"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Layers, Home, Sparkles, BrainCircuit, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuizQuestion from "@/components/QuizQuestion";
import { useSearchParams, useRouter } from "next/navigation";
import BackgroundParticles from "@/components/BackgroundParticles";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Suspense } from "react";

interface QuizQuestionData {
  question?: string;
  q?: string;
  options: string[];
  correctIndex: number;
  topic?: string;
}

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
   const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [startTime] = useState(Date.now());

  const id = searchParams.get("id");
  const rawData = searchParams.get("data");
  const historyData = useQuery(api.history.getSingleSet, id ? { id: id as Id<"history"> } : "skip");
  
  const questions = useMemo(() => {
    if (rawData) {
      try {
        return JSON.parse(decodeURIComponent(rawData)) as any[];
      } catch (e) {
        console.error("Failed to parse ephemeral data", e);
      }
    }
    if (!historyData) return [];
    return historyData.data as QuizQuestionData[];
  }, [historyData, rawData]);

  if (historyData === undefined && !rawData) {
    return (
      <div className="min-h-screen bg-background dot-grid flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
        <p className="font-bold text-primary italic uppercase tracking-widest text-[10px]">Configuring Protocol...</p>
      </div>
    );
  }

  if (questions.length === 0 && (historyData !== undefined || !!rawData)) {
    return (
      <div className="min-h-screen bg-background dot-grid flex flex-col items-center justify-center p-6 text-center">
        <p className="font-bold text-zinc-400 uppercase tracking-widest text-xs mb-4">No active protocol found</p>
        <Link href="/">
          <Button variant="outline" className="rounded-2xl border-primary/20 hover:bg-primary/5 transition-all text-black">Return to Studio</Button>
        </Link>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSelect = (index: number) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestion]: index }));
  };

  const handleFinish = () => {
    const results = questions.map((q, i) => {
      return {
        q: q.question || q.q,
        answer: q.options[q.correctIndex],
         userAnswer: userAnswers[i] !== undefined ? q.options[userAnswers[i]] : undefined,
        correct: userAnswers[i] === q.correctIndex,
        explanation: q.explanation || "No explanation available.",
        topic: q.topic || "General"
      };
    });
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const resultObj = {
      sessionId: Math.random().toString(36).substring(2, 15),
      results,
      timeTaken,
      completedAt: new Date().toISOString()
    };
    const encodedResults = encodeURIComponent(JSON.stringify(resultObj));
    router.push(`/results?data=${encodedResults}`);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col items-center bg-background dot-grid text-foreground antialiased">
      <BackgroundParticles />
      
      <header className="w-full max-w-6xl flex items-center justify-between p-4 md:p-12 z-20 sticky top-0 backdrop-blur-3xl border-b border-primary/5">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Button variant="outline" size="icon" className="rounded-2xl glass border-white/80 hover:scale-110 transition-transform">
              <Home className="w-5 h-5 text-primary" />
            </Button>
          </Link>
          <div className="hidden md:block">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 leading-none mb-2">Protocol Session</p>
             <h1 className="text-xl font-black tracking-tight">{historyData?.topic || "Neural Synthesis"}</h1>
          </div>
        </div>

        <div className="flex gap-4">
          <Link href={`/flashcard?id=${id}`}>
            <Button variant="outline" className="rounded-2xl gap-2 font-black text-[10px] uppercase tracking-[0.3em] px-8 glass border-white/80 hover:border-primary/50 transition-all text-black">
              <Layers className="w-4 h-4" /> Flashcards
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl p-6 lg:p-12 z-10 flex flex-col gap-10">
        <div className="flex flex-col gap-4 px-4">
           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">
              <span className="flex items-center gap-2">
                 <BrainCircuit className="w-3.5 h-3.5" /> Conceptual Node {currentQuestion + 1}
              </span>
              <span>{Math.round(progress)}% Integrated</span>
           </div>
           <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "circOut" }}
                className="h-full bg-primary"
              />
           </div>
        </div>

        <section className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <QuizQuestion 
                question={currentQ.question || currentQ.q} 
                options={currentQ.options} 
                onSelect={handleSelect}
                selectedOption={userAnswers[currentQuestion]}
              />
            </motion.div>
          </AnimatePresence>
        </section>

        <footer className="w-full flex justify-between items-center p-4 md:p-12 mt-auto">
          <Button 
            variant="ghost" 
            size="lg" 
            className="rounded-2xl px-10 gap-3 font-black text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:bg-zinc-100/50 transition-all"
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="w-5 h-5" /> Previous node
          </Button>

          {currentQuestion === questions.length - 1 ? (
            <Button 
              size="lg" 
              className="rounded-2xl px-12 gap-3 font-black text-[11px] uppercase tracking-[0.3em] bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all border-none"
              onClick={handleFinish}
            >
              Finalize Synthesis <Sparkles className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="lg" 
              className="rounded-2xl px-10 gap-3 font-black text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:bg-zinc-100/50 transition-all"
              onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={userAnswers[currentQuestion] === undefined}
            >
              Next node <ChevronRight className="w-5 h-5" />
            </Button>
          )}
        </footer>
      </main>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background dot-grid flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
        <p className="font-bold text-primary italic uppercase tracking-widest text-[10px]">Initializing...</p>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
