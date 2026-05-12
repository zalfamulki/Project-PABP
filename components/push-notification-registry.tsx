"use client";

import { useEffect } from "react";
import { usePushNotification } from "@/hooks/use-push-notification";
import { useAuthStore } from "@/store/auth-store";

export function PushNotificationRegistry() {
  const { registerServiceWorker, isSupported } = usePushNotification();
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isSupported) {
      registerServiceWorker();
    }
  }, [isSupported, registerServiceWorker]);

  return null;
}
