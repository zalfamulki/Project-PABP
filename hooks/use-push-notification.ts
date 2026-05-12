"use client";

import { useEffect, useCallback } from "react";
import { useNotificationStore } from "@/store/notification-store";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

const PUBLIC_VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function isValidVapidKey(key: string): boolean {
  if (!key) return false;
  try {
    const decoded = urlBase64ToUint8Array(key);
    return decoded.length > 0;
  } catch {
    return false;
  }
}

export function usePushNotification() {
  const {
    isSupported,
    permission,
    isSubscribed,
    isRegistering,
    subscription,
    swRegistration,
    setSupported,
    setPermission,
    setSubscribed,
    setRegistering,
    setSubscription,
    setSwRegistration,
  } = useNotificationStore();

  const user = useAuthStore((s) => s.user);

  const checkSupport = useCallback(() => {
    const supported =
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window;
    setSupported(supported);
    return supported;
  }, [setSupported]);

  const registerServiceWorker = useCallback(async () => {
    if (!("serviceWorker" in navigator)) return null;

    try {
      const reg = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      setSwRegistration(reg);
      return reg;
    } catch (err) {
      console.error("SW registration failed:", err);
      return null;
    }
  }, [setSwRegistration]);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return "denied";

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, [setPermission]);

  const subscribe = useCallback(async () => {
    if (!isSupported) return null;
    if (!swRegistration) {
      const reg = await registerServiceWorker();
      if (!reg) return null;
    }

    setRegistering(true);

    try {
      const reg =
        swRegistration ||
        (await navigator.serviceWorker.ready) ||
        (await registerServiceWorker());

      if (!reg) {
        setRegistering(false);
        return null;
      }

      const existingSub = await reg.pushManager.getSubscription();
      if (existingSub) {
        await existingSub.unsubscribe();
      }

      if (!isValidVapidKey(PUBLIC_VAPID_KEY)) {
        throw new Error(
          "VAPID public key is not configured. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY in your .env.local file."
        );
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });

      const subJSON = sub.toJSON();
      setSubscription(subJSON);
      setSubscribed(true);

      await api.push.subscribe(subJSON);

      return sub;
    } catch (err) {
      console.error("Push subscription failed:", err);
      return null;
    } finally {
      setRegistering(false);
    }
  }, [
    isSupported,
    swRegistration,
    registerServiceWorker,
    setRegistering,
    setSubscription,
    setSubscribed,
  ]);

  const unsubscribe = useCallback(async () => {
    try {
      if (swRegistration) {
        const sub = await swRegistration.pushManager.getSubscription();
        if (sub) {
          await sub.unsubscribe();
        }
      }

      if (subscription?.endpoint) {
        await api.push.unsubscribe(subscription.endpoint);
      }

      setSubscription(null);
      setSubscribed(false);
    } catch (err) {
      console.error("Unsubscribe failed:", err);
    }
  }, [swRegistration, subscription, setSubscription, setSubscribed]);

  const enableNotifications = useCallback(async () => {
    if (!checkSupport()) {
      console.warn("Push notifications not supported");
      return false;
    }

    const perm = await requestPermission();
    if (perm !== "granted") {
      return false;
    }

    await registerServiceWorker();
    const sub = await subscribe();
    return !!sub;
  }, [checkSupport, requestPermission, registerServiceWorker, subscribe]);

  useEffect(() => {
    checkSupport();
  }, [checkSupport]);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, [setPermission]);

  useEffect(() => {
    if (!isSupported || !swRegistration) return;

    swRegistration.pushManager.getSubscription().then((sub) => {
      if (sub) {
        setSubscription(sub.toJSON());
        setSubscribed(true);
      }
    });
  }, [isSupported, swRegistration, setSubscription, setSubscribed]);

  return {
    isSupported,
    permission,
    isSubscribed,
    isRegistering,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe,
    enableNotifications,
    registerServiceWorker,
  };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
