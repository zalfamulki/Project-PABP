"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { OrderCard } from "@/components/seller/order-card";
import { useOrderStore } from "@/store/order-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, Filter, RotateCcw, ShoppingBag } from "lucide-react";

type OrderFilter = "all" | "pending" | "preparing" | "ready" | "completed";

export default function SellerOrdersPage() {
  const { orders, fetchOrders, updateOrderStatus, isLoading } = useOrderStore();
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const filterTabs: { id: OrderFilter; label: string }[] = [
    { id: "all", label: "All Orders" },
    { id: "pending", label: "Pending" },
    { id: "preparing", label: "Preparing" },
    { id: "ready", label: "Ready" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <DashboardLayout allowedRole="seller">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading text-foreground">Order Management</h1>
            <p className="text-text-secondary mt-1">Monitor and process customer orders in real-time.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => fetchOrders()} 
              disabled={isLoading}
              className="rounded-xl gap-2"
            >
              <RotateCcw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex items-center gap-1 bg-surface-elevated p-1 rounded-2xl border border-border overflow-x-auto max-w-full no-scrollbar">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap",
                  filter === tab.id
                    ? "bg-surface text-primary shadow-sm"
                    : "text-text-secondary hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search by ID or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-elevated rounded-xl py-2.5 pl-10 pr-4 text-sm border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onStatusChange={updateOrderStatus} 
            />
          ))}

          {filteredOrders.length === 0 && (
            <div className="col-span-full py-32 bg-surface-elevated rounded-[2rem] border-2 border-dashed border-border flex flex-col items-center justify-center text-text-secondary">
              <ShoppingBag className="h-16 w-16 mb-4 opacity-10" />
              <h3 className="text-xl font-bold text-foreground/50">No orders found</h3>
              <p className="mt-1">Try adjusting your filters or search query.</p>
              <Button 
                variant="ghost" 
                className="mt-6 text-primary"
                onClick={() => { setFilter("all"); setSearchQuery(""); }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
