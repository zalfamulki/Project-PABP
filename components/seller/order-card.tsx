"use client";

import { Order } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { Clock, CheckCircle2, AlertCircle, ShoppingBag, ChevronRight, Trash2 } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: Order["status"]) => void;
  onDelete?: (orderId: string) => void;
}

const statusConfig = {
  pending: { label: "Pending", color: "warning" as const, icon: AlertCircle },
  preparing: { label: "Preparing", color: "info" as const, icon: Clock },
  ready: { label: "Ready", color: "success" as const, icon: CheckCircle2 },
  completed: { label: "Completed", color: "default" as const, icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "danger" as const, icon: AlertCircle },
};

export function OrderCard({ order, onStatusChange, onDelete }: OrderCardProps) {
  const config = statusConfig[order.status];

  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-all duration-300 group hover:shadow-xl hover:shadow-primary/5 bg-surface/50 backdrop-blur-sm border-border/50 relative">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-surface-elevated flex items-center justify-center text-text-secondary group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 group-hover:rotate-6">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-black text-foreground tracking-tight">Order #{String(order.id).slice(-4).toUpperCase()}</p>
              <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-0.5">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          <Badge variant={config.color} className="gap-1.5 py-1.5 px-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
            <config.icon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>

        {/* Items List */}
        <div className="space-y-4 mb-8">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm group/item">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-primary/10 text-primary text-[10px] font-black">
                  {item.quantity}
                </span>
                <span className="text-foreground font-bold tracking-tight group-hover/item:text-primary transition-colors">{item.name}</span>
              </div>
              <Price amount={Number(item.price || 0) * Number(item.quantity || 0)} className="text-text-secondary font-medium" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-border/50 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Total Amount</span>
            <Price amount={Number(order.totalAmount || 0)} className="text-primary text-xl" />
          </div>

          <div className="flex gap-2 w-full">
            {order.status === "pending" && (
              <>
                <Button size="sm" variant="ghost" className="flex-1 rounded-xl text-xs font-bold text-danger hover:bg-danger/10" onClick={() => onStatusChange(order.id, "cancelled")}>
                  Cancel
                </Button>
                <Button size="sm" className="flex-[2] rounded-xl text-xs font-bold shadow-lg shadow-primary/20" onClick={() => onStatusChange(order.id, "preparing")}>
                  Accept Order
                </Button>
              </>
            )}
            {order.status === "preparing" && (
              <Button size="sm" variant="secondary" className="w-full rounded-xl text-xs font-bold shadow-lg shadow-success/10" onClick={() => onStatusChange(order.id, "ready")}>
                Mark as Ready
              </Button>
            )}
            {order.status === "ready" && (
              <Button size="sm" className="w-full rounded-xl text-xs font-bold bg-success hover:bg-success/90 shadow-lg shadow-success/20" onClick={() => onStatusChange(order.id, "completed")}>
                Complete Order
              </Button>
            )}
            {(order.status === "completed" || order.status === "cancelled") && onDelete && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="w-full rounded-xl text-xs font-bold text-danger hover:bg-danger/10 gap-2" 
                onClick={() => onDelete(order.id)}
              >
                <Trash2 className="h-4 w-4" />
                Remove from History
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
