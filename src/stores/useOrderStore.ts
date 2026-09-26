import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Order } from '@/types';

interface OrderStore {
  orders: Order[];
  placing: boolean;
  error: string | null;
  placeOrder: (input: {
    items: Array<{ productId: string | number; quantity: number }>;
    addressId: string | number;
    paymentMethod: 'online' | 'wallet';
  }) => Promise<Order>;
  clearError: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      placing: false,
      error: null,

      placeOrder: async (input) => {
        set({ placing: true, error: null });
        try {
          const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? 'ثبت سفارش ناموفق بود.');
          const order = data.order as Order;
          set((state) => ({ orders: [order, ...state.orders], placing: false }));
          return order;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'ثبت سفارش ناموفق بود.';
          set({ placing: false, error: message });
          throw new Error(message);
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'dijimoon_orders',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      // See `useMessageStore`: hydrating during render caused an update loop. See `StoreHydration`.
      skipHydration: true,
      partialize: (state) => ({ orders: state.orders }),
    }
  )
);
