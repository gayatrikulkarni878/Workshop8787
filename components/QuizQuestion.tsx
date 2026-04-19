"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles, Brain } from "lucide-react";

interface QuizQuestionProps {
  question: string;
  options: string[];
  selectedOption?: number;
  onSelect: (index: number) => void;
}

export default function QuizQuestion({ question, options, selectedOption, onSelect }: QuizQuestionProps) {
  const letters = ["A", "B", "C", "D"];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass border border-white shadow-sm rounded-3xl p-10 md:p-14 text-center relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="flex justify-center mb-8 relative">
           <motion.div 
             animate={{ y: [0, -5, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="p-4 rounded-2xl bg-primary/5 text-primary border border-primary/10 relative z-10"
           >
              <Brain className="w-6 h-6" />
           </motion.div>
           <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-20 scale-150" />
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground leading-tight relative z-10">
          {question}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              backgroundColor: selectedOption === index ? "rgb(74, 52, 39)" : "rgba(255, 255, 255, 0.4)",
              color: selectedOption === index ? "rgb(255, 255, 255)" : "rgb(63, 63, 70)"
            }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ 
              y: -4, 
              scale: 1.01,
              backgroundColor: selectedOption === index ? "rgb(74, 52, 39)" : "rgba(255, 255, 255, 0.8)",
              boxShadow: "0 20px 40px -15px rgba(0,0,0,0.05)"
            }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "p-6 min-h-20 text-left flex items-center gap-5 rounded-2xl border transition-all duration-500 relative overflow-hidden",
              selectedOption === index 
                ? "border-primary shadow-xl shadow-primary/20 ring-4 ring-primary/20" 
                : "border-zinc-100 backdrop-blur-xl hover:border-primary/30"
            )}
            onClick={() => onSelect(index)}
          >
            <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border transition-all duration-500 shrink-0",
                selectedOption === index ? "bg-white text-primary border-white" : "bg-primary/5 border-primary/10 text-primary"
            )}>
              {letters[index]}
            </div>
            <span className={cn(
              "font-semibold text-lg leading-snug transition-colors duration-500 relative z-10",
              selectedOption === index ? "text-white" : "text-zinc-700"
            )}>
              {option || "No option text provided"}
            </span>
            {selectedOption === index && (
              <motion.div 
                layoutId="active-indicator"
                className="ml-auto"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Sparkles className="w-5 h-5 text-white/80" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedOption !== undefined && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4 items-center"
          >
            <Sparkles className="w-5 h-5 text-primary shrink-0" />
            <div className="space-y-0.5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-primary">Intelligence Insight</p>
              <p className="text-xs font-semibold text-zinc-600">
                Connection established with option {letters[selectedOption]}. Preparing next conceptual bridge.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
