import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppNotification, NotificationType } from '@/types';

export type NotificationFilter = NotificationType | 'all';

interface NotificationStore {
  items: AppNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  filter: NotificationFilter;
  readIds: string[];
  local: AppNotification[];
  fetch: (filter?: NotificationFilter) => Promise<void>;
  setFilter: (filter: NotificationFilter) => void;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  pushLocal: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
}

function applyRead(items: AppNotification[], readIds: string[]): AppNotification[] {
  if (readIds.length === 0) return items;
  const read = new Set(readIds);
  return items.map((item) => (read.has(item.id) ? { ...item, read: true } : item));
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      items: [],
      unreadCount: 0,
      loading: false,
      error: null,
      filter: 'all',
      readIds: [],
      local: [],

      fetch: async (filter) => {
        const activeFilter = filter ?? get().filter;
        set({ loading: true, error: null, filter: activeFilter });
        try {
          const res = await fetch(
            `/api/notifications?type=${activeFilter}&limit=50`,
            { cache: 'no-store' }
          );
          if (!res.ok) throw new Error('خطا در دریافت اعلان‌ها');
          const data = (await res.json()) as {
            items: AppNotification[];
            unreadCount: number;
          };
          const { readIds, local } = get();
          const serverItems = applyRead(data.items, readIds);
          const merged = [...local, ...serverItems.filter((s) => !local.some((l) => l.id === s.id))];
          set({
            items: merged,
            unreadCount: merged.filter((n) => !n.read).length,
            loading: false,
          });
        } catch (err) {
          set({
            loading: false,
            error: err instanceof Error ? err.message : 'خطا در دریافت اعلان‌ها',
          });
        }
      },

      setFilter: (filter) => {
        set({ filter });
        void get().fetch(filter);
      },

      markRead: async (id) => {
        const { readIds, items } = get();
        if (readIds.includes(id)) return;
        // Only decrement when the target was actually unread — the old unconditional
        // decrement drifted the badge away from the real unread count.
        const wasUnread = items.some((n) => n.id === id && !n.read);
        const nextReadIds = [...readIds, id];
        set((state) => ({
          readIds: nextReadIds,
          items: state.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
        }));
        try {
          await fetch('/api/notifications/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: [id] }),
          });
        } catch {
          set({ error: 'ثبت خوانده‌شدن اعلان ناموفق بود.' });
        }
      },

      markAllRead: async () => {
        const ids = get().items.filter((n) => !n.read).map((n) => n.id);
        set((state) => ({
          readIds: [...new Set([...state.readIds, ...ids])],
          items: state.items.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
        try {
          await fetch('/api/notifications/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ all: true }),
          });
        } catch {
          set({ error: 'ثبت خوانده‌شدن اعلان‌ها ناموفق بود.' });
        }
      },

      pushLocal: (notification) => {
        const item: AppNotification = {
          ...notification,
          id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
          read: false,
        };
        set((state) => ({
          local: [item, ...state.local].slice(0, 20),
          items: [item, ...state.items],
          unreadCount: state.unreadCount + 1,
        }));
      },
    }),
    {
      name: 'dijimoon_notifications',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      // See `useMessageStore`: hydrating during render caused an update loop. See `StoreHydration`.
      skipHydration: true,
      partialize: (state) => ({ readIds: state.readIds, local: state.local }),
    }
  )
);
