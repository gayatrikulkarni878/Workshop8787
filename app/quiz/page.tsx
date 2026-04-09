"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Layers, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import QuizQuestion from "@/components/QuizQuestion";
import { useSearchParams } from "next/navigation";

export default function QuizPage() {
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | undefined>(undefined);

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data));
        setQuestions(parsed);
      } catch (e) {
        console.error("Failed to parse quiz data", e);
      }
    }
  }, [searchParams]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-bold text-muted-foreground animate-pulse">Preparing your Quiz...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  const progress = ((currentQuestion + 1) / 10) * 100;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl flex items-center justify-between mb-12">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
            <Home className="w-5 h-5" />
          </Button>
        </Link>
        
        <div className="flex-1 max-w-md mx-8">
           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
             <span>Question {currentQuestion + 1} of 10</span>
             <span>{Math.round(progress)}% Complete</span>
           </div>
           <Progress value={progress} className="h-2 bg-muted border border-border/50" />
        </div>

        <Link href="/flashcard">
          <Button variant="outline" className="rounded-2xl gap-2 font-bold text-xs uppercase tracking-widest px-6 shadow-sm">
            <Layers className="w-4 h-4" /> Switch Flash
          </Button>
        </Link>
      </header>

      <main className="flex-1 w-full flex flex-col justify-center">
        <QuizQuestion 
          question={currentQ.question || currentQ.q} 
          options={currentQ.options} 
          selectedOption={selectedOption}
          onSelect={setSelectedOption}
        />
      </main>

      <footer className="w-full max-w-5xl flex justify-between items-center mt-12 pb-8">
        <Button 
          variant="outline" 
          size="lg" 
          className="rounded-2xl px-8 gap-2 font-bold"
          disabled={currentQuestion === 0}
        >
          <ChevronLeft className="w-5 h-5" /> Previous
        </Button>

        {currentQuestion === 9 ? (
          <Link href="/results">
            <Button size="lg" className="rounded-2xl px-12 font-bold shadow-lg shadow-primary/20 bg-primary hover:scale-105 transition-transform">
              Finish Quiz
            </Button>
          </Link>
        ) : (
          <Button 
            size="lg" 
            className="rounded-2xl px-10 gap-2 font-bold shadow-lg shadow-primary/10"
            onClick={() => {
              setCurrentQuestion(prev => prev + 1);
              setSelectedOption(undefined);
            }}
          >
            Next <ChevronRight className="w-5 h-5" />
          </Button>
        )}
      </footer>
    </div>
  );
}
