'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { toPersianDigits, normalizePersian } from '@/lib/persian';
import { topLevelCategories, countProductsForNode } from '@/lib/catalog';
import { MoonMarketLogo } from '../ui/MoonMarketLogo';
import { CategoryIcon } from './category-icons';
import { useFocusTrap, useScrollLock } from '@/hooks/useFocusTrap';
import { X, ChevronDown, Search, Flame, Store, Phone, ChevronLeft } from 'lucide-react';

export interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const CategoryDrawer: React.FC<CategoryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
}) => {
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const handleClose = useCallback(() => onClose(), [onClose]);

  useFocusTrap(panelRef, isOpen, handleClose);
  useScrollLock(isOpen);

  const toggleCategory = (id: string) => {
    setExpandedCategoryId((prev) => (prev === id ? null : id));
  };

  /*
    Persian-aware filtering, replacing a `toLowerCase().includes()` comparison that
    could not match «آب» against «اب» or a Persian ي against ی. `normalizePersian` maps the
    common orthographic variants on both sides.
  */
  const filteredCategories = useMemo(() => {
    const q = normalizePersian(filterQuery);
    if (!q) return topLevelCategories;
    return topLevelCategories.filter(
      (cat) =>
        normalizePersian(cat.title).includes(q) ||
        (cat.children ?? []).some((child) => normalizePersian(child.title).includes(q))
    );
  }, [filterQuery]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="منوی دسته‌بندی و ناوبری مون مارکت"
        >
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            id="category-drawer"
            tabIndex={-1}
            initial={reduceMotion ? false : { x: '100%' }}
            animate={reduceMotion ? undefined : { x: 0 }}
            exit={reduceMotion ? undefined : { x: '100%' }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', damping: 28, stiffness: 300 }}
            drag={reduceMotion ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x > 90) onClose();
            }}
            className="relative w-[340px] max-w-[90vw] h-full bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col z-10 text-right select-none touch-pan-y"
          >
            <div className="p-4 border-b border-slate-200/80 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MoonMarketLogo size="sm" glow={false} />
                <div>
                  <h2 className="text-sm font-black gradient-text">دسته‌بندی‌های مون مارکت</h2>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                    سوپرمارکت زنجیره‌ای آنلاین
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                aria-label="بستن منوی دسته‌بندی"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="p-3 border-b border-slate-100 dark:border-zinc-800/80">
              {/*
                Logical properties throughout: the previous version mixed `pr-9`/`right-3`
                with `pl-3`, which put the magnifier and the clear button on opposite
                sides of an RTL input.
              */}
              <div className="relative">
                <label htmlFor="drawer-category-search" className="sr-only">جستجوی دسته‌بندی</label>
                <input
                  id="drawer-category-search"
                  type="search"
                  autoComplete="off"
                  inputMode="search"
                  spellCheck={false}
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="جستجوی دسته یا کالا…"
                  aria-label="جستجوی دسته‌بندی"
                  className="w-full h-11 ps-9 pe-12 rounded-xl bg-slate-100/80 dark:bg-zinc-800/80 border border-transparent focus:border-emerald-500 text-sm text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
                />
                <Search
                  className="w-4 h-4 text-slate-400 absolute inset-y-0 end-3.5 my-auto pointer-events-none"
                  aria-hidden="true"
                />
                {filterQuery ? (
                  <button
                    type="button"
                    onClick={() => setFilterQuery('')}
                    aria-label="پاک کردن جستجو"
                    className="absolute inset-y-0 start-1.5 my-auto min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 dark:text-zinc-500">
                همه دپارتمان‌های کالا ({toPersianDigits(filteredCategories.length)})
              </div>

              {filteredCategories.length === 0 ? (
                <p className="px-3 py-8 text-center text-xs text-slate-500 dark:text-zinc-400">
                  دسته‌ای با عبارت «{filterQuery.trim()}» پیدا نشد.
                </p>
              ) : null}

              {filteredCategories.map((cat) => {
                const isExpanded = expandedCategoryId === cat.id;
                const count = countProductsForNode(cat);

                return (
                  <div
                    key={cat.id}
                    className="rounded-2xl border border-slate-200/70 dark:border-zinc-800 overflow-hidden bg-slate-50/40 dark:bg-zinc-950/20"
                  >
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`drawer-cat-${cat.id}`}
                      className={`w-full min-h-[44px] flex items-center justify-between p-3 text-xs font-bold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 ${
                        isExpanded
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-800 dark:text-zinc-200 hover:bg-slate-100/60 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span
                          aria-hidden="true"
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isExpanded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                          }`}
                        >
                          <CategoryIcon iconName={cat.icon} className="w-3.5 h-3.5" />
                        </span>
                        <span className="truncate">{cat.title}</span>
                        <span className="text-[9px] text-slate-400 dark:text-zinc-500 shrink-0">
                          {toPersianDigits(count)}
                        </span>
                      </span>

                      <span className="flex items-center gap-1.5 shrink-0">
                        {cat.badge ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                            {cat.badge}
                          </span>
                        ) : null}
                        <ChevronDown
                          aria-hidden="true"
                          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
                          }`}
                        />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded ? (
                        <motion.div
                          id={`drawer-cat-${cat.id}`}
                          initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                          animate={reduceMotion ? undefined : { height: 'auto', opacity: 1 }}
                          exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-slate-100 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 px-3 py-2 space-y-2 text-xs"
                        >
                          <Link
                            href={`/category/${cat.slug}`}
                            onClick={() => {
                              onSelectCategory?.(cat.id);
                              onClose();
                            }}
                            className="flex items-center justify-between min-h-[44px] py-2 px-2 rounded-lg text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                          >
                            <span>مشاهده همه محصولات {cat.title}</span>
                            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                          </Link>

                          <div className="space-y-1 ps-2">
                            {(cat.children ?? []).map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/category/${sub.slug}`}
                                onClick={onClose}
                                className="block min-h-[44px] flex items-center py-2 text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg px-1"
                              >
                                {sub.title}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="p-3 border-t border-slate-200/80 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-950/40 space-y-1.5 text-xs">
              <Link
                href="/#festival-deals"
                onClick={onClose}
                className="flex items-center justify-between min-h-[44px] p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-500/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                <span className="flex items-center gap-2">
                  <Flame className="w-4 h-4 fill-rose-500 text-rose-500" aria-hidden />
                  <span>پیشنهادهای شگفت‌انگیز</span>
                </span>
                <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full">
                  تا ۴۰٪
                </span>
              </Link>

              {/*
                These two were plain <div>s styled identically to the links around them,
                so they read as tappable but did nothing. Both are real destinations now.
              */}
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-slate-600 dark:text-zinc-400">
                <Link
                  href="/branches"
                  onClick={onClose}
                  className="flex items-center gap-1.5 p-2.5 min-h-[44px] rounded-xl bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 hover:border-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <Store className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                  <span className="truncate font-medium">شعبات مون مارکت</span>
                </Link>
                <a
                  href="tel:+98910098000"
                  aria-label="تماس با پشتیبانی مون مارکت: ۰۹۱۰ ۰۹۸ ۰۰۰"
                  className="flex items-center gap-1.5 p-2.5 min-h-[44px] rounded-xl bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 hover:border-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                  <span className="truncate font-medium" dir="ltr" aria-hidden="true">
                    ۹۱۰۰۹۸۰۰۰
                  </span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

export default CategoryDrawer;
