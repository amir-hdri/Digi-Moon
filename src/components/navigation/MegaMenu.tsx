'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  moonMarketCategories,
  MoonMarketCategory,
} from '@/data/mock-data';
import { toPersianDigits } from '@/lib/persian';
import {
  ShoppingBag,
  Coffee,
  Sparkles,
  Droplets,
  GlassWater,
  Cookie,
  Utensils,
  ChevronLeft,
  Flame,
  ArrowLeft,
} from 'lucide-react';

export interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
}) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeCategory: MoonMarketCategory = moonMarketCategories[activeCategoryIndex] || moonMarketCategories[0];

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const getCategoryIcon = (iconName: string, className = 'w-5 h-5') => {
    const cls = `${className}`;
    switch (iconName) {
      case 'ShoppingBag':
        return <ShoppingBag className={cls} aria-hidden="true" />;
      case 'Coffee':
        return <Coffee className={cls} aria-hidden="true" />;
      case 'Sparkles':
        return <Sparkles className={cls} aria-hidden="true" />;
      case 'Droplets':
        return <Droplets className={cls} aria-hidden="true" />;
      case 'GlassWater':
        return <GlassWater className={cls} aria-hidden="true" />;
      case 'Cookie':
        return <Cookie className={cls} aria-hidden="true" />;
      case 'Flame':
        return <Flame className={cls} aria-hidden="true" />;
      case 'Utensils':
      default:
        return <Utensils className={cls} aria-hidden="true" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 10, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.99 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute top-full right-0 mt-2 w-[920px] max-w-[calc(100vw-2rem)] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-zinc-800 rounded-3xl shadow-2xl z-50 overflow-hidden text-right select-none"
          role="navigation"
          aria-label="مگامنوی دسته‌بندی کالاهای مون مارکت"
        >
          <div className="flex h-[460px]">
            {/* 1. Right Sidebar: Primary Categories */}
            <div className="w-[280px] shrink-0 border-l border-slate-200/80 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/40 p-3 overflow-y-auto">
              <div className="px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-zinc-500">
                دسته‌بندی‌های سوپرمارکت و بهداشتی
              </div>
              <div className="space-y-1">
                {moonMarketCategories.map((cat, idx) => {
                  const isActive = idx === activeCategoryIndex;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onMouseEnter={() => setActiveCategoryIndex(idx)}
                      onFocus={() => setActiveCategoryIndex(idx)}
                      onClick={() => {
                        setActiveCategoryIndex(idx);
                        onSelectCategory?.(cat.id);
                      }}
                      aria-current={isActive ? 'true' : undefined}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 min-h-[44px] rounded-2xl text-xs font-bold transition-colors cursor-pointer text-right group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-200/60 dark:hover:bg-zinc-800/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                          }`}
                        >
                          {getCategoryIcon(cat.icon, 'w-4 h-4')}
                        </div>
                        <span className="truncate">{cat.title}</span>
                      </div>
                      <ChevronLeft
                        aria-hidden="true"
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive
                            ? 'text-white translate-x-0.5'
                            : 'text-slate-400 opacity-60 group-hover:opacity-100'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Left Content Area: Subcategories & Promos */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
              <div>
                {/* Active Category Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                      {getCategoryIcon(activeCategory.icon, 'w-5 h-5')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-800 dark:text-zinc-100">
                          {activeCategory.title}
                        </h3>
                        {activeCategory.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                            {activeCategory.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                        بیش از {toPersianDigits(activeCategory.productCount)} کالا با ارسال اکسپرس
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/category/${activeCategory.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-1.5 min-h-[44px] text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg px-1"
                  >
                    <span>مشاهده همه محصولات این دسته</span>
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>
                </div>

                {/* Subcategories Grid */}
                <div className="grid grid-cols-2 gap-5 pt-4">
                  {activeCategory.children.map((sub) => (
                    <div key={sub.id} className="space-y-2">
                      <Link
                        href={`/category/${sub.slug}`}
                        onClick={onClose}
                        className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-black text-slate-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg px-1"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                        <span>{sub.title}</span>
                      </Link>

                      {sub.items && sub.items.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pr-3">
                          {sub.items.map((item, idx) => (
                            <Link
                              key={idx}
                              href={`/category/${sub.slug}?q=${encodeURIComponent(item)}`}
                              onClick={onClose}
                              className="min-h-[44px] inline-flex items-center text-[11px] text-slate-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-300 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1"
                            >
                              {item}
                              {idx < sub.items!.length - 1 && (
                                <span className="text-slate-300 dark:text-zinc-700 mr-1.5" aria-hidden="true">|</span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Promotional Strip inside MegaMenu */}
              <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200/80 dark:border-emerald-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm" aria-hidden="true">
                    <Flame className="w-4 h-4 fill-white" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-800 dark:text-zinc-100 block">
                      شگفتانه‌های سوپرمارکت مون مارکت
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400">
                      تخفیف‌های ویژه تا ۴۰٪ روی خواربار، شوینده‌ها و محصولات بهداشتی
                    </span>
                  </div>
                </div>

                <Link
                  href="/#festival-deals"
                  onClick={onClose}
                  className="px-3.5 min-h-[44px] inline-flex items-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-xs shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  مشاهده تخفیف‌ها
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MegaMenu;
