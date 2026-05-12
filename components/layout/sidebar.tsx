"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  History, 
  Settings, 
  LogOut,
  ChevronRight,
  MonitorPlay,
  Menu,
  X
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

interface SidebarProps {
  role: "seller" | "customer";
  isOpen?: boolean;
  onClose?: () => void;
}

const sellerNav = [
  { name: "Dashboard", href: "/seller", icon: LayoutDashboard },
  { name: "Orders", href: "/seller/orders", icon: ShoppingBag },
  { name: "Menu Management", href: "/seller/menu", icon: UtensilsCrossed },
  { name: "Settings", href: "/seller/settings", icon: Settings },
];

const customerNav = [
  { name: "Browse Menu", href: "/customer", icon: UtensilsCrossed },
  { name: "Active Queue", href: "/customer/queue", icon: MonitorPlay },
  { name: "Order History", href: "/customer/history", icon: History },
  { name: "Settings", href: "/customer/settings", icon: Settings },
];

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const navigation = role === "seller" ? sellerNav : customerNav;
  const logout = useAuthStore((state) => state.logout);

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div className={cn(
        "fixed inset-y-0 left-0 w-72 bg-surface border-r border-border z-50 transition-transform duration-500 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand */}
        <div className="flex h-24 items-center px-8 gap-3 border-b border-border/50">
          <div className="h-11 w-11 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 animate-float">
            <MonitorPlay className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-black font-heading text-foreground tracking-tight leading-none">
              Smart<span className="text-primary">Queue</span>
            </h1>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.2em] mt-1"></p>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-text-secondary hover:bg-surface-elevated rounded-xl"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-8 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onClose?.()}
                className={cn(
                  "group flex items-center justify-between rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]"
                    : "text-text-secondary hover:bg-surface-elevated hover:text-foreground hover:translate-x-1"
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform duration-300",
                    isActive ? "text-white" : "text-text-secondary group-hover:text-foreground group-hover:scale-110"
                  )} />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-white/70" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-border/50">
          <button
            onClick={() => logout()}
            className="flex w-full items-center justify-center gap-3 rounded-[1.5rem] px-4 py-4 text-sm font-bold text-danger bg-danger/5 hover:bg-danger/10 border border-danger/10 transition-all active:scale-95 group"
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
