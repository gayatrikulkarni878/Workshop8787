"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BrainCircuit, Layers, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function HistoryList() {
  const history = useQuery(api.history.getHistory);

  if (history === undefined) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center gap-2">
        <Clock className="w-8 h-8 text-muted-foreground/30" />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No history yet</p>
      </div>
    );
  }

  const handleReattempt = (item: any) => {
    const encodedData = encodeURIComponent(JSON.stringify(item.data));
    window.location.href = `/${item.mode}?data=${encodedData}`;
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      {history.map((item) => (
        <button
          key={item._id}
          onClick={() => handleReattempt(item)}
          className="group text-left p-4 rounded-2xl border border-border/50 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary" className={cn(
              "text-[10px] font-black uppercase tracking-tighter px-2 h-5 flex items-center gap-1",
              item.mode === "quiz" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
            )}>
              {item.mode === "quiz" ? <BrainCircuit className="w-3 h-3" /> : <Layers className="w-3 h-3" />}
              {item.mode}
            </Badge>
            <span className="text-[10px] font-bold text-muted-foreground">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <h4 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {item.topic}
          </h4>
          
          <div className="mt-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            Re-attempt <ArrowRight className="w-3 h-3" />
          </div>
        </button>
      ))}
    </div>
  );
}
