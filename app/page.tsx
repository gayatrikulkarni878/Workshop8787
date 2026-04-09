"use client";

import { useState, useRef, useTransition } from "react";
import { ArrowRight, Upload, Layers, BrainCircuit, Sparkles, FileText, Loader2, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { generateContent } from "@/app/actions";

export default function Home() {
  const [activeMode, setActiveMode] = useState<"quiz" | "flashcard">("quiz");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGenerate = async () => {
    if (!notes.trim() && !file) {
      alert("Please provide some notes or upload a file");
      return;
    }

    const formData = new FormData();
    formData.append("notes", notes);
    if (file) formData.append("file", file);
    formData.append("mode", activeMode);
    formData.append("count", "10"); // Force count = 10

    startTransition(async () => {
      try {
        const response = await generateContent(formData);
        if (response.success) {
          const encodedData = encodeURIComponent(JSON.stringify(response.data));
          window.location.href = `/${response.mode}?data=${encodedData}`;
        } else {
          alert("Generation failed. Please try again.");
        }
      } catch (error) {
        alert("An unexpected error occurred. Please try again.");
        console.error(error);
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar - Hidden on mobile */}
      <Sidebar className="hidden lg:flex" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-16 lg:hidden">
           <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">Q</div>
            <span className="font-bold text-lg">Quizzy AI</span>
          </div>
          <Button variant="ghost" size="icon">
             <Upload className="w-5 h-5" />
          </Button>
        </header>

        <section className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center items-center text-center space-y-12">
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
            <Badge variant="secondary" className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/5 text-primary border-primary/10">
              <Sparkles className="w-3 h-3 mr-2" /> Powered by Groq
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
              Quizzy <span className="text-muted-foreground/30">AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-lg mx-auto">
              Learn any topic with fun. Just drop your notes and let AI do the magic.
            </p>
          </div>

          <Card className="w-full max-w-4xl overflow-hidden rounded-[2.5rem] border-none shadow-2xl shadow-foreground/5 bg-card/90 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-700 delay-200">
            <div className="flex flex-col md:flex-row h-full min-h-[450px]">
              {/* Left Side: Input Zone */}
              <div className="flex-[1.5] p-8 border-b md:border-b-0 md:border-r border-border/50 flex flex-col gap-6 bg-muted/20">
                <div className="flex-1 flex flex-col gap-4 relative">
                  <textarea
                    placeholder="Paste your notes, essay, or study material here..."
                    className="flex-1 w-full bg-transparent border-none focus:ring-0 resize-none text-lg placeholder:text-muted-foreground/50 scrollbar-hide"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  
                  {file && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm rounded-2xl border border-primary/20 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left overflow-hidden">
                        <p className="text-sm font-bold truncate">{file.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">{(file.size / 1024).toFixed(1)} KB • Ready</p>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={clearFile}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div 
                  className="h-24 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 bg-background/50 hover:bg-background transition-colors cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                  />
                  <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-xs font-bold text-muted-foreground">Upload PDF, DOCX, or TXT</span>
                </div>
              </div>

              {/* Right Side: Options */}
              <div className="flex-1 p-8 flex flex-col gap-6 relative">
                <div className="flex-1 flex flex-col gap-6">
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-left block">Mode Selection</span>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant={activeMode === "quiz" ? "default" : "outline"}
                        className={cn(
                          "h-24 rounded-2xl flex flex-col gap-2 font-bold border-2 transition-all",
                          activeMode === "quiz" ? "border-primary shadow-lg shadow-primary/20" : "border-border/50"
                        )}
                        onClick={() => setActiveMode("quiz")}
                      >
                        <BrainCircuit className={cn("w-6 h-6", activeMode === "quiz" ? "text-primary-foreground" : "text-primary")} />
                        Quiz
                      </Button>
                      <Button
                        variant={activeMode === "flashcard" ? "default" : "outline"}
                        className={cn(
                          "h-24 rounded-2xl flex flex-col gap-2 font-bold border-2 transition-all",
                          activeMode === "flashcard" ? "border-primary shadow-lg shadow-primary/20" : "border-border/50"
                        )}
                        onClick={() => setActiveMode("flashcard")}
                      >
                        <Layers className={cn("w-6 h-6", activeMode === "flashcard" ? "text-primary-foreground" : "text-primary")} />
                        Cards
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border-2 border-border/50 bg-background/50 flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-left">Questions Count</span>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black">10</span>
                      <Badge variant="outline" className="text-[10px] font-black uppercase">Standard</Badge>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <Button 
                  size="lg" 
                  className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  onClick={handleGenerate}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </section>

        <footer className="mt-auto pt-12 text-center">
          <p className="text-xs font-bold text-muted-foreground/30 uppercase tracking-[0.4em]">Designed for Perfection • 2026</p>
        </footer>
      </main>
    </div>
  );
}
