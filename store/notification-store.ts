import { create } from "zustand";

interface NotificationState {
  permission: NotificationPermission | null;
  isSupported: boolean;
  isSubscribed: boolean;
  isRegistering: boolean;
  subscription: PushSubscriptionJSON | null;
  swRegistration: ServiceWorkerRegistration | null;

  setSupported: (supported: boolean) => void;
  setPermission: (permission: NotificationPermission) => void;
  setSubscribed: (subscribed: boolean) => void;
  setRegistering: (registering: boolean) => void;
  setSubscription: (sub: PushSubscriptionJSON | null) => void;
  setSwRegistration: (reg: ServiceWorkerRegistration | null) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  permission: null,
  isSupported: false,
  isSubscribed: false,
  isRegistering: false,
  subscription: null,
  swRegistration: null,

  setSupported: (supported) => set({ isSupported: supported }),
  setPermission: (permission) => set({ permission }),
  setSubscribed: (subscribed) => set({ isSubscribed: subscribed }),
  setRegistering: (registering) => set({ isRegistering: registering }),
  setSubscription: (sub) => set({ subscription: sub }),
  setSwRegistration: (reg) => set({ swRegistration: reg }),
}));
