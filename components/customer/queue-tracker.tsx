"use client";

import { motion } from "framer-motion";
import { Timer, Users, ShoppingBag, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface QueueTrackerProps {
  position: number;
  totalInQueue: number;
  estimatedTime: number; // in minutes
  status: "pending" | "preparing" | "ready" | "completed";
}

const steps = [
  { id: "pending", label: "Confirmed", icon: ShoppingBag },
  { id: "preparing", label: "Preparing", icon: Timer },
  { id: "ready", label: "Ready", icon: CheckCircle2 },
];

export function QueueTracker({ position, totalInQueue, estimatedTime, status }: QueueTrackerProps) {
  const currentStepIndex = steps.findIndex(s => s.id === status);
  const isCompleted = status === "completed";

  return (
    <Card className="p-8 space-y-8 overflow-hidden relative">
      {/* Header Info */}
      <div className="flex flex-col items-center text-center">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin duration-[3s]" />
          <span className="text-4xl font-bold font-heading text-primary">#{position}</span>
        </div>
        <h2 className="text-2xl font-bold font-heading text-foreground">Your Queue Position</h2>
        <p className="text-text-secondary mt-2">
          There are <span className="text-foreground font-bold">{totalInQueue}</span> orders ahead of you.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="relative pt-4 px-4">
        <div className="absolute top-[calc(1rem+18px)] left-8 right-8 h-1 bg-surface-elevated -z-10" />
        <div 
          className="absolute top-[calc(1rem+18px)] left-8 h-1 bg-primary transition-all duration-1000 -z-10" 
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        <div className="flex justify-between">
          {steps.map((step, idx) => {
            const isActive = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            
            return (
              <div key={step.id} className="flex flex-col items-center gap-3">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-surface",
                  isActive ? "border-primary text-primary shadow-lg shadow-primary/20 scale-110" : "border-border text-text-secondary"
                )}>
                  {isActive ? <CheckCircle2 className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                </div>
                <span className={cn(
                  "text-xs font-bold uppercase tracking-wider",
                  isActive ? "text-primary" : "text-text-secondary"
                )}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-surface-elevated rounded-2xl p-6 grid grid-cols-2 gap-4">
        <div className="text-center border-r border-border">
          <p className="text-[10px] font-bold text-text-secondary uppercase mb-1">Est. Wait Time</p>
          <div className="flex items-center justify-center gap-1.5 text-foreground font-bold">
            <Timer className="h-4 w-4 text-primary" />
            <span>{estimatedTime} mins</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-text-secondary uppercase mb-1">Current Status</p>
          <p className={cn(
            "font-bold capitalize",
            isCompleted ? "text-success" : "text-primary"
          )}>
            {status}
          </p>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
    </Card>
  );
}
