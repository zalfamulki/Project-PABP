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
    <Card className={cn("p-6 flex items-start justify-between group hover:border-primary/50 transition-colors", className)}>
      <div>
        <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
        <h3 className="text-3xl font-bold font-heading text-foreground">{value}</h3>
        
        {trend && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className={cn(
              "text-xs font-bold px-1.5 py-0.5 rounded-md",
              trend.isUp ? "text-success bg-success/10" : "text-danger bg-danger/10"
            )}>
              {trend.isUp ? "+" : "-"}{trend.value}%
            </span>
            <span className="text-xs text-text-secondary">vs last month</span>
          </div>
        )}
      </div>

      <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", colors[color])}>
        <Icon className="h-6 w-6" />
      </div>
    </Card>
  );
}
