import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import { api } from "@/lib/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (userData: any) => Promise<void>;
  updateStore: (storeData: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password, role) => {
        set({ isLoading: true });
        try {
          const { user, token } = await api.auth.login(email, password, role);
          set({ user, token, isAuthenticated: true });
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const { user, token } = await api.auth.register(userData);
          set({ user, token, isAuthenticated: true });
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await api.auth.logout();
        } finally {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return;
        
        set({ isLoading: true });
        try {
          const user = await api.auth.me();
          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (userData) => {
        set({ isLoading: true });
        try {
          const user = await api.user.updateProfile(userData);
          set({ user });
        } finally {
          set({ isLoading: false });
        }
      },

      updateStore: async (storeData) => {
        const { user } = get();
        if (!user || !user.store) return;
        
        set({ isLoading: true });
        try {
          const updatedStore = await api.store.update(user.store.id, storeData);
          set({ user: { ...user, store: updatedStore } });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "smartqueue-auth",
    }
  )
);
