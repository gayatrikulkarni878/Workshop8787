"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Home, BrainCircuit, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Flashcard from "@/components/Flashcard";
import BackgroundParticles from "@/components/BackgroundParticles";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Suspense } from "react";

interface FlashcardData {
  front: string;
  back: string;
}

function FlashcardContent() {
  const searchParams = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);

  const id = searchParams.get("id");
  const rawData = searchParams.get("data");
  const historyData = useQuery(api.history.getSingleSet, id ? { id: id as Id<"history"> } : "skip");

  const flashcards = useMemo(() => {
    if (rawData) {
      try {
        return JSON.parse(decodeURIComponent(rawData)) as FlashcardData[];
      } catch (e) {
        console.error("Failed to parse ephemeral data", e);
      }
    }
    if (!historyData) return [];
    return historyData.data as FlashcardData[];
  }, [historyData, rawData]);

  if (historyData === undefined && !rawData) {
    return (
      <div className="min-h-screen bg-background dot-grid flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
        <p className="font-bold text-primary italic uppercase tracking-widest text-[10px]">Restoring Mnemonic Canvas...</p>
      </div>
    );
  }

  if (flashcards.length === 0 && (historyData !== undefined || !!rawData)) {
    return (
      <div className="min-h-screen bg-background dot-grid flex flex-col items-center justify-center p-6 text-center">
        <p className="font-bold text-zinc-400 uppercase tracking-widest text-xs mb-4">No active canvas found</p>
        <Link href="/">
          <Button variant="outline" className="rounded-2xl border-primary/20 hover:bg-primary/5 transition-all text-black">Return to Studio</Button>
        </Link>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  const handleShare = () => {
    const topic = historyData?.topic || "Neural Mastery Pack";
    let text = `🧠 Quizzy AI - ${topic}\n\n`;
    flashcards.forEach((card, i) => {
      text += `[${i + 1}] ${card.front}\n💡 ${card.back}\n\n`;
    });
    text += `🚀 Mastered with Quizzy AI Core Intelligence`;
    navigator.clipboard.writeText(text);
    alert("Learning pack copied! ⚡");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen relative overflow-hidden bg-background text-foreground dot-grid flex flex-col items-center"
    >
      <BackgroundParticles />
      
      <header className="w-full max-w-6xl flex items-center justify-between p-8 md:p-12 z-20 sticky top-0 backdrop-blur-3xl border-b border-primary/5">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Button variant="outline" size="icon" className="rounded-2xl glass border-white/80 hover:scale-110 transition-transform">
              <Home className="w-5 h-5 text-primary" />
            </Button>
          </Link>
          <div className="hidden md:block">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 leading-none mb-2">Mnemonic Canvas</p>
             <h1 className="text-xl font-black tracking-tight">{historyData?.topic || "Neural Restoration"}</h1>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleShare} variant="outline" size="icon" className="rounded-2xl glass border-white/80 hover:shadow-md transition-all">
            <Share2 className="w-4 h-4 text-primary" />
          </Button>
          <Link href={`/quiz?id=${id}`}>
            <Button variant="outline" className="rounded-2xl gap-3 font-black text-[10px] uppercase tracking-[0.3em] px-8 glass border-white/80 text-black hover:border-primary/50 transition-all">
              <BrainCircuit className="w-4 h-4" /> Quiz
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full flex items-center justify-center p-8 lg:p-16 overflow-hidden relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateX: -20 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl"
          >
            <Flashcard 
              content={currentCard.front} 
              backContent={currentCard.back} 
            />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="w-full max-w-4xl flex justify-between items-center p-8 md:p-12 mt-auto mb-10 z-20">
        <Button 
          variant="ghost" 
          size="lg" 
          className="rounded-2xl px-12 gap-3 font-black text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:bg-zinc-100/50 transition-all"
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </Button>

        <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 mb-2">Neural Progress</p>
            <div className="text-sm font-black tracking-tighter">{currentIndex + 1} <span className="text-zinc-300 mx-1">/</span> {flashcards.length}</div>
        </div>

        <Button 
          variant="ghost" 
          size="lg" 
          className="rounded-2xl px-12 gap-3 font-black text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:bg-zinc-100/50 transition-all"
          onClick={() => setCurrentIndex(prev => Math.min(flashcards.length - 1, prev + 1))}
          disabled={currentIndex === flashcards.length - 1}
        >
          Forward <ChevronRight className="w-5 h-5" />
        </Button>
      </footer>
    </motion.div>
  );
}

export default function FlashcardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background dot-grid flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
        <p className="font-bold text-primary italic uppercase tracking-widest text-[10px]">Initializing...</p>
      </div>
    }>
      <FlashcardContent />
    </Suspense>
  );
}
