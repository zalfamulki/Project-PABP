"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { QueueTracker } from "@/components/customer/queue-tracker";
import { useOrderStore } from "@/store/order-store";
import { useQueueStore } from "@/store/queue-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Bell, Share2, HelpCircle } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Price } from "@/components/ui/price";

export default function QueueTrackingPage() {
  const { orders, fetchOrders } = useOrderStore();
  const { fetchStats, isLoadingStats: isLoading } = useQueueStore();
  
  const activeOrders = orders.filter(o => o.status !== "completed" && o.status !== "cancelled");
  const latestOrder = [...activeOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  useEffect(() => {
    fetchOrders();
    fetchStats();
    
    // Polling simulation
    const interval = setInterval(() => {
      fetchOrders();
      fetchStats();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [fetchOrders, fetchStats]);

  if (!latestOrder) {
    return (
      <DashboardLayout allowedRole="customer">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <div className="h-20 w-20 rounded-3xl bg-surface-elevated flex items-center justify-center mb-6">
            <RefreshCcw className="h-10 w-10 text-text-secondary opacity-20" />
          </div>
          <h2 className="text-2xl font-bold font-heading">No active orders</h2>
          <p className="text-text-secondary mt-2 max-w-sm">You don't have any active orders in the queue. Place an order to see it here.</p>
        </div>
      </DashboardLayout>
    );
  }

  const queuePos = activeOrders.filter(o => (o.status === "pending" || o.status === "preparing") && new Date(o.createdAt) < new Date(latestOrder.createdAt)).length + 1;

  return (
    <DashboardLayout allowedRole="customer">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">Active Queue</h1>
            <p className="text-text-secondary mt-1">Real-time status of your order.</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => { fetchOrders(); fetchStats(); }}
            className="rounded-xl gap-2"
            disabled={isLoading}
          >
            <RefreshCcw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Sync
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Tracker Card */}
          <div className="lg:col-span-3">
            <QueueTracker 
              position={queuePos}
              totalInQueue={activeOrders.filter(o => o.status === "pending" || o.status === "preparing").length}
              estimatedTime={queuePos * 5} // 5 mins per order
              status={latestOrder.status}
            />
          </div>

          {/* Quick Info & Actions */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 space-y-6 bg-primary text-white border-none shadow-xl shadow-primary/20">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold font-heading">Ready to Notify?</h3>
                  <p className="text-white/80 text-sm mt-2 leading-relaxed">We'll alert you via push notification as soon as your order is ready for pickup.</p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Bell className="h-6 w-6" />
                </div>
              </div>
              <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold h-12 rounded-xl">
                Enable Notifications
              </Button>
            </Card>

            <div className="grid grid-cols-2 gap-4">
            
            </div>

            <Card className="p-6 border-dashed border-2 border-border bg-transparent">
              <h4 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Order Items</h4>
              <div className="space-y-3">
                {latestOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-text-secondary"><span className="font-bold text-foreground">x{item.quantity}</span> {item.name}</span>
                    <Price amount={Number(item.price || 0) * Number(item.quantity || 0)} className="font-bold text-foreground" />
                  </div>
                ))}
                <div className="pt-3 border-t border-border flex justify-between font-black text-lg text-foreground">
                  <span>Total Paid</span>
                  <Price amount={Number(latestOrder.totalAmount || 0)} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
