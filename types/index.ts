export type Role = "seller" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  address?: string;
  store?: {
    id: number;
    store_name: string;
    location: string;
    phone?: string;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  stock?: number;
  store_id?: number;
  storeName?: string;
}

export type OrderStatus = "pending" | "preparing" | "ready" | "completed" | "cancelled";

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  store_id?: number;
  storeName?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}

export interface QueueData {
  totalPending: number;
  totalPreparing: number;
  averageWaitTimeMins: number;
  queueLoad: "low" | "medium" | "high" | "critical";
}

export interface DashboardStats {
  totalOrdersToday: number;
  revenueToday: number;
  pendingOrders: number;
  peakHours: { hour: string; count: number }[];
}
