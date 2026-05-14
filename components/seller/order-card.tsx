"use client";

import { Order } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { Clock, CheckCircle2, AlertCircle, ShoppingBag, Trash2, CookingPot, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useState } from "react";
import { toast } from "@/store/toast-store";

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: Order["status"]) => void;
  onDelete?: (orderId: string) => void;
}

const statusConfig = {
  pending: { label: "Pending", color: "warning" as const, icon: AlertCircle },
  preparing: { label: "Preparing", color: "info" as const, icon: CookingPot },
  ready: { label: "Ready", color: "success" as const, icon: Utensils },
  completed: { label: "Completed", color: "default" as const, icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "danger" as const, icon: AlertCircle },
};

export function OrderCard({ order, onStatusChange, onDelete }: OrderCardProps) {
  const config = statusConfig[order.status];
  const [togglingItems, setTogglingItems] = useState<Record<string, boolean>>({});

  const handleToggleReady = async (itemId: string) => {
    setTogglingItems(prev => ({ ...prev, [itemId]: true }));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/orders/${order.id}/items/${itemId}/toggle-ready`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('smartqueue_token')}`
        }
      });
      if (!res.ok) throw new Error('Failed to toggle item');
      const data = await res.json();
      onStatusChange(order.id, data.data.status);
      toast.success(data.message);
    } catch (e: any) {
      toast.error(e.message || 'Failed to update item');
    } finally {
      setTogglingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const allItemsReady = order.items.every(item => (item as any).isReady);
  const anyItemReady = order.items.some(item => (item as any).isReady);

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
          {order.items.map((item, idx) => {
            const isReady = (item as any).isReady;
            return (
              <div key={idx} className={cn(
                "flex items-center justify-between text-sm group/item p-2 rounded-xl transition-colors",
                order.status === "preparing" && "hover:bg-surface-elevated cursor-pointer",
                isReady && "bg-success/5"
              )}>
                <div className="flex items-center gap-3 flex-1" onClick={() => order.status === "preparing" && handleToggleReady(item.id)}>
                  <span className={cn(
                    "flex items-center justify-center h-6 min-w-6 rounded-lg text-[10px] font-black transition-colors",
                    isReady ? "bg-success text-white" : "bg-primary/10 text-primary"
                  )}>
                    {isReady ? <CheckCircle2 className="h-3 w-3" /> : item.quantity}
                  </span>
                  <span className={cn(
                    "font-bold tracking-tight transition-colors",
                    isReady ? "text-success line-through opacity-60" : "text-foreground"
                  )}>
                    {item.name}
                  </span>
                  {order.status === "preparing" && (
                    <span className="text-[10px] text-text-secondary ml-1">
                      {togglingItems[item.id] ? "..." : (isReady ? "tap to undo" : "tap when ready")}
                    </span>
                  )}
                </div>
                <Price amount={Number(item.price || 0) * Number(item.quantity || 0)} className={cn("font-medium", isReady ? "text-success/60" : "text-text-secondary")} />
              </div>
            );
          })}
        </div>

        {/* Preparing progress bar */}
        {order.status === "preparing" && (
          <div className="mb-4">
            <div className="flex justify-between text-[10px] font-bold text-text-secondary mb-1.5">
              <span>Preparation Progress</span>
              <span>{order.items.filter(i => (i as any).isReady).length}/{order.items.length} ready</span>
            </div>
            <div className="h-2 rounded-full bg-surface-elevated overflow-hidden">
              <div
                className="h-full rounded-full bg-success transition-all duration-500"
                style={{ width: `${(order.items.filter(i => (i as any).isReady).length / order.items.length) * 100}%` }}
              />
            </div>
          </div>
        )}

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
                  Accept
                </Button>
              </>
            )}
            {order.status === "preparing" && !allItemsReady && (
              <div className="w-full text-center">
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                  Tap each item when ready
                </p>
              </div>
            )}
            {order.status === "preparing" && allItemsReady && (
              <Button size="sm" className="w-full rounded-xl text-xs font-bold bg-success hover:bg-success/90 shadow-lg shadow-success/20" onClick={() => onStatusChange(order.id, "ready")}>
                Ready — All Items Done
              </Button>
            )}
            {order.status === "ready" && (
              <Button size="sm" className="w-full rounded-xl text-xs font-bold bg-success hover:bg-success/90 shadow-lg shadow-success/20" onClick={() => onStatusChange(order.id, "completed")}>
                Mark as Complete
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
