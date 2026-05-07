"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAuthStore } from "@/store/auth-store";
import { ToastContainer } from "@/components/ui/toast";
import { PageLoader } from "@/components/ui/loading";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRole?: "seller" | "customer";
}

export function DashboardLayout({ children, allowedRole }: DashboardLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
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
    <div className="flex min-h-screen bg-background">
      <Sidebar role={user?.role as "seller" | "customer"} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
