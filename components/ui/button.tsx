import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-[1rem] font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 active:scale-95 select-none"
    
    const variants = {
      primary: "bg-primary text-white hover:bg-primary-hover shadow-xl shadow-primary/20 border border-primary/20",
      secondary: "bg-surface-elevated text-foreground hover:bg-border border border-border/50",
      outline: "border-2 border-border bg-transparent hover:bg-surface-elevated hover:border-primary/30 text-text-secondary hover:text-primary",
      ghost: "text-text-secondary hover:bg-surface-elevated hover:text-foreground",
      danger: "bg-danger text-white hover:bg-red-600 shadow-xl shadow-danger/20 border border-danger/20",
      success: "bg-success text-white hover:opacity-90 shadow-xl shadow-success/20 border border-success/20",
    }
    
    const sizes = {
      sm: "h-10 px-5 text-xs uppercase tracking-widest",
      md: "h-12 px-7 text-sm",
      lg: "h-16 px-10 text-lg",
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
