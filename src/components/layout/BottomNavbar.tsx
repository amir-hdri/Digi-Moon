'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/stores/useCartStore';
import { toPersianDigits } from '@/lib/persian';
import { Home, Grid, ShoppingBag, User } from 'lucide-react';

export type BottomNavTab = 'home' | 'categories' | 'cart' | 'profile';

export interface BottomNavbarProps {
  activeTab?: BottomNavTab;
  onTabChange?: (tab: BottomNavTab) => void;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({
  activeTab: controlledActiveTab,
  onTabChange,
}) => {
  const pathname = usePathname();
  const cartCount = useCartStore((state) => state.getItemCount());

  const getActiveTab = (): BottomNavTab => {
    if (controlledActiveTab) return controlledActiveTab;
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/category') || pathname.startsWith('/categories')) return 'categories';
    if (pathname.startsWith('/cart')) return 'cart';
    if (pathname.startsWith('/profile')) return 'profile';
    return 'home';
  };

  const currentTab = getActiveTab();

  const tabs = [
    { id: 'home'       as BottomNavTab, label: 'خانه',      href: '/',                    icon: Home },
    { id: 'categories' as BottomNavTab, label: 'دسته‌ها',    href: '/category/groceries',  icon: Grid },
    { id: 'cart'       as BottomNavTab, label: 'سبد خرید',  href: '/cart',                icon: ShoppingBag, badge: cartCount },
    { id: 'profile'    as BottomNavTab, label: 'پروفایل',   href: '/profile',             icon: User },
  ];

  return (
    <nav
      id="bottom-navbar"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-slate-200/70 dark:border-zinc-800/80 shadow-[0_-4px_30px_rgba(0,0,0,0.08)] transition-colors duration-300"
      style={{
        background: 'var(--surface-overlay)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-stretch justify-around max-w-md mx-auto px-1 py-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={() => onTabChange?.(tab.id)}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer"
            >
              {/* Active pill background */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-bg"
                  transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                  className="absolute inset-x-1 inset-y-0.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15"
                />
              )}

              {/* Icon + Badge */}
              <div className="relative z-10">
                <motion.div
                  animate={isActive ? { scale: 1.1, y: -1 } : { scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 26 }}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive
                        ? 'text-emerald-600 dark:text-emerald-400 stroke-[2.5]'
                        : 'text-slate-500 dark:text-zinc-400 stroke-2'
                    }`}
                  />
                </motion.div>

                {/* Cart badge */}
                <AnimatePresence>
                  {Boolean(tab.badge && tab.badge > 0) && (
                    <motion.span
                      key={tab.badge}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 600, damping: 22 }}
                      className="absolute -top-1.5 -end-2 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-orange-500 text-[9px] font-black text-white shadow shadow-orange-500/50 tabular-nums"
                    >
                      {toPersianDigits(tab.badge!)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Label */}
              <motion.span
                animate={isActive ? { opacity: 1 } : { opacity: 0.65 }}
                className={`text-[10px] font-semibold leading-none z-10 transition-colors duration-200 ${
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-500 dark:text-zinc-400'
                }`}
              >
                {tab.label}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavbar;
