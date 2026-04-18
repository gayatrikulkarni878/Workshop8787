"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, BrainCircuit, Lock, User, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import BackgroundParticles from "@/components/BackgroundParticles";
import FloatingDecoIcons from "@/components/FloatingDecoIcons";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      router.push("/");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate small delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 800));

    if (id === "quizzyai" && password === "123") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/");
    } else {
      setError("Invalid credential sequence. Verification failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-background dot-grid text-foreground antialiased selection:bg-primary/20 items-center justify-center p-6">
      <BackgroundParticles />
      <FloatingDecoIcons />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[420px] relative z-20"
      >
        <Card className="rounded-[3rem] border border-white/80 glass overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] p-12 space-y-10">
          <header className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary shadow-2xl flex items-center justify-center text-white font-black text-3xl">
                Q
              </div>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Access Protocol</h1>
            <p className="text-zinc-500 text-xs font-medium italic">Synchronize your deep intelligence session.</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-zinc-300 group-focus-within:text-primary transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <Input
                  type="text"
                  placeholder="Intelligence ID"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="h-16 pl-14 rounded-2xl bg-white/50 border-primary/5 focus:border-primary/20 focus:ring-primary/10 transition-all font-semibold tracking-tight placeholder:text-zinc-200"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-zinc-300 group-focus-within:text-primary transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <Input
                  type="password"
                  placeholder="Access Code"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-16 pl-14 rounded-2xl bg-white/50 border-primary/5 focus:border-primary/20 focus:ring-primary/10 transition-all font-semibold tracking-tight placeholder:text-zinc-200"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-rose-500 text-[10px] font-black uppercase tracking-widest text-center"
              >
                {error}
              </motion.p>
            )}

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all border-none relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-3">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Initiate Protocol <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
              </span>
              <motion.div 
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
            </Button>
          </form>

          <footer className="text-center">
            <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest leading-relaxed">
              Proprietary Neural Architecture <br/> © 2026 Quizzy Intelligence
            </p>
          </footer>
        </Card>
      </motion.div>
    </div>
  );
}
