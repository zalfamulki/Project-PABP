"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAuthStore } from "@/store/auth-store";
import { PageLoader } from "@/components/ui/loading";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRole?: "seller" | "customer";
}

export function DashboardLayout({ children, allowedRole }: DashboardLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (allowedRole && user?.role !== allowedRole) {
        router.push(user?.role === "seller" ? "/seller" : "/customer");
      }
    }
  }, [isMounted, isLoading, isAuthenticated, user, allowedRole, router]);

  if (!isMounted || isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated || (allowedRole && user?.role !== allowedRole)) {
    return null; // or a 403 page
  }

  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden relative">
      {/* Subtle background element */}
      <div className="absolute inset-0 bg-grid opacity-[0.4] pointer-events-none" />
      
      <Sidebar 
        role={user?.role as "seller" | "customer"} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className={cn(
            "max-w-[1600px] mx-auto px-4 py-6 md:px-8 md:py-10 transition-all duration-500",
            "w-full h-full"
          )}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
