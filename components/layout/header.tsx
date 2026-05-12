"use client";

import { Bell, Search, User as UserIcon, Menu } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-20 lg:h-24 border-b border-border/50 bg-surface/70 backdrop-blur-xl sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-text-secondary hover:bg-surface-elevated rounded-xl transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Dynamic Breadcrumbs or Page Title could go here, but keeping Search for now */}
        <div className="relative w-full max-w-md group hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search for orders, items..."
            className="w-full bg-surface-elevated/50 rounded-2xl py-3 px-12 text-sm border border-transparent focus:border-primary/20 focus:bg-surface focus:ring-4 focus:ring-primary/5 transition-all outline-none"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Search - only icon */}
        <button className="sm:hidden p-2.5 text-text-secondary hover:bg-surface-elevated rounded-xl transition-all">
          <Search className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 md:p-3 text-text-secondary hover:bg-primary/10 hover:text-primary rounded-2xl transition-all active:scale-90 group">
          <Bell className="h-5 w-5 md:h-6 w-6" />
          <span className="absolute top-3 right-3 h-2 w-2 bg-danger rounded-full ring-2 ring-surface group-hover:ring-primary/10" />
        </button>

        <div className="h-8 w-[1px] bg-border/50 mx-1 md:mx-2" />

        {/* User Profile */}
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
