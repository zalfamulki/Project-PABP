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
    <div className={cn("relative flex flex-col items-center justify-center p-6 bg-surface border border-border rounded-3xl overflow-hidden", className)}>
      {/* Background Ring */}
      <svg className="h-48 w-48 -rotate-90">
        <circle
          cx="96"
          cy="96"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="12"
          className="text-surface-elevated"
        />
        {/* Progress Ring */}
        <motion.circle
          cx="96"
          cy="96"
          r={radius}
          fill="transparent"
          stroke="var(--color-primary)"
          strokeWidth="12"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
        <span className="text-4xl font-bold font-heading text-foreground">{current}</span>
        <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">{label}</span>
      </div>

      {/* Total Info */}
      <div className="mt-4 text-center">
        <p className="text-sm text-text-secondary">
          <span className="font-bold text-foreground">{total - current}</span> slots remaining
        </p>
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-primary/10 blur-3xl rounded-full" />
    </div>
  );
}
