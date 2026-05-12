"use client";

import { Bell, Search, User as UserIcon, Menu, X, ShoppingBag, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useOrderStore } from "@/store/order-store";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuClick?: () => void;
}

const statusIcon: Record<string, typeof Bell> = {
  pending: Clock,
  preparing: ShoppingBag,
  ready: CheckCircle2,
  completed: CheckCircle2,
  cancelled: XCircle,
};

const statusColor: Record<string, string> = {
  pending: "text-warning",
  preparing: "text-primary",
  ready: "text-success",
  completed: "text-success",
  cancelled: "text-danger",
};

export function Header({ onMenuClick }: HeaderProps) {
  const user = useAuthStore((state) => state.user);
  const { orders, fetchOrders } = useOrderStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const pendingCount = orders.filter(o => o.status === "pending").length;
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  useEffect(() => {
    if (user?.role === "seller") {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 lg:h-24 border-b border-border/50 bg-surface/70 backdrop-blur-xl sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-text-secondary hover:bg-surface-elevated rounded-xl transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="relative w-full max-w-md group hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search for orders, items..."
            className="w-full bg-surface-elevated/50 rounded-2xl py-3 px-12 text-sm border border-transparent focus:border-primary/20 focus:bg-surface focus:ring-4 focus:ring-primary/5 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="sm:hidden p-2.5 text-text-secondary hover:bg-surface-elevated rounded-xl transition-all">
          <Search className="h-5 w-5" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 md:p-3 text-text-secondary hover:bg-primary/10 hover:text-primary rounded-2xl transition-all active:scale-90 group"
          >
            <Bell className="h-5 w-5 md:h-6 w-6" />
            {pendingCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-danger text-white text-[10px] font-bold rounded-full ring-2 ring-surface group-hover:ring-primary/10 px-1">
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-surface border border-border rounded-2xl shadow-2xl shadow-black/20 overflow-hidden z-50">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h3 className="font-bold text-foreground">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 text-text-secondary hover:text-foreground rounded-lg hover:bg-surface-elevated transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {recentOrders.length === 0 ? (
                  <div className="py-12 text-center text-text-secondary">
                    <Bell className="h-8 w-8 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No notifications yet</p>
                    <p className="text-xs mt-1 opacity-60">Notifications will appear here</p>
                  </div>
                ) : (
                  recentOrders.map((order) => {
                    const Icon = statusIcon[order.status] || Bell;
                    return (
                      <button
                        key={order.id}
                        onClick={() => {
                          setShowNotifications(false);
                          const route = user?.role === "seller" ? "/seller/orders" : "/customer/queue";
                          router.push(route);
                        }}
                        className="w-full flex items-start gap-3 px-5 py-3.5 hover:bg-surface-elevated/50 transition-colors text-left border-b border-border/50 last:border-0"
                      >
                        <div className={cn("p-2 rounded-xl bg-surface-elevated shrink-0", statusColor[order.status])}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            Order #{order.id}
                          </p>
                          <p className="text-xs text-text-secondary mt-0.5">
                            {order.status === "pending" && "New order waiting to be accepted"}
                            {order.status === "preparing" && "Order is being prepared"}
                            {order.status === "ready" && "Order is ready for pickup"}
                            {order.status === "completed" && "Order completed"}
                            {order.status === "cancelled" && "Order cancelled"}
                          </p>
                          <p className="text-[10px] text-text-secondary/60 mt-1">
                            {new Date(order.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        {order.status === "pending" && (
                          <span className="h-2 w-2 bg-danger rounded-full shrink-0 mt-2 animate-pulse" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {user?.role === "seller" && recentOrders.length > 0 && (
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    router.push("/seller/orders");
                  }}
                  className="w-full py-3 text-center text-sm font-bold text-primary hover:bg-primary/5 transition-colors border-t border-border"
                >
                  View All Orders
                </button>
              )}
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-border/50 mx-1 md:mx-2" />

        <div className="flex items-center gap-3 pl-1">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-bold text-foreground leading-tight">{user?.name || "Guest"}</p>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1">
              {user?.role === 'seller' && user?.store?.store_name ? user.store.store_name : (user?.role || "Visitor")}
            </p>
          </div>
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-surface-elevated to-border flex items-center justify-center text-text-secondary border border-border shadow-inner group cursor-pointer hover:border-primary/50 transition-all overflow-hidden">
            <div className="h-full w-full bg-primary/5 flex items-center justify-center">
              <UserIcon className="h-5 w-5 md:h-6 w-6 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
