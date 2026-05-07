import { create } from "zustand";
import { MenuItem } from "@/types";
import { api } from "@/lib/api";
import { toast } from "./toast-store";

interface MenuState {
  menu: MenuItem[];
  isLoading: boolean;
  fetchMenu: () => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, "id">) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  menu: [],
  isLoading: false,

  fetchMenu: async () => {
    set({ isLoading: true });
    try {
      const menu = await api.menu.getAll();
      set({ menu });
    } finally {
      set({ isLoading: false });
    }
  },

  addMenuItem: async (item) => {
    set({ isLoading: true });
    try {
      const newItem = await api.menu.add(item);
      set((state) => ({ menu: [...state.menu, newItem] }));
      toast.success("Menu item added successfully");
    } catch (error) {
      toast.error("Failed to add menu item");
    } finally {
      set({ isLoading: false });
    }
  },

  updateMenuItem: async (id, item) => {
    set({ isLoading: true });
    try {
      const updatedItem = await api.menu.update(id, item);
      set((state) => ({
        menu: state.menu.map((m) => (m.id === id ? updatedItem : m)),
      }));
      toast.success("Menu item updated");
    } catch (error) {
      toast.error("Failed to update menu item");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteMenuItem: async (id) => {
    set({ isLoading: true });
    try {
      await api.menu.delete(id);
      set((state) => ({
        menu: state.menu.filter((m) => m.id !== id),
      }));
      toast.success("Menu item removed");
    } catch (error) {
      toast.error("Failed to delete menu item");
    } finally {
      set({ isLoading: false });
    }
  },

  toggleAvailability: async (id) => {
    const item = get().menu.find((m) => m.id === id);
    if (!item) return;
    
    set({ isLoading: true });
    try {
      const updatedItem = await api.menu.update(id, { isAvailable: !item.isAvailable });
      set((state) => ({
        menu: state.menu.map((m) => (m.id === id ? updatedItem : m)),
      }));
      toast.info(`${item.name} is now ${!item.isAvailable ? 'available' : 'unavailable'}`);
    } finally {
      set({ isLoading: false });
    }
  }
}));
