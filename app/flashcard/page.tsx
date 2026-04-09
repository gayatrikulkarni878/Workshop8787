"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Layers, Home, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Flashcard from "@/components/Flashcard";
import { useSearchParams } from "next/navigation";

export default function FlashcardPage() {
  const searchParams = useSearchParams();
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data));
        setFlashcards(parsed);
      } catch (e) {
        console.error("Failed to parse flashcard data", e);
      }
    }
  }, [searchParams]);

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-bold text-muted-foreground animate-pulse">Preparing your Cards...</p>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl flex items-center justify-between mb-16">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Home className="w-5 h-5" />
          </Button>
        </Link>
        
        <div className="flex gap-2 bg-muted/50 p-1.5 rounded-2xl overflow-x-auto max-w-[50%] md:max-w-none no-scrollbar">
          {flashcards.map((_, index) => (
            <button
              key={index}
              className={cn(
                "min-w-[40px] h-10 rounded-xl text-sm font-bold transition-all",
                currentIndex === index ? "bg-card text-foreground shadow-sm ring-1 ring-border/50" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setCurrentIndex(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <Link href="/quiz">
          <Button variant="outline" className="rounded-2xl gap-2 font-bold text-xs uppercase tracking-widest px-6">
            <BrainCircuit className="w-4 h-4" /> Switch Quiz
          </Button>
        </Link>
      </header>

      <main className="flex-1 w-full flex items-center justify-center gap-4 md:gap-12 py-12 px-4 overflow-hidden">
        {/* Left Side Card Preview */}
        <div className="hidden lg:block w-48 h-64 bg-card/40 border border-border/50 rounded-[1.5rem] opacity-30 transform -rotate-6 scale-90" />

        {/* Central Card */}
        <div className="flex-1 max-w-2xl">
          <Flashcard 
            content={currentCard.front} 
            backContent={currentCard.back} 
          />
        </div>

        {/* Right Side Card Preview */}
        <div className="hidden lg:block w-48 h-64 bg-card/40 border border-border/50 rounded-[1.5rem] opacity-30 transform rotate-6 scale-90" />
      </main>

      <footer className="w-full max-w-2xl flex justify-between items-center mt-12 pb-12">
        <Button 
          variant="ghost" 
          size="lg" 
          className="rounded-2xl px-8 gap-3 font-bold text-muted-foreground hover:text-foreground hover:bg-accent/50 group"
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" /> Prev
        </Button>

        <Button 
          variant="ghost" 
          size="lg" 
          className="rounded-2xl px-8 gap-3 font-bold text-muted-foreground hover:text-foreground hover:bg-accent/50 group"
          onClick={() => setCurrentIndex(prev => Math.min(flashcards.length - 1, prev + 1))}
          disabled={currentIndex === flashcards.length - 1}
        >
          Next <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
        </Button>
      </footer>
    </div>
  );
}
