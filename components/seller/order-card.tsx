"use client";

import { Order } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, AlertCircle, ShoppingBag, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: Order["status"]) => void;
}

const statusConfig = {
  pending: { label: "Pending", color: "warning" as const, icon: AlertCircle },
  preparing: { label: "Preparing", color: "info" as const, icon: Clock },
  ready: { label: "Ready", color: "success" as const, icon: CheckCircle2 },
  completed: { label: "Completed", color: "default" as const, icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "destructive" as const, icon: AlertCircle },
};

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const config = statusConfig[order.status];

  return (
    <Card className="overflow-hidden hover:border-primary/30 transition-all group">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-surface-elevated flex items-center justify-center text-text-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Order #{String(order.id).slice(-4)}</p>
              <p className="text-xs text-text-secondary">{new Date(order.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>
          <Badge variant={config.color} className="gap-1.5 py-1 px-3">
            <config.icon className="h-3.5 w-3.5" />
            {config.label}
          </Badge>
        </div>

        {/* Items List */}
        <div className="space-y-3 mb-6">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">x{item.quantity}</span>
                <span className="text-foreground font-medium">{item.name}</span>
              </div>
              <span className="text-text-secondary">Rp{(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString('id-ID')}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border flex items-center justify-between">
          <div className="text-sm">
            <span className="text-text-secondary">Total:</span>
            <span className="ml-1.5 font-bold text-foreground text-lg">Rp{Number(order.totalAmount || 0).toLocaleString('id-ID')}</span>
          </div>

          <div className="flex gap-2 flex-wrap justify-end">
            {order.status === "pending" && (
              <>
                <Button size="sm" variant="destructive" onClick={() => onStatusChange(order.id, "cancelled")}>
                  Cancel
                </Button>
                <Button size="sm" variant="secondary" onClick={() => onStatusChange(order.id, "ready")}>
                  Ready
                </Button>
                <Button size="sm" onClick={() => onStatusChange(order.id, "preparing")}>
                  Accept
                </Button>
              </>
            )}
            {order.status === "preparing" && (
              <>
                <Button size="sm" variant="outline" onClick={() => onStatusChange(order.id, "pending")}>
                  Pending
                </Button>
                <Button size="sm" variant="secondary" onClick={() => onStatusChange(order.id, "ready")}>
                  Ready
                </Button>
              </>
            )}
            {order.status === "ready" && (
              <>
                <Button size="sm" variant="outline" onClick={() => onStatusChange(order.id, "preparing")}>
                  Preparing
                </Button>
                <Button size="sm" onClick={() => onStatusChange(order.id, "completed")}>
                  Complete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
