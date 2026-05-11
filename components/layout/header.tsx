"use client";

import { Bell, Search, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-20 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
      {/* Search Bar */}
      <div className="relative w-96 max-w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
        <input
          type="text"
          placeholder="Search for anything..."
          className="w-full bg-surface-elevated rounded-xl py-2.5 pl-10 pr-4 text-sm border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 text-text-secondary hover:bg-surface-elevated hover:text-foreground rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-danger rounded-full ring-2 ring-surface" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground line-clamp-1">{user?.name || "Guest"}</p>
            <p className="text-xs text-text-secondary capitalize">
              {user?.role === 'seller' && user?.store?.store_name ? user.store.store_name : (user?.role || "Visitor")}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-surface-elevated flex items-center justify-center text-text-secondary border border-border overflow-hidden">
            <UserIcon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </header>
  );
}
