"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AccountSettings } from "@/components/settings/account-settings";
import { Settings } from "lucide-react";

export default function CustomerSettingsPage() {
  return (
    <DashboardLayout allowedRole="customer">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Settings
          </h1>
          <p className="text-text-secondary mt-1">Manage your personal information.</p>
        </div>

        <AccountSettings />
      </div>
    </DashboardLayout>
  );
}
