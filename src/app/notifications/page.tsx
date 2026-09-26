'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, Info, MessageCircle, ShoppingBag, Sparkles } from 'lucide-react';
import { CategoryHeader, BottomNavbar } from '@/components';
import { useNotificationStore, type NotificationFilter } from '@/stores/useNotificationStore';
import { useShallow } from 'zustand/react/shallow';
import { timeAgoFa, toPersianDigits } from '@/lib/persian';
import type { NotificationType } from '@/types';
import { useRouter } from 'next/navigation';

const TYPE_META: Record<NotificationType, { icon: typeof Bell; classes: string }> = {
  order: {
    icon: ShoppingBag,
    classes: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  offer: {
    icon: Sparkles,
    classes: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  support: {
    icon: MessageCircle,
    classes: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  system: {
    icon: Info,
    classes: 'bg-slate-500/10 text-slate-600 dark:text-zinc-300',
  },
};

const TABS: Array<{ id: NotificationFilter; label: string }> = [
  { id: 'all', label: 'همه' },
  { id: 'order', label: 'سفارش‌ها' },
  { id: 'offer', label: 'پیشنهادها' },
  { id: 'support', label: 'پشتیبانی' },
  { id: 'system', label: 'سیستمی' },
];

export default function NotificationsPage() {
  const router = useRouter();
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

  return (
    <main className="min-h-screen pb-24 md:pb-12 transition-colors duration-300">
      <CategoryHeader title="اعلان‌ها" onBack={() => router.push('/')} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  filter === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => void markAllRead()}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer shrink-0"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>خواندن همه ({toPersianDigits(unreadCount)})</span>
            </button>
          )}
        </div>

        {loading && items.length === 0 ? (
          <p className="py-16 text-center text-xs text-slate-400">در حال دریافت اعلان‌ها...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-20 p-6 rounded-3xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800">
            <Bell className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700 dark:text-zinc-200 mb-1">
              اعلانی وجود ندارد
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              خبرهای سفارش، پیشنهادها و پیام‌های پشتیبانی اینجا نمایش داده می‌شود.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map((item) => {
              const meta = TYPE_META[item.type];
              const Icon = meta.icon;
              const content = (
                <>
                  <span
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${meta.classes}`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                        {item.title}
                      </span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      )}
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mt-1">
                      {item.message}
                    </span>
                    <span className="block text-[10px] text-slate-400 dark:text-zinc-500 mt-1.5">
                      {timeAgoFa(item.createdAt)}
                    </span>
                  </span>
                </>
              );
              const classes = `w-full flex items-start gap-3 p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                item.read
                  ? 'bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800'
                  : 'bg-emerald-500/[0.05] border-emerald-500/25 dark:border-emerald-500/20'
              }`;
              return item.href ? (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => void markRead(item.id)}
                  className={classes}
                >
                  {content}
                </Link>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => void markRead(item.id)}
                  className={classes}
                >
                  {content}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <BottomNavbar activeTab="profile" />
    </main>
  );
}
