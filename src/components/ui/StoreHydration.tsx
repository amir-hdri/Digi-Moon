'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore, watchSystemTheme } from '@/stores/useThemeStore';
import { useMessageStore } from '@/stores/useMessageStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useOrderStore } from '@/stores/useOrderStore';

/**
 * All persisted stores use `skipHydration: true` so their first client render matches the
 * server-rendered HTML. Reading `localStorage` during render meant the cart badge, the
 * profile link and the theme class all disagreed with the SSR output — a guaranteed
 * hydration error. This component rehydrates them once, after mount.
 */
export function StoreHydration() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    void useAuthStore.persist.rehydrate();
    void useThemeStore.persist.rehydrate();
    void useMessageStore.persist.rehydrate();
    void useNotificationStore.persist.rehydrate();
    void useOrderStore.persist.rehydrate();
    return watchSystemTheme();
  }, []);

  return null;
}

/** `false` on the server and on the first client render, `true` afterwards. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
