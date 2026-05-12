"use client";

import { useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useOrderStore } from "@/store/order-store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Calendar, ArrowRight, Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { toast } from "@/store/toast-store";

export default function OrderHistoryPage() {
  const { orders, fetchOrders, isLoading, deleteOrderHistory } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleDelete = async (id: string) => {
    try {
      await deleteOrderHistory(id);
      toast.success("Order removed from history");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove order history");
    }
  };

  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <DashboardLayout allowedRole="customer">
      <div className="max-w-5xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">Order History</h1>
          <p className="text-text-secondary mt-1">Review your past cravings and experiences.</p>
        </div>

        <div className="space-y-6">
          {sortedOrders.map((order) => (
            <Card key={order.id} className="p-6 overflow-hidden group hover:border-primary/30 transition-all relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="h-16 w-16 rounded-2xl bg-surface-elevated flex items-center justify-center text-text-secondary shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-foreground">Order #{String(order.id).slice(-6).toUpperCase()}</h3>
                      <Badge variant={order.status === "completed" ? "success" : "default"}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.createdAt).toLocaleDateString("en-US", { 
                          month: "short", 
                          day: "numeric", 
                          year: "numeric" 
                        })}
                      </div>
                      <div className="h-1 w-1 bg-border rounded-full" />
                      <span>{order.items.length} items</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-3">
                  <Price amount={Number(order.totalAmount || 0)} className="text-2xl" />
                  <div className="flex flex-wrap gap-2 justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-xl gap-2 font-bold text-danger hover:bg-danger/10"
                      onClick={() => handleDelete(order.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete History
                    </Button>
                  </div>
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-2">
                {order.items.map((item, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-surface-elevated rounded-lg text-xs font-bold text-text-secondary">
                    {item.quantity}x {item.name}
                  </span>
                ))}
              </div>
            </Card>
          ))}

          {sortedOrders.length === 0 && !isLoading && (
            <div className="py-32 bg-surface-elevated rounded-[2.5rem] border-2 border-dashed border-border flex flex-col items-center justify-center text-text-secondary text-center">
              <ShoppingBag className="h-16 w-16 mb-6 opacity-10" />
              <h3 className="text-2xl font-bold text-foreground/50">No history yet</h3>
              <p className="mt-2">Your future orders will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
