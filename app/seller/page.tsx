"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCard } from "@/components/seller/stats-card";
import { QueueGauge } from "@/components/seller/queue-gauge";
import { OrderCard } from "@/components/seller/order-card";
import { 
  Users, 
  DollarSign, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  Filter,
  ShoppingBag
} from "lucide-react";
import { useOrderStore } from "@/store/order-store";
import { useQueueStore } from "@/store/queue-store";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function SellerDashboard() {
  const { orders, fetchOrders, updateOrderStatus, deleteOrderHistory } = useOrderStore();
  const { fetchStats } = useQueueStore();

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [fetchOrders, fetchStats]);

  // Derived stats
  const activeOrders = orders.filter(o => o.status === "pending" || o.status === "preparing");
  const completedToday = orders.filter(o => o.status === "completed").length;
  const totalRevenue = orders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const avgWaitTime = 12; // Mock value

  return (
    <DashboardLayout allowedRole="seller">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading text-foreground">Overview</h1>
            <p className="text-text-secondary mt-1">Here's what's happening in your shop today.</p>
          </div>
          <Button variant="outline" className="gap-2 rounded-xl">
            <Filter className="h-4 w-4" />
            Filter Stats
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(Number(totalRevenue))}
            icon={DollarSign}
            trend={{ value: 12, isUp: true }}
            color="success"
          />
          <StatsCard
            title="Active Orders"
            value={activeOrders.length}
            icon={Clock}
            trend={{ value: 5, isUp: false }}
            color="primary"
          />
          <StatsCard
            title="Completed Orders"
            value={completedToday}
            icon={TrendingUp}
            trend={{ value: 8, isUp: true }}
            color="info"
          />
          <StatsCard
            title="Avg. Wait Time"
            value={`${avgWaitTime}m`}
            icon={Users}
            color="danger"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Queue Tracker */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-heading text-foreground">Recent Orders</h2>
              <Button variant="ghost" className="text-primary text-sm font-bold gap-1 group">
                View All <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeOrders.slice(0, 4).map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onStatusChange={updateOrderStatus}
                  onDelete={deleteOrderHistory}
                />
              ))}
              {activeOrders.length === 0 && (
                <div className="col-span-2 py-20 bg-surface-elevated rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center text-text-secondary">
                  <ShoppingBag className="h-12 w-12 mb-4 opacity-20" />
                  <p>No active orders at the moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Queue Gauge Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading text-foreground">Queue Capacity</h2>
            <QueueGauge 
              current={activeOrders.length} 
              total={20} 
              label="Active Orders"
            />
            
            {/* Quick Actions Card */}
            <div className="p-6 bg-primary/10 border border-primary/20 rounded-3xl">
              <h3 className="font-bold text-primary mb-2">Shop Status</h3>
              <p className="text-sm text-primary/80 mb-4">You are currently accepting new orders. You can pause the queue if needed.</p>
              <Button className="w-full bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20">
                Pause Queue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
