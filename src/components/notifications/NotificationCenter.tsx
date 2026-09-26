'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCheck, Info, MessageCircle, ShoppingBag, Sparkles, X } from 'lucide-react';
import { useNotificationStore, type NotificationFilter } from '@/stores/useNotificationStore';
import { useShallow } from 'zustand/react/shallow';
import { timeAgoFa, toPersianDigits } from '@/lib/persian';
import type { NotificationType } from '@/types';

const TYPE_META: Record<NotificationType, { label: string; icon: typeof Bell; classes: string }> = {
  order: {
    label: 'سفارش',
    icon: ShoppingBag,
    classes: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  offer: {
    label: 'پیشنهاد',
    icon: Sparkles,
    classes: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  support: {
    label: 'پشتیبانی',
    icon: MessageCircle,
    classes: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  system: {
    label: 'سیستمی',
    icon: Info,
    classes: 'bg-slate-500/10 text-slate-600 dark:text-zinc-300',
  },
};

const TABS: Array<{ id: NotificationFilter; label: string }> = [
  { id: 'all', label: 'همه' },
  { id: 'order', label: 'سفارش‌ها' },
  { id: 'offer', label: 'پیشنهادها' },
  { id: 'support', label: 'پشتیبانی' },
];

export const NotificationCenter: React.FC = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  /*
    Data is selected under `useShallow` and actions are grabbed individually. The previous
    `useNotificationStore()` destructure subscribed the bell to the entire store, so
    ticking one notification as read re-rendered the header, this popover and the
    full `/notifications` page together.
  */
  const { items, unreadCount, loading, filter, setFilter } = useNotificationStore(
    useShallow((s) => ({
      items: s.items,
      unreadCount: s.unreadCount,
      loading: s.loading,
      filter: s.filter,
      setFilter: s.setFilter,
    }))
  );
  const fetch = useNotificationStore((s) => s.fetch);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  useEffect(() => {
    void fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [open ]);

  return (
    <div ref={panelRef} className="relative">
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="مرکز اعلان‌ها"
        aria-expanded={open}
        className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100/90 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
      >
        <Bell className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key={unreadCount}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              className="absolute -top-1.5 -end-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-md shadow-rose-500/45 tabular-nums"
            >
              {unreadCount > 99 ? '+۹۹' : toPersianDigits(unreadCount)}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-label="مرکز اعلان‌ها"
            className="absolute end-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
              <span className="text-sm font-black text-slate-800 dark:text-zinc-100">
                اعلان‌ها
                {unreadCount > 0 && (
                  <span className="ms-1.5 text-[10px] font-bold text-rose-500">
                    ({toPersianDigits(unreadCount)} خوانده‌نشده)
                  </span>
                )}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => void markAllRead()}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="خواندن همه"
                  aria-label="خواندن همه اعلان‌ها"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  aria-label="بستن اعلان‌ها"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 pt-3 overflow-x-auto no-scrollbar">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    filter === tab.id
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                      : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="max-h-[22rem] overflow-y-auto custom-scrollbar p-2">
              {loading && items.length === 0 ? (
                <p className="py-10 text-center text-xs text-slate-400">در حال دریافت اعلان‌ها...</p>
              ) : items.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 dark:text-zinc-400">اعلانی وجود ندارد.</p>
                </div>
              ) : (
                items.slice(0, 8).map((item) => {
                  const meta = TYPE_META[item.type];
                  const Icon = meta.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        void markRead(item.id);
                        setOpen(false);
                      }}
                      className={`w-full flex items-start gap-2.5 p-3 rounded-xl text-right transition-colors cursor-pointer ${
                        item.read
                          ? 'hover:bg-slate-50 dark:hover:bg-zinc-800/60'
                          : 'bg-emerald-500/[0.06] hover:bg-emerald-500/10'
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${meta.classes}`}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800 dark:text-zinc-100 truncate">
                            {item.title}
                          </span>
                          {!item.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                          )}
                        </span>
                        <span className="block text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-2 mt-0.5">
                          {item.message}
                        </span>
                        <span className="block text-[10px] text-slate-400 dark:text-zinc-500 mt-1">
                          {timeAgoFa(item.createdAt)}
                        </span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="block text-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5 py-2.5 border-t border-slate-100 dark:border-zinc-800 transition-colors"
            >
              مشاهده همه اعلان‌ها
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
