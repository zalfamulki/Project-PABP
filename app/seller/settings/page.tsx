"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AccountSettings } from "@/components/settings/account-settings";
import { StoreSettings } from "@/components/settings/store-settings";
import { Settings } from "lucide-react";

export default function SellerSettingsPage() {
  return (
    <DashboardLayout allowedRole="seller">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Settings
          </h1>
          <p className="text-text-secondary mt-1">Manage your account and store preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AccountSettings />
          <StoreSettings />
        </div>
      </div>
    </DashboardLayout>
  );
}
