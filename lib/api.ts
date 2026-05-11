import { MenuItem, Order, DashboardStats, QueueData, User } from "@/types";
import { MOCK_MENU, MOCK_ORDERS, MOCK_STATS } from "./mock-data";
import { useAuthStore } from "@/store/auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('smartqueue_token');
  }
  return null;
};

const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('smartqueue_token', token);
  }
};

const getHeaders = (withToken = false) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (withToken) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorMsg;
    } catch (e) {
      errorMsg = res.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return res.json();
};

export const api = {
  auth: {
    login: async (email: string, password: string, role?: string): Promise<{user: User, token: string}> => {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password, role })
      });
      const data = await handleResponse(res);
      if (data.status === 'success') {
        setToken(data.authorisation.token);
        return { user: data.user, token: data.authorisation.token };
      }
      throw new Error(data.message || 'Login failed');
    },
    register: async (userData: any): Promise<{user: User, token: string}> => {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData)
      });
      const data = await handleResponse(res);
      if (data.status === 'success') {
        setToken(data.authorisation.token);
        return { user: data.user, token: data.authorisation.token };
      }
      throw new Error(data.message || 'Registration failed');
    },
    me: async (): Promise<User> => {
      const res = await fetch(`${API_URL}/me`, {
        headers: getHeaders(true)
      });
      const data = await handleResponse(res);
      return data.user;
    },
    logout: async (): Promise<void> => {
      try {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: getHeaders(true)
        });
      } finally {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('smartqueue_token');
        }
      }
    }
  },
  
  menu: {
    getAll: async (): Promise<MenuItem[]> => {
      const user = useAuthStore.getState().user;
      const storeId = user?.store?.id;
      const url = storeId ? `${API_URL}/menu-items?store_id=${storeId}` : `${API_URL}/menu-items`;
      
      const res = await fetch(url, { headers: getHeaders() });
      const data = await handleResponse(res);
      return (data.data || []).map((item: any) => ({
        id: String(item.id),
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        imageUrl: item.image_url,
        isAvailable: Boolean(item.is_available),
        stock: item.stock,
        store_id: item.store_id,
        storeName: item.store?.store_name
      }));
    },
    add: async (item: Omit<MenuItem, "id">): Promise<MenuItem> => {
      const user = useAuthStore.getState().user;
      const storeId = user?.store?.id || 1;
      
      const res = await fetch(`${API_URL}/menu-items`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({
          store_id: storeId,
          name: item.name,
          price: item.price,
          category: item.category,
          description: item.description,
          image_url: item.imageUrl,
          is_available: item.isAvailable,
          stock: item.stock
        })
      });
      const data = await handleResponse(res);
      const newItem = data.data;
      return {
        id: String(newItem.id),
        name: newItem.name,
        description: newItem.description,
        price: newItem.price,
        category: newItem.category,
        imageUrl: newItem.image_url,
        isAvailable: Boolean(newItem.is_available),
        stock: newItem.stock,
        store_id: newItem.store_id
      };
    },
    update: async (id: string, updates: Partial<MenuItem>): Promise<MenuItem> => {
      const mappedUpdates: any = {};
      if (updates.name !== undefined) mappedUpdates.name = updates.name;
      if (updates.price !== undefined) mappedUpdates.price = updates.price;
      if (updates.category !== undefined) mappedUpdates.category = updates.category;
      if (updates.description !== undefined) mappedUpdates.description = updates.description;
      if (updates.imageUrl !== undefined) mappedUpdates.image_url = updates.imageUrl;
      if (updates.isAvailable !== undefined) mappedUpdates.is_available = updates.isAvailable;
      if (updates.stock !== undefined) mappedUpdates.stock = updates.stock;

      const res = await fetch(`${API_URL}/menu-items/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(mappedUpdates)
      });
      const data = await handleResponse(res);
      const updated = data.data;
      return {
        id: String(updated.id),
        name: updated.name,
        description: updated.description,
        price: updated.price,
        category: updated.category,
        imageUrl: updated.image_url,
        isAvailable: Boolean(updated.is_available),
        stock: updated.stock,
        store_id: updated.store_id
      };
    },
    delete: async (id: string): Promise<void> => {
      const res = await fetch(`${API_URL}/menu-items/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true)
      });
      await handleResponse(res);
    }
  },
  
  orders: {
    mapOrder: (item: any): Order => ({
      id: String(item.id),
      customerId: String(item.user_id),
      customerName: item.user?.name || 'Customer',
      items: (item.items || []).map((oi: any) => ({
        id: String(oi.id),
        menuItemId: String(oi.menu_id),
        name: oi.menu?.name || 'Unknown Item',
        price: Number(oi.menu?.price || 0),
        quantity: Number(oi.quantity),
        store_id: item.store_id
      })),
      totalAmount: Number(item.total_price),
      status: item.status,
      createdAt: item.created_at,
      notes: item.notes
    }),
    getAll: async (): Promise<Order[]> => {
      const res = await fetch(`${API_URL}/orders`, { headers: getHeaders(true) });
      const data = await handleResponse(res);
      return (data.data || []).map(api.orders.mapOrder);
    },
    create: async (orderData: { items: OrderItem[], totalAmount: number, notes?: string }): Promise<Order> => {
      // Backend expects store_id, total_price, and items with menu_id, quantity, subtotal
      const storeId = orderData.items[0]?.store_id || 1;
      
      const payload = {
        store_id: storeId,
        total_price: orderData.totalAmount,
        notes: orderData.notes,
        items: orderData.items.map(item => ({
          menu_id: Number(item.menuItemId),
          quantity: item.quantity,
          subtotal: Number(item.price) * item.quantity
        }))
      };

      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(payload)
      });
      const data = await handleResponse(res);
      return api.orders.mapOrder(data.data);
    },
    updateStatus: async (id: string, status: string): Promise<Order> => {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify({ status })
      });
      const data = await handleResponse(res);
      return api.orders.mapOrder(data.data);
    }
  },
  
  queue: {
    getStats: async (): Promise<QueueData> => {
      try {
        const res = await fetch(`${API_URL}/queues`, { headers: getHeaders(true) });
        const data = await handleResponse(res);
        return data.data;
      } catch (e) {
        return { totalPending: 0, totalPreparing: 0, averageWaitTimeMins: 0, queueLoad: "low" };
      }
    }
  },

  user: {
    updateProfile: async (userData: { name?: string, phone?: string, address?: string }): Promise<User> => {
      const res = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(userData)
      });
      const data = await handleResponse(res);
      return data.user;
    }
  },

  store: {
    update: async (id: number, storeData: { store_name?: string, location?: string, phone?: string }): Promise<any> => {
      const res = await fetch(`${API_URL}/stores/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(storeData)
      });
      const data = await handleResponse(res);
      return data.data;
    }
  },

  stats: {
    getDashboard: async (): Promise<DashboardStats> => {
       try {
         const res = await fetch(`${API_URL}/stats/dashboard`, { headers: getHeaders(true) });
         const data = await handleResponse(res);
         return data.data;
       } catch (e) {
         return MOCK_STATS;
       }
    }
  }
};
