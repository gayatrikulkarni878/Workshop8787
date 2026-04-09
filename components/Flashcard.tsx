"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  content: string;
  backContent: string;
}

export default function Flashcard({ content, backContent }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="group perspective-1000 w-full max-w-2xl h-80 md:h-[400px] cursor-pointer mx-auto"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={cn(
        "relative w-full h-full transition-all duration-700 preserve-3d",
        isFlipped ? "rotate-y-180" : ""
      )}>
        {/* Front */}
        <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 md:p-12 bg-card border-2 border-border/50 rounded-[2.5rem] shadow-2xl shadow-foreground/5 text-center">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8">Definition</span>
          <p className="text-2xl md:text-3xl font-medium leading-relaxed text-foreground">
            {content}
          </p>
          <div className="mt-auto pt-8 flex flex-col items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
             <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Tap to reveal</span>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 md:p-12 bg-primary/5 border-2 border-primary/20 rounded-[2.5rem] shadow-2xl shadow-primary/5 text-center">
          <span className="text-xs font-bold text-primary/60 uppercase tracking-[0.2em] mb-8">Meaning</span>
          <p className="text-xl md:text-2xl font-medium leading-relaxed text-foreground italic">
            "{backContent}"
          </p>
          <div className="mt-auto pt-8 flex flex-col items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tap to flip back</span>
          </div>
        </div>
      </div>
    </div>
  );
}
