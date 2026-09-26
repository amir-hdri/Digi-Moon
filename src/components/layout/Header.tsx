'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { toPersianDigits } from '@/lib/persian';
import { selectCartCount, useCartStore } from '@/stores/useCartStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { MessageCircle, ShoppingCart, Sun, Moon, User, Menu, MapPin } from 'lucide-react';
import { MoonMarketLogo } from '../ui/MoonMarketLogo';
import { CategoryDrawer } from '../navigation/CategoryDrawer';
import { CategorySubnav } from '../navigation/CategorySubnav';
import { SearchBar } from '../ui/SearchBar';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { useMessageStore } from '@/stores/useMessageStore';
import { useNotificationStore } from '@/stores/useNotificationStore';

export interface HeaderProps {
  onAddressClick?: () => void;
  onLoginClick?: () => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onAddressClick,
  onLoginClick,
  onSelectCategory,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  /*
    Every subscription below is a narrow selector returning a primitive. The previous
    version called `useCartStore((s) => s.getItemCount())` and destructured whole stores
    with `useAuthStore()` / `useThemeStore()`, so any store write — marking one
    notification read, toggling one address's default flag — re-rendered the entire header.
  */
  const cartCount = useCartStore(selectCartCount);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const firstName = useAuthStore((state) => state.user?.firstName ?? null);
  const activeAddressTitle = useAuthStore((state) => state.activeAddress?.title ?? null);

  const messageUnread = useMessageStore((state) =>
    state.threads.reduce((sum, thread) => sum + thread.unreadCount, 0)
  );
  const fetchNotifications = useNotificationStore((state) => state.fetch);
  const fetchThreads = useMessageStore((state) => state.fetchThreads);

