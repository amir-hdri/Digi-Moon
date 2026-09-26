import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { ThemeMode, ResolvedTheme } from '@/types';

export const THEME_STORAGE_KEY = 'dijimoon_theme';

export interface ThemeStoreState {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

type ThemePersisted = Pick<ThemeStoreState, 'theme' | 'resolvedTheme'>;

/** Inert storage for SSR, where `window.localStorage` does not exist. */
const ssrStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const clientStorage = <T>() =>
  createJSONStorage<T>(() => (typeof window !== 'undefined' ? window.localStorage : ssrStorage));

function systemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolve(theme: ThemeMode): ResolvedTheme {
  return theme === 'system' ? systemTheme() : theme;
}

/** Reflects the theme onto <html> and the browser chrome (address bar / notch strip). */
function apply(resolved: ResolvedTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
    meta.removeAttribute('media');
    meta.content = resolved === 'dark' ? '#09090b' : '#f8fafc';
  }
}

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',

      setTheme: (theme) => {
        const resolvedTheme = resolve(theme);
        apply(resolvedTheme);
        set({ theme, resolvedTheme });
      },

      toggleTheme: () => {
        // Toggling out of `system` pins the opposite of what is currently on screen.
        get().setTheme(get().resolvedTheme === 'dark' ? 'light' : 'dark');
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      version: 2,
      storage: clientStorage<ThemePersisted>(),
      // Rehydrated in an effect (see `StoreHydration`). The anti-FOUC script in the root
      // layout applies the class synchronously before paint; this keeps the store in sync.
      skipHydration: true,
      partialize: (state) => ({ theme: state.theme, resolvedTheme: state.resolvedTheme }),
    }
  )
);

/** Subscribes to OS-level theme changes while the preference is `system`. */
export function watchSystemTheme(): () => void {
  if (typeof window === 'undefined') return () => {};
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => {
    if (useThemeStore.getState().theme === 'system') {
      const resolvedTheme = systemTheme();
      apply(resolvedTheme);
      useThemeStore.setState({ resolvedTheme });
    }
  };
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}
