import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ChatMessage, MessageThread } from '@/types';

interface MessageStore {
  threads: MessageThread[];
  activeThreadId: string | null;
  loading: boolean;
  sending: boolean;
  error: string | null;
  fetchThreads: () => Promise<void>;
  openThread: (threadId: string) => Promise<void>;
  newThread: (title?: string) => void;
  sendMessage: (threadId: string, text: string) => Promise<boolean>;
  clearError: () => void;
}

function mergeThreads(local: MessageThread[], server: MessageThread[]): MessageThread[] {
  const byId = new Map<string, MessageThread>();
  for (const thread of server) byId.set(thread.id, thread);
  for (const thread of local) {
    const existing = byId.get(thread.id);
    if (!existing) {
      byId.set(thread.id, thread);
      continue;
    }
    const mergedMessages = [...existing.messages];
    for (const message of thread.messages) {
      if (!mergedMessages.some((m) => m.id === message.id)) mergedMessages.push(message);
    }
    byId.set(thread.id, { ...existing, messages: mergedMessages, updatedAt: thread.updatedAt });
  }
  return [...byId.values()].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}

export const useMessageStore = create<MessageStore>()(
  persist(
    (set, get) => ({
      threads: [],
      activeThreadId: null,
      loading: false,
      sending: false,
      error: null,

      fetchThreads: async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch('/api/threads', { cache: 'no-store' });
          if (!res.ok) throw new Error('خطا در دریافت گفتگوها');
          const data = (await res.json()) as { threads: MessageThread[] };
          set({ threads: mergeThreads(get().threads, data.threads), loading: false });
        } catch (err) {
          set({
            loading: false,
            error: err instanceof Error ? err.message : 'خطا در دریافت گفتگوها',
          });
        }
      },

      openThread: async (threadId) => {
        set({ activeThreadId: threadId, error: null });
        try {
          const res = await fetch(`/api/messages?threadId=${encodeURIComponent(threadId)}`, {
            cache: 'no-store',
          });
          if (res.status === 404) return;
          if (!res.ok) throw new Error('خطا در دریافت پیام‌ها');
          const data = (await res.json()) as { thread: MessageThread };
          set((state) => ({
            threads: state.threads.map((t) =>
              t.id === threadId ? { ...data.thread, unreadCount: 0 } : t
            ),
          }));
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'خطا در دریافت پیام‌ها' });
        }
      },

      newThread: (title = 'گفتگوی جدید') => {
        const id = `thread-${Date.now()}`;
        const thread: MessageThread = {
          id,
          title,
          subject: 'گفتگو با پشتیبانی مون مارکت',
          status: 'open',
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
          messages: [],
        };
        set((state) => ({ threads: [thread, ...state.threads], activeThreadId: id }));
      },

      sendMessage: async (threadId, text) => {
        const trimmed = text.trim();
        if (!trimmed) return false;
        const tempId = `temp-${Date.now()}`;
        const optimistic: ChatMessage = {
          id: tempId,
          threadId,
          author: 'user',
          body: trimmed,
          createdAt: new Date().toISOString(),
          status: 'sending',
        };
        set((state) => ({
          sending: true,
          error: null,
          threads: state.threads.map((t) =>
            t.id === threadId
              ? { ...t, messages: [...t.messages, optimistic], updatedAt: optimistic.createdAt }
              : t
          ),
        }));
        try {
          const res = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ threadId, body: trimmed }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? 'ارسال پیام ناموفق بود.');
          const serverMessage = data.message as ChatMessage;
          const autoReply = data.autoReply as ChatMessage | undefined;
          set((state) => ({
            sending: false,
            threads: state.threads.map((t) => {
              if (t.id !== threadId) return t;
              const messages = t.messages
                .filter((m) => m.id !== tempId)
                .concat([serverMessage]);
              if (autoReply) messages.push(autoReply);
              return { ...t, messages, updatedAt: autoReply?.createdAt ?? serverMessage.createdAt };
            }),
          }));
          return true;
        } catch (err) {
          set((state) => ({
            sending: false,
            error: err instanceof Error ? err.message : 'ارسال پیام ناموفق بود.',
            threads: state.threads.map((t) =>
              t.id === threadId
                ? {
                    ...t,
                    messages: t.messages.map((m) =>
                      m.id === tempId ? { ...m, status: 'failed' as const } : m
                    ),
                  }
                : t
            ),
          }));
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'dijimoon_messages',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      /*
        Rehydrated explicitly by `StoreHydration`. Without this, zustand/persist hydrates
        the store at *creation* time — i.e. while the first client render is in flight.
        That made `localStorage` state diverge from the server HTML, and because
        `Header` subscribes to a derived value over `threads`, the mid-render `set`
        re-triggered the subscription until React bailed with "Maximum update depth
        exceeded" and the page fell to the error boundary.
      */
      skipHydration: true,
      partialize: (state) => ({ threads: state.threads, activeThreadId: state.activeThreadId }),
    }
  )
);
