"use client";

import { Card } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizQuestionProps {
  question: string;
  options: string[];
  selectedOption?: number;
  onSelect: (index: number) => void;
}

export default function QuizQuestion({ question, options, selectedOption, onSelect }: QuizQuestionProps) {
  const letters = ["A", "B", "C", "D"];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-card border-none shadow-xl shadow-foreground/5 rounded-3xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold leading-tight text-foreground">
          {question}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className={cn(
              "h-16 px-6 justify-start text-left text-lg font-bold rounded-2xl transition-all border-2",
              selectedOption === index 
                ? "border-primary bg-primary/5 shadow-inner" 
                : "border-border hover:border-muted-foreground/30 hover:bg-accent/20"
            )}
            onClick={() => onSelect(index)}
          >
            <span className="mr-3">{letters[index]}.</span>
            <span className="flex-1">{option}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
