"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, Book, Atom, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = [
  { Icon: Brain, delay: 0, x: "8%", y: "15%", size: 45, color: "text-blue-500/30" },
  { Icon: Sparkles, delay: 2, x: "88%", y: "12%", size: 35, color: "text-amber-500/30" },
  { Icon: Book, delay: 4, x: "82%", y: "75%", size: 50, color: "text-emerald-500/30" },
  { Icon: Atom, delay: 1, x: "12%", y: "82%", size: 40, color: "text-indigo-500/30" },
  { Icon: GraduationCap, delay: 3, x: "48%", y: "5%", size: 55, color: "text-rose-500/30" },
];

export default function FloatingDecoIcons() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {icons.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.2, 1.2, 0.5],
            rotate: [0, 45, -45, 0],
            y: ["0px", "-200px", "-400px", "-600px"],
            x: ["0px", "50px", "-50px", "0px"]
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut"
          }}
          className={cn("absolute filter blur-[1px]", item.color)}
          style={{ left: item.x, top: item.y }}
        >
          <item.Icon size={item.size} strokeWidth={1} className="drop-shadow-2xl" />
        </motion.div>
      ))}
    </div>
  );
}
