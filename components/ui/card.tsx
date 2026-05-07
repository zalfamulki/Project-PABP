import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--foreground)] shadow-sm",
        glass && "glass",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

export { Card }
