import { create } from "zustand";
import { QueueData } from "@/types";
import { api } from "@/lib/api";

interface QueueState {
  // Global Queue Stats
  stats: QueueData | null;
  isLoadingStats: boolean;
  fetchStats: () => Promise<void>;
  
  // User Queue Position
  position: number | null;
  estWaitMins: number | null;
  isLoadingPosition: boolean;
  fetchPosition: (orderId: string) => Promise<void>;
}

export const useQueueStore = create<QueueState>((set) => ({
  stats: null,
  isLoadingStats: false,
  fetchStats: async () => {
    set({ isLoadingStats: true });
    try {
      const stats = await api.queue.getStats();
      set({ stats });
    } catch (error) {
      console.error("Failed to fetch queue stats:", error);
    } finally {
      set({ isLoadingStats: false });
    }
  },

  position: null,
  estWaitMins: null,
  isLoadingPosition: false,
  fetchPosition: async (orderId) => {
    set({ isLoadingPosition: true });
    try {
      const { position, estWaitMins } = await api.queue.getPosition(orderId);
      set({ position, estWaitMins });
    } catch (error) {
      console.error("Failed to fetch queue position:", error);
    } finally {
      set({ isLoadingPosition: false });
    }
  }
}));
