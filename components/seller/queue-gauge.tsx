"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QueueGaugeProps {
  current: number;
  total: number;
  label: string;
  className?: string;
}

export function QueueGauge({ current, total, label, className }: QueueGaugeProps) {
  const percentage = Math.min((current / total) * 100, 100);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative flex flex-col items-center justify-center p-8 bg-surface border border-border rounded-[2.5rem] overflow-hidden shadow-sm group", className)}>
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid opacity-[0.2] pointer-events-none" />
      
      {/* SVG Gauge */}
      <svg className="h-56 w-56 -rotate-90 relative z-10">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-primary-hover)" />
          </linearGradient>
        </defs>
        <circle
          cx="112"
          cy="112"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="16"
          className="text-surface-elevated"
        />
        {/* Progress Ring */}
        <motion.circle
          cx="112"
          cy="112"
          r={radius}
          fill="transparent"
          stroke="url(#gaugeGradient)"
          strokeWidth="16"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "backOut" }}
          strokeLinecap="round"
          className="drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]"
        />
      </svg>

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 z-20">
        <motion.span 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-black font-heading text-foreground tracking-tighter"
        >
          {current}
        </motion.span>
        <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mt-1">{label}</span>
      </div>

      {/* Total Info */}
      <div className="mt-6 text-center relative z-20">
        <div className="px-4 py-2 bg-surface-elevated rounded-full border border-border inline-flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            <span className="text-foreground">{total - current}</span> slots left
          </p>
        </div>
      </div>

      {/* Interactive Hover Glow */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.02] transition-colors duration-500" />
    </div>
  );
}
