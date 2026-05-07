import { MenuItem, Order, DashboardStats } from "@/types";

export const MOCK_MENU: MenuItem[] = [
  {
    id: "m1",
    name: "Classic Smashburger",
    description: "Double beef patty, american cheese, house sauce, pickles",
    price: 45000,
    category: "Mains",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600",
    isAvailable: true,
  },
  {
    id: "m2",
    name: "Truffle Fries",
    description: "Crispy shoestring fries tossed in truffle oil and parmesan",
    price: 35000,
    category: "Sides",
    imageUrl: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&q=80&w=600",
    isAvailable: true,
  },
  {
    id: "m3",
    name: "Spicy Fried Chicken",
    description: "Nashville-style hot chicken with buttermilk ranch",
    price: 55000,
    category: "Mains",
    imageUrl: "https://images.unsplash.com/photo-1626082895617-2c6ad3ed327a?auto=format&fit=crop&q=80&w=600",
    isAvailable: true,
  },
  {
    id: "m4",
    name: "Neon Lemonade",
    description: "Electric blue raspberry lemonade",
    price: 25000,
    category: "Drinks",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600",
    isAvailable: true,
  },
  {
    id: "m5",
    name: "Matcha Latte",
    description: "Premium ujimatcha with oat milk",
    price: 38000,
    category: "Drinks",
    imageUrl: "https://images.unsplash.com/photo-1515823662972-da6a2b4d3002?auto=format&fit=crop&q=80&w=600",
    isAvailable: true,
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-001",
    customerId: "c1",
    customerName: "Alex",
    items: [
      { id: "i1", menuItemId: "m1", name: "Classic Smashburger", price: 45000, quantity: 2 },
      { id: "i2", menuItemId: "m2", name: "Truffle Fries", price: 35000, quantity: 1 }
    ],
    totalAmount: 125000,
    status: "preparing",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "ORD-002",
    customerId: "c2",
    customerName: "Sarah",
    items: [
      { id: "i3", menuItemId: "m5", name: "Matcha Latte", price: 38000, quantity: 1 }
    ],
    totalAmount: 38000,
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "ORD-003",
    customerId: "c3",
    customerName: "Michael",
    items: [
      { id: "i4", menuItemId: "m3", name: "Spicy Fried Chicken", price: 55000, quantity: 1 },
      { id: "i5", menuItemId: "m4", name: "Neon Lemonade", price: 25000, quantity: 2 }
    ],
    totalAmount: 105000,
    status: "ready",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  }
];

export const MOCK_STATS: DashboardStats = {
  totalOrdersToday: 42,
  revenueToday: 3580000,
  pendingOrders: 5,
  peakHours: [
    { hour: "10:00", count: 12 },
    { hour: "11:00", count: 25 },
    { hour: "12:00", count: 48 },
    { hour: "13:00", count: 35 },
    { hour: "14:00", count: 18 },
    { hour: "15:00", count: 10 },
  ]
};
