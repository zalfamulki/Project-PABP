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
  MonitorPlay
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

interface SidebarProps {
  role: "seller" | "customer";
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

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const navigation = role === "seller" ? sellerNav : customerNav;
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="flex h-screen w-64 flex-col bg-surface border-r border-border sticky top-0 overflow-y-auto custom-scrollbar">
      {/* Brand */}
      <div className="flex h-20 items-center px-6 gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <MonitorPlay className="h-6 w-6" />
        </div>
        <span className="text-xl font-bold font-heading text-foreground tracking-tight">
          Smart<span className="text-primary">Queue</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:bg-surface-elevated hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-primary" : "text-text-secondary group-hover:text-foreground"
                )} />
                {item.name}
              </div>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
