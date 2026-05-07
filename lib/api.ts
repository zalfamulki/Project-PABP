import { MenuItem, Order, DashboardStats, QueueData, User } from "@/types";
import { MOCK_MENU, MOCK_ORDERS, MOCK_STATS } from "./mock-data";

// Simulated delay to mimic network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Keep some state in memory for the mock API to work with
let mockOrders = [...MOCK_ORDERS];
let mockMenu = [...MOCK_MENU];

export const api = {
  auth: {
    login: async (email: string, role: "seller" | "customer"): Promise<{user: User, token: string}> => {
      await delay(800);
      return {
        user: { id: role === "seller" ? "s1" : "c1", name: email.split("@")[0], email, role },
        token: "mock-jwt-token"
      };
    },
    me: async (): Promise<User> => {
      await delay(500);
      return { id: "c1", name: "Demo User", email: "demo@example.com", role: "customer" };
    }
  },
  
  menu: {
    getAll: async (): Promise<MenuItem[]> => {
      await delay(600);
      return [...mockMenu];
    },
    add: async (item: Omit<MenuItem, "id">): Promise<MenuItem> => {
      await delay(800);
      const newItem = { ...item, id: `m${Date.now()}` };
      mockMenu.push(newItem);
      return newItem;
    },
    update: async (id: string, updates: Partial<MenuItem>): Promise<MenuItem> => {
      await delay(800);
      const index = mockMenu.findIndex(m => m.id === id);
      if (index > -1) {
        mockMenu[index] = { ...mockMenu[index], ...updates };
        return mockMenu[index];
      }
      throw new Error("Item not found");
    },
    delete: async (id: string): Promise<void> => {
      await delay(800);
      mockMenu = mockMenu.filter(m => m.id !== id);
    }
  },
  
  orders: {
    getAll: async (): Promise<Order[]> => {
      await delay(500);
      return [...mockOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    create: async (orderData: Pick<Order, "items" | "totalAmount" | "notes">): Promise<Order> => {
      await delay(1000);
      const newOrder: Order = {
        ...orderData,
        id: `ORD-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        customerId: "c1",
        customerName: "You",
        status: "pending",
        createdAt: new Date().toISOString()
      };
      mockOrders.unshift(newOrder);
      return newOrder;
    },
    updateStatus: async (id: string, status: Order["status"]): Promise<Order> => {
      await delay(500);
      const index = mockOrders.findIndex(o => o.id === id);
      if (index > -1) {
        mockOrders[index].status = status;
        return mockOrders[index];
      }
      throw new Error("Order not found");
    }
  },
  
  queue: {
    getStats: async (): Promise<QueueData> => {
      await delay(500);
      const pending = mockOrders.filter(o => o.status === "pending").length;
      const preparing = mockOrders.filter(o => o.status === "preparing").length;
      
      let load: "low" | "medium" | "high" | "critical" = "low";
      const total = pending + preparing;
      if (total > 15) load = "critical";
      else if (total > 10) load = "high";
      else if (total > 5) load = "medium";
      
      return {
        totalPending: pending,
        totalPreparing: preparing,
        averageWaitTimeMins: total * 5,
        queueLoad: load
      };
    },
    getPosition: async (orderId: string): Promise<{ position: number, estWaitMins: number }> => {
      await delay(300);
      const activeOrders = mockOrders
        .filter(o => ["pending", "preparing"].includes(o.status))
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      const index = activeOrders.findIndex(o => o.id === orderId);
      if (index === -1) return { position: 0, estWaitMins: 0 };
      
      return {
        position: index + 1,
        estWaitMins: (index + 1) * 5
      };
    }
  },

  stats: {
    getDashboard: async (): Promise<DashboardStats> => {
      await delay(800);
      return {
        ...MOCK_STATS,
        pendingOrders: mockOrders.filter(o => o.status === "pending").length
      };
    }
  }
};
