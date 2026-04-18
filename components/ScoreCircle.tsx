"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export default function ScoreCircle({ score, total }: { score: number; total: number }) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const percentage = (score / total) * 100;
  
  // Spring-based number animation
  const springValue = useSpring(0, { stiffness: 40, damping: 20 });
  const displayValue = useTransform(springValue, (v) => Math.round(v));
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    springValue.set(score);
    const unsubscribe = displayValue.on("change", (latest) => {
      setCurrentScore(latest);
    });
    return () => unsubscribe();
  }, [score, springValue, displayValue]);

  return (
    <div className="relative flex items-center justify-center scale-110 md:scale-125 my-10 group">
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-primary/10 blur-[60px] rounded-full scale-150 opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />
      
      <svg className="w-56 h-56 transform -rotate-90 relative z-10">
        {/* Background Track */}
        <circle
          cx="112"
          cy="112"
          r={radius}
          stroke="url(#trackGradient)"
          strokeWidth="12"
          fill="transparent"
          className="opacity-10"
        />
        <defs>
          <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="#22d3ee" /> {/* Cyan accent */}
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic Progress Ring */}
        <motion.circle
          cx="112"
          cy="112"
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          filter="url(#glow)"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 mb-1">Proficiency</span>
          <div className="flex items-baseline gap-1">
              <motion.span className="text-6xl font-black tracking-tighter text-primary">
                {currentScore}
              </motion.span>
              <span className="text-xl font-bold text-zinc-300">/ {total}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
