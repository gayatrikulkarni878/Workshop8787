"use client";

import Link from "next/link";
import { CheckCircle2, XCircle, ChevronRight, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScoreCircle from "@/components/ScoreCircle";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ResultsPage() {
  const reviews = [
    { q: "Function of Mitochondria?", correct: true, answer: "Energy Production" },
    { q: "Largest organ in human body?", correct: false, answer: "Skin", user: "Liver" },
    { q: "Capital of France?", correct: true, answer: "Paris" },
    { q: "DNA Full Form?", correct: true, answer: "Deoxyribonucleic acid" },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-12 flex flex-col items-center">
      <header className="w-full max-w-5xl flex justify-start mb-8">
        <Link href="/">
          <Button variant="outline" className="rounded-2xl gap-2 font-bold group border-border/50">
            <Home className="w-4 h-4 transition-transform group-hover:scale-110" /> Home
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-2xl text-center space-y-12 pb-20">
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000">
           <Badge variant="outline" className="px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-primary/5 border-primary/20 text-primary">
             Assessment Complete
           </Badge>
           <h1 className="text-4xl md:text-5xl font-black text-foreground">Top-tier Performance!</h1>
        </div>

        <section className="flex flex-col items-center py-8 animate-in zoom-in-95 duration-700">
          <ScoreCircle score={8} total={10} />
          <p className="mt-8 text-muted-foreground font-medium text-lg italic">"You've mastered the core concepts. Ready for the next level?"</p>
        </section>

        <section className="space-y-4 text-left animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 ml-4">Review Your Answers</h3>
          <div className="grid gap-3">
            {reviews.map((item, i) => (
              <Card key={i} className="p-5 md:p-6 rounded-3xl border-none shadow-sm bg-card/60 backdrop-blur-sm flex items-center gap-5 group hover:shadow-md transition-shadow">
                <div className={item.correct ? "text-green-500" : "text-destructive"}>
                  {item.correct ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-lg mb-2">{item.q}</p>
                  <div className="inline-block bg-muted/50 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground border border-border/50">
                    Review: correct answer is <span className="text-foreground font-bold">{item.answer}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-foreground transition-colors mr-2" />
              </Card>
            ))}
          </div>
        </section>

        <Link href="/quiz">
          <Button size="xl" className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 gap-3 group">
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" /> Retry Quiz
          </Button>
        </Link>
      </main>
    </div>
  );
}
