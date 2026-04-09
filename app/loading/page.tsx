import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md z-50">
      <div className="relative flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="absolute inset-0 w-12 h-12 border-4 border-muted rounded-full opacity-20" />
      </div>
      <p className="mt-4 text-sm font-bold text-muted-foreground uppercase tracking-[0.3em] animate-pulse">
        Generating your content...
      </p>
    </div>
  );
}
