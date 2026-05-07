import * as React from "react"
import { cn } from "@/lib/utils"
import { OrderStatus } from "@/types"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline" | OrderStatus
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  
  const variants: Record<string, string> = {
    default: "bg-[var(--color-surface-elevated)] text-[var(--foreground)]",
    success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    danger: "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20",
    info: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    outline: "text-[var(--foreground)] border border-[var(--color-border)]",
    
    // Status mappings
    pending: "bg-gray-500/15 text-gray-600 dark:text-gray-400 border border-gray-500/20",
    preparing: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    ready: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    completed: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20",
  }

  return (
    <div className={cn(baseStyles, variants[variant as string], className)} {...props} />
  )
}

export { Badge }