  useEffect(() => {
    void fetchNotifications();
    void fetchThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hoverScale = useCallback(
    (value: number) => (reduceMotion ? undefined : { scale: value }),
    [reduceMotion]
  );

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 border-b
          bg-slate-50/88 dark:bg-zinc-950/90
          backdrop-blur-[16px] [backdrop-filter:blur(16px)_saturate(190%)]
          ${isScrolled
            ? 'shadow-lg shadow-slate-900/[0.06] dark:shadow-black/30 border-slate-200/80 dark:border-zinc-800/80'
            : 'shadow-sm border-slate-200/50 dark:border-zinc-800/50'
          }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-5">
          {/* Main Row */}
          <div className="h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">

            {/* Right: Menu + Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <motion.button
                type="button"
                whileHover={hoverScale(1.05)}
                whileTap={hoverScale(0.92)}
                onClick={() => setIsDrawerOpen(true)}
                className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100/90 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                aria-label="باز کردن منوی دسته‌بندی"
              >
                <Menu className="w-[18px] h-[18px]" />
              </motion.button>

              <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
                <motion.div
                  whileHover={reduceMotion ? undefined : { scale: 1.06, rotate: -2 }}
                  whileTap={hoverScale(0.94)}
                  transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                  className="rounded-xl overflow-hidden flex items-center justify-center"
                >
                  <MoonMarketLogo size="sm" />
                </motion.div>
                <div className="text-right flex flex-col justify-center leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-lg font-black text-slate-900 dark:text-zinc-100 whitespace-nowrap tracking-tight">
                      مون مارکت
                    </span>
                    <span className="hidden xs:block text-[8.5px] sm:text-[9.5px] px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black shrink-0 border border-rose-500/20 leading-none">
                      رسمی
                    </span>
                  </div>
                  <span className="hidden sm:block text-[9.5px] text-slate-500 dark:text-zinc-400 font-medium whitespace-nowrap">
                    سوپرمارکت زنجیره‌ای و آرایشی‌بهداشتی
                  </span>
                </div>
              </Link>
            </div>

            {/* Search Bar — desktop only */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <SearchBar />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <NotificationCenter />

              <Link
                href="/messages"
                aria-label={`پیام‌ها و پشتیبانی${messageUnread > 0 ? ` — ${toPersianDigits(messageUnread)} پیام خوانده‌نشده` : ''}`}
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100/90 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hidden sm:flex items-center justify-center hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px]" aria-hidden />
                {messageUnread > 0 ? (
                  <span className="absolute -top-1.5 -end-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-md shadow-rose-500/45 tabular-nums">
                    {messageUnread > 99 ? '+۹۹' : toPersianDigits(messageUnread)}
                  </span>
                ) : null}
              </Link>

              {/*
                Delivery-address button. `onAddressClick` was declared in the props
                interface and threaded down from every page, but never referenced in this
                component — the address flow was unreachable from the header.
              */}
              {onAddressClick ? (
                <button
                  type="button"
                  onClick={onAddressClick}
                  aria-label={
                    activeAddressTitle
                      ? `آدرس تحویل فعلی: ${activeAddressTitle}. برای تغییر بزنید`
                      : 'انتخاب آدرس تحویل'
                  }
                  title={activeAddressTitle ?? 'انتخاب آدرس تحویل'}
                  className="hidden lg:flex items-center gap-1.5 h-10 px-3 rounded-xl bg-slate-100/90 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors text-xs font-semibold cursor-pointer max-w-[190px]"
                >
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">
                    {activeAddressTitle ?? 'انتخاب آدرس'}
                  </span>
                </button>
              ) : null}

              {/* Theme Toggle */}
              <motion.button
                type="button"
                whileHover={hoverScale(1.06)}
                whileTap={hoverScale(0.9)}
                onClick={toggleTheme}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100/90 dark:bg-zinc-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                title={resolvedTheme === 'dark' ? 'تم روشن' : 'تم تاریک'}
                aria-label={resolvedTheme === 'dark' ? 'فعال‌کردن تم روشن' : 'فعال‌کردن تم تاریک'}
              >
                <AnimatePresence mode="wait">
                  {resolvedTheme === 'dark' ? (
                    <motion.span
                      key="sun"
                      initial={{ scale: 0, rotate: -90, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0, rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-4 h-4 text-amber-400" aria-hidden />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="moon"
                      initial={{ scale: 0, rotate: 90, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0, rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-4 h-4 text-indigo-500" aria-hidden />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* User / Login */}
              {isAuthenticated ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 px-3 h-9 sm:h-10 rounded-xl bg-slate-100/90 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors text-xs font-semibold cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden />
                  <span className="hidden sm:inline">{firstName ?? 'پروفایل'}</span>
                </Link>
              ) : (
                <motion.button
                  type="button"
                  whileHover={hoverScale(1.03)}
                  whileTap={hoverScale(0.95)}
                  onClick={onLoginClick}
                  className="flex items-center gap-1.5 px-3 h-9 sm:h-10 rounded-xl bg-slate-100/90 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors text-xs font-semibold cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 shrink-0" aria-hidden />
                  <span>ورود</span>
                </motion.button>
              )}

              {/* Cart */}
              <Link
                href="/cart"
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white flex items-center justify-center hover:from-emerald-500 hover:to-emerald-600 shadow-md shadow-emerald-600/30 dark:shadow-emerald-700/40 active:scale-95 transition-all cursor-pointer"
                aria-label={
                  cartCount > 0 ? `سبد خرید، ${toPersianDigits(cartCount)} کالا` : 'سبد خرید، خالی'
                }
              >
                <ShoppingCart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" aria-hidden />
                <AnimatePresence>
                  {cartCount > 0 ? (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 550, damping: 22 }}
                      className="absolute -top-1.5 -end-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center shadow-md shadow-orange-500/45 select-none tabular-nums"
                      aria-hidden
                    >
                      {cartCount > 99 ? '+۹۹' : toPersianDigits(cartCount)}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </Link>
            </div>
          </div>
        </div>

        {/* Category Subnav */}
        <CategorySubnav
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onSelectCategory={onSelectCategory}
        />
      </header>

      {/* Mobile Category Drawer */}
      <CategoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectCategory={onSelectCategory}
      />
    </>
  );
};

export default Header;
