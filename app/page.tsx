"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, BrainCircuit, Sparkles, FileText, Loader2, X, Plus, ArrowRight, RefreshCw } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import BackgroundParticles from "@/components/BackgroundParticles";
import FloatingDecoIcons from "@/components/FloatingDecoIcons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { generateContent } from "@/app/actions";
import { saveToLocalHistory } from "@/lib/history";

const loadingStates = [
  "Curating knowledge base...",
  "Distilling essential paths...",
  "Elegance in processing...",
  "Neural synthesis in progress...",
  "Synchronizing intelligence..."
];

export default function Home() {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState<"quiz" | "flashcard">("quiz");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "mixed">("mixed");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loaderIndex, setLoaderIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isPending) {
      const interval = setInterval(() => {
        setLoaderIndex((prev) => (prev + 1) % loadingStates.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isPending]);

  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!notes.trim() && !file) return;
    setError(null);
    const formData = new FormData();
    formData.append("notes", notes);
    if (file) formData.append("file", file);
    formData.append("mode", activeMode);
    formData.append("difficulty", difficulty);
    formData.append("count", "8");

    startTransition(async () => {
      try {
        const response = await generateContent(formData);
        if (response.success) {
          // Save to localStorage history (always reliable, no backend needed)
          const topic = file?.name || notes?.substring(0, 40) || "Untitled Notes";
          saveToLocalHistory({
            topic,
            mode: response.mode as "quiz" | "flashcard",
            data: response.data,
          });
          window.dispatchEvent(new Event("quizzy_history_updated"));

          const encodedData = encodeURIComponent(JSON.stringify(response.data));
          router.push(`/${response.mode}?data=${encodedData}`);
        } else {
          setError(response.error || "Generation failed");
        }
      } catch (err) {
        console.error(err);
        setError("Connection error. Please try again.");
      }
    });
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-background dot-grid text-foreground antialiased selection:bg-primary/20">
      <BackgroundParticles />
      <FloatingDecoIcons />
      <Sidebar className="hidden lg:flex" />

      <main className="flex-1 p-6 md:p-12 lg:p-24 flex flex-col items-center z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl space-y-8"
        >
          <header className="space-y-4 text-center relative">
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Badge variant="outline" className="px-5 py-1.5 rounded-full font-bold text-[9px] tracking-[0.2em] uppercase border-primary/20 text-primary bg-white/60 backdrop-blur-md shadow-sm">
                 <Sparkles className="w-3 h-3 mr-2 animate-pulse" />
                 Elite Educational Studio
              </Badge>
            </motion.div>
            
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-glow"
              >
                Refine Your <br className="hidden md:block"/>
                <span className="text-primary italic relative inline-block">
                  Deep Intelligence.
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
                    className="absolute -bottom-1 left-0 h-1 bg-primary/20 rounded-full"
                  />
                </span>
              </motion.h1>
            </div>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1, type: "spring", stiffness: 50 }}
          >
            <Card className="rounded-[2.5rem] border border-white/80 glass overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
              <div className="flex flex-col md:flex-row min-h-[400px] relative z-10">
                {/* Primary Panel */}
                <div className="flex-1 p-8 md:p-10 space-y-8 flex flex-col border-r border-zinc-100/50">
                  <textarea
                    placeholder="Paste your study materials here..."
                    className="h-32 w-full bg-transparent border-none focus:ring-0 resize-none text-xl font-semibold tracking-tight placeholder:text-zinc-200 py-2 transition-all leading-[1.3] outline-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  
                  <div className="space-y-6">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Library Synthesis</span>
                    <AnimatePresence mode="wait">
                      {file ? (
                        <motion.div 
                          key="file-active"
                          initial={{ opacity: 0, scale: 0.95 }} 
                          animate={{ opacity: 1, scale: 1 }} 
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="p-6 bg-primary/5 rounded-[2rem] flex items-center gap-5 border border-primary/10 shadow-inner group"
                        >
                          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col flex-1 truncate">
                            <span className="text-sm font-black truncate">{file.name}</span>
                            <button 
                              onClick={() => setFile(null)}
                              className="text-[10px] font-bold text-primary/60 hover:text-primary text-left uppercase tracking-tighter transition-colors"
                            >
                              Discard Library
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="file-empty"
                          whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.02)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => fileInputRef.current?.click()}
                          className="h-20 rounded-[2rem] border-2 border-dashed border-zinc-200 hover:border-primary/40 transition-all cursor-pointer flex items-center justify-center gap-4 group bg-zinc-50/30 overflow-hidden relative"
                        >
                          <div className="w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                            <Plus className="w-4 h-4 text-zinc-400 group-hover:text-primary" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-primary">Import Source (PDF, IMG, DOCX)</span>
                          <motion.div 
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept=".pdf,.docx,.txt,image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>

                {/* Sidebar Controls */}
                <div className="w-full md:w-[320px] p-8 bg-zinc-50/40 flex flex-col gap-6 relative overflow-hidden text-black">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
                  
                  <div className="space-y-6 relative z-10">
                    <div className="space-y-3">
                       <span className="text-[9px] font-black text-primary/40 uppercase tracking-[0.4em]">Protocol Intensity</span>
                       <div className="flex bg-white/50 p-1 rounded-xl border border-primary/10 backdrop-blur-md">
                          {["easy", "medium", "hard", "mixed"].map((d) => (
                            <button
                              key={d}
                              onClick={() => setDifficulty(d as any)}
                              className={cn(
                                "flex-1 py-1.5 px-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                                difficulty === d ? "bg-primary text-white shadow-md" : "text-zinc-400 hover:text-primary"
                              )}
                            >
                              {d}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                      <span className="text-[9px] font-black text-primary/40 uppercase tracking-[0.4em]">Mode Selection</span>
                      {[
                        { id: "quiz", label: "The Quiz Protocol", icon: BrainCircuit, desc: "Conceptual validation" },
                        { id: "flashcard", label: "The Flashcard Canvas", icon: Layers, desc: "Mnemonic restoration" }
                      ].map((mode) => (
                        <motion.button
                          key={mode.id}
                          whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.8)" }}
                          onClick={() => setActiveMode(mode.id as any)}
                          className={cn(
                            "w-full p-4 rounded-2xl text-left border flex items-center gap-4 transition-all duration-500",
                            activeMode === mode.id 
                              ? "bg-white border-primary shadow-lg text-primary" 
                              : "border-transparent text-zinc-400 hover:border-primary/10"
                          )}
                        >
                          <div className={cn(
                             "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700 shadow-sm",
                             activeMode === mode.id ? "bg-primary text-white shadow-md shadow-primary/20 rotate-0" : "bg-zinc-100 rotate-[-5deg]"
                          )}>
                            <mode.icon className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.1em]">{mode.label}</span>
                            <span className="text-[9px] opacity-60 font-medium italic truncate">{mode.desc}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-zinc-100/50 relative z-10">
                    <Button 
                      className="w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.01] active:scale-95 bg-primary overflow-hidden relative group border-none text-white"
                      onClick={handleGenerate}
                      disabled={isPending || (!notes && !file)}
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Initiate Synthesis <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" /></>}
                      </span>
                      <motion.div 
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      <AnimatePresence>
        {(isPending || error) && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/80 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-full max-w-md space-y-12">
              <div className="relative flex justify-center">
                <motion.div 
                  animate={{ 
                    scale: error ? [1, 1] : [1, 1.2, 1], 
                    opacity: error ? 1 : [0.3, 0.6, 0.3] 
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={cn(
                    "absolute inset-0 rounded-full blur-3xl",
                    error ? "bg-rose-500/20" : "bg-primary"
                  )}
                />
                {error ? (
                  <div className="w-20 h-20 rounded-[2rem] bg-rose-500 flex items-center justify-center text-white shadow-2xl relative z-10">
                    <X className="w-10 h-10" />
                  </div>
                ) : (
                  <Loader2 className="w-16 h-16 animate-spin text-primary relative z-10" />
                )}
              </div>

              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {error ? (
                    <motion.div
                      key="error-ui"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      <div className="space-y-4">
                        <h2 className="text-3xl font-black tracking-tight text-zinc-800 uppercase italic">Synthesis Interrupted</h2>
                        <p className="text-sm font-medium text-zinc-500 leading-relaxed max-w-xs mx-auto">
                          {error}
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-4">
                        <Button 
                          onClick={handleGenerate}
                          className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-primary/20 hover:scale-105 transition-all border-none"
                        >
                          <RefreshCw className="w-4 h-4 mr-3" /> Generate Again
                        </Button>
                        <Button 
                          variant="ghost"
                          onClick={() => setError(null)}
                          className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] text-zinc-400 hover:text-zinc-800"
                        >
                          Return to Parameters
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key={loaderIndex} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="flex flex-col items-center gap-3"
                    >
                      <p className="text-2xl font-black italic tracking-tight text-primary uppercase">
                        {loadingStates[loaderIndex]}
                      </p>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.5em] animate-pulse">Synchronizing Intelligence</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
