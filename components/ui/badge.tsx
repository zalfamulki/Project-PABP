import * as React from "react"
import { cn } from "@/lib/utils"
import { OrderStatus } from "@/types"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline" | OrderStatus
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 border backdrop-blur-sm shadow-sm"
  
  const variants: Record<string, string> = {
    default: "bg-surface-elevated text-foreground border-border",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    danger: "bg-danger/10 text-danger border-danger/20",
    info: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    outline: "text-foreground border-border bg-transparent",
    
    // Status mappings
    pending: "bg-slate-500/10 text-slate-600 border-slate-500/20",
    preparing: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    ready: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    completed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  }

  return (
    <div className={cn(baseStyles, variants[variant as string], className)} {...props} />
  )
}

export { Badge }
