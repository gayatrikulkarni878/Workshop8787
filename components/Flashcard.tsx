"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles, BrainCircuit } from "lucide-react";

interface FlashcardProps {
  content: string;
  backContent: string;
}

export default function Flashcard({ content, backContent }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="perspective-1000 w-full max-w-2xl h-[450px] cursor-pointer mx-auto"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div 
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20, 
          duration: 0.6 
        }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-12 md:p-24 bg-white/80 backdrop-blur-3xl border border-primary/10 rounded-[4rem] shadow-2xl shadow-primary/5 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="mb-14 p-6 rounded-3xl bg-primary/5 text-primary border border-primary/10">
             <BrainCircuit className="w-12 h-12" />
          </div>
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-6">Neural Concept</span>
          <p className="text-2xl md:text-5xl font-black leading-tight tracking-tighter">
            {content}
          </p>
          <div className="mt-auto pt-12">
             <div className="flex items-center gap-2 justify-center">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Breakdown ready</span>
             </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] flex flex-col items-center justify-center p-6 md:p-24 bg-zinc-950 text-white dark:bg-zinc-50 dark:text-black border border-primary/10 rounded-[4rem] shadow-2xl text-center overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <div className="mb-14 p-6 rounded-3xl bg-white/10 dark:bg-black/10 text-white dark:text-black">
             <Sparkles className="w-12 h-12" />
          </div>
          <p className="text-lg md:text-4xl font-medium leading-relaxed tracking-tight italic">
            &quot;{backContent}&quot;
          </p>
          <div className="mt-auto pt-12">
             <div className="h-1.5 w-16 bg-primary/40 rounded-full mx-auto" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
