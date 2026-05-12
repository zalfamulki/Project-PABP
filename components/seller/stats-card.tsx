"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: "primary" | "success" | "danger" | "info";
  className?: string;
}

const colors = {
  primary: "text-primary bg-primary/10",
  success: "text-success bg-success/10",
  danger: "text-danger bg-danger/10",
  info: "text-blue-500 bg-blue-500/10",
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "primary",
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("p-6 flex items-start justify-between group hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 bg-surface/50 backdrop-blur-sm relative overflow-hidden", className)}>
      <div className="relative z-10">
        <p className="text-xs font-bold text-text-secondary mb-2 uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl font-black font-heading text-foreground tracking-tight">{value}</h3>
        
        {trend && (
          <div className="flex items-center gap-2 mt-3">
            <span className={cn(
              "text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter",
              trend.isUp ? "text-success bg-success/20" : "text-danger bg-danger/20"
            )}>
              {trend.isUp ? "↑" : "↓"} {trend.value}%
            </span>
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">vs last week</span>
          </div>
        )}
      </div>

      <div className={cn("p-4 rounded-[1.25rem] transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110 shadow-sm relative z-10", colors[color])}>
        <Icon className="h-6 w-6" />
      </div>
      
      {/* Decorative background element */}
      <div className={cn("absolute -bottom-4 -right-4 h-24 w-24 opacity-[0.03] transition-transform duration-700 group-hover:scale-150 group-hover:rotate-12", colors[color])}>
        <Icon className="h-full w-full" />
      </div>
    </Card>
  );
}
