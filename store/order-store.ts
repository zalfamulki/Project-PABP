import { create } from "zustand";
import { Order, OrderItem, MenuItem } from "@/types";
import { api } from "@/lib/api";

interface OrderState {
  // Customer Cart
  cart: OrderItem[];
  cartTotal: number;
  addToCart: (item: MenuItem, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Orders
  orders: Order[];
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  placeOrder: (notes?: string) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  cart: [],
  cartTotal: 0,
  
  addToCart: (item, quantity) => {
    set((state) => {
      const existingItem = state.cart.find((i) => i.menuItemId === item.id);
      let newCart;
      
      if (existingItem) {
        newCart = state.cart.map((i) =>
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        newCart = [...state.cart, { 
          id: `cart-${Date.now()}`, 
          menuItemId: item.id, 
          name: item.name, 
          price: item.price, 
          quantity,
          store_id: item.store_id,
          storeName: item.storeName
        }];
      }
      
      return { 
        cart: newCart,
        cartTotal: newCart.reduce((total, i) => total + (i.price * i.quantity), 0)
      };
    });
  },

  removeFromCart: (itemId) => {
    set((state) => {
      const newCart = state.cart.filter((i) => i.id !== itemId);
      return { 
        cart: newCart,
        cartTotal: newCart.reduce((total, i) => total + (i.price * i.quantity), 0)
      };
    });
  },

  updateQuantity: (itemId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        const newCart = state.cart.filter((i) => i.id !== itemId);
        return {
          cart: newCart,
          cartTotal: newCart.reduce((total, i) => total + (i.price * i.quantity), 0)
        };
      }
      
      const newCart = state.cart.map((i) =>
        i.id === itemId ? { ...i, quantity } : i
      );
      
      return {
        cart: newCart,
        cartTotal: newCart.reduce((total, i) => total + (i.price * i.quantity), 0)
      };
    });
  },

  clearCart: () => set({ cart: [], cartTotal: 0 }),

  orders: [],
  isLoading: false,

  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const orders = await api.orders.getAll();
      set({ orders });
    } finally {
      set({ isLoading: false });
    }
  },

  placeOrder: async (notes?: string) => {
    const { cart, clearCart } = get();
    if (cart.length === 0) throw new Error("Cart is empty");

    set({ isLoading: true });
    try {
      const response = await api.orders.create({
        items: cart,
        totalAmount: 0, // Backend calculates this now based on subtotal
        notes
      });
      // response.data is now an array of orders
      clearCart();
      return response.data[0]; // Returning the first one as a default, or handle as needed
    } finally {
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ isLoading: true });
    try {
      const updatedOrder = await api.orders.updateStatus(id, status);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? updatedOrder : o))
      }));
    } finally {
      set({ isLoading: false });
    }
  }
}));
