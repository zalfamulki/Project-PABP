"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Phone, MapPin, Save, Loader2 } from "lucide-react";
import { toast } from "@/store/toast-store";

export function AccountSettings() {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ name, phone, address });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Account Information</h2>
          <p className="text-sm text-text-secondary">Update your personal details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
              placeholder="Your name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10"
              placeholder="08xxxxxxxxxx"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full min-h-[100px] bg-surface-elevated rounded-xl py-2 pl-10 pr-4 text-sm border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
              placeholder="Your address"
            />
          </div>
        </div>

        <Button type="submit" className="w-full gap-2" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </form>
    </Card>
  );
}
