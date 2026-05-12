"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ShoppingBag, MapPin, Phone, Save, Loader2 } from "lucide-react";
import { toast } from "@/store/toast-store";

export function StoreSettings() {
  const { user, updateStore, isLoading } = useAuthStore();
  const [storeName, setStoreName] = useState(user?.store?.store_name || "");
  const [location, setLocation] = useState(user?.store?.location || "");
  const [phone, setPhone] = useState(user?.store?.phone || "");

  useEffect(() => {
    if (user?.store) {
      setStoreName(user.store.store_name || "");
      setLocation(user.store.location || "");
      setPhone(user.store.phone || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStore({ store_name: storeName, location, phone });
      toast.success("Store settings updated successfully");
    } catch (error) {
      toast.error("Failed to update store settings");
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl">
          <ShoppingBag className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Store Information</h2>
          <p className="text-sm text-text-secondary">Manage your shop details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="storeName">Store Name</Label>
          <div className="relative">
            <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              id="storeName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="pl-10"
              placeholder="Your store name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="storePhone">Store Phone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              id="storePhone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10"
              placeholder="Store phone number"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location / Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
            <textarea
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full min-h-[100px] bg-surface-elevated rounded-xl py-2 pl-10 pr-4 text-sm border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
              placeholder="Store location"
            />
          </div>
        </div>

        <Button type="submit" className="w-full gap-2" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Store Details
        </Button>
      </form>
    </Card>
  );
}
