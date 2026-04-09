"use client";

import { useEffect, useState } from "react";

export default function ScoreCircle({ score, total }: { score: number; total: number }) {
  const [offset, setOffset] = useState(0);
  const percentage = (score / total) * 100;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = circumference - (percentage / 100) * circumference;
    setOffset(progressOffset);
  }, [percentage, circumference]);

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-56 h-56 transform -rotate-90">
        <circle
          cx="112"
          cy="112"
          r={radius}
          stroke="currentColor"
          strokeWidth="16"
          fill="transparent"
          className="text-muted/30"
        />
        <circle
          cx="112"
          cy="112"
          r={radius}
          stroke="currentColor"
          strokeWidth="16"
          fill="transparent"
          strokeDasharray={circumference}
          style={{ 
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 1.5s ease-in-out'
          }}
          strokeLinecap="round"
          className="text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Score</span>
        <span className="text-4xl font-black text-foreground">{score}/{total}</span>
      </div>
    </div>
  );
}
