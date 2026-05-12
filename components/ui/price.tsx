import { cn } from "@/lib/utils";

interface PriceProps {
  amount: number;
  className?: string;
  prefixClassName?: string;
}

export function Price({ amount, className, prefixClassName }: PriceProps) {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <span className={cn("font-black tracking-tighter", className)}>
      <span className={cn("text-[0.7em] font-bold mr-1 opacity-80", prefixClassName)}>Rp</span>
      {formatted}
    </span>
  );
}
