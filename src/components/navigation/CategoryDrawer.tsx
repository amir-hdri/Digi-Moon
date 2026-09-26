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
          <motion.button
            type="button"
            tabIndex={-1}
            aria-label="بستن منو"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-default"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={reduceMotion ? false : { x: '100%' }}
            animate={reduceMotion ? undefined : { x: 0 }}
            exit={reduceMotion ? undefined : { x: '100%' }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-[340px] max-w-[85vw] h-full bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col z-10 text-right select-none"
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
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer shrink-0"
                aria-label="بستن منو"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 border-b border-slate-100 dark:border-zinc-800/80">
              {/*
                Logical properties throughout: the previous version mixed `pr-9`/`right-3`
                with `pl-3`, which put the magnifier and the clear button on opposite
                sides of an RTL input.
              */}
              <div className="relative">
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="جستجوی دسته یا کالا..."
                  aria-label="جستجوی دسته‌بندی"
                  className="w-full h-10 ps-9 pe-9 rounded-xl bg-slate-100/80 dark:bg-zinc-800/80 border border-transparent focus:border-emerald-500 text-xs text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-hidden transition-all"
                />
                <Search
                  className="w-4 h-4 text-slate-400 absolute inset-y-0 end-3 my-auto pointer-events-none"
                  aria-hidden
                />
                {filterQuery ? (
                  <button
                    type="button"
                    onClick={() => setFilterQuery('')}
                    aria-label="پاک کردن جستجو"
                    className="absolute inset-y-0 start-2 my-auto h-7 w-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-zinc-700 flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5" />
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
                      className={`w-full flex items-center justify-between p-3 text-xs font-bold transition-colors cursor-pointer ${
                        isExpanded
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-800 dark:text-zinc-200 hover:bg-slate-100/60 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span
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
                          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
                          }`}
                          aria-hidden
                        />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded ? (
                        <motion.div
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
                            className="flex items-center justify-between py-2 px-2 rounded-lg text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition-colors"
                          >
                            <span>مشاهده همه محصولات {cat.title}</span>
                            <ChevronLeft className="w-3.5 h-3.5" aria-hidden />
                          </Link>

                          <div className="space-y-1.5 ps-2">
                            {(cat.children ?? []).map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/category/${sub.slug}`}
                                onClick={onClose}
                                className="block py-1.5 text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold"
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
                className="flex items-center justify-between p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-500/15 transition-colors"
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
                  className="flex items-center gap-1.5 p-2.5 min-h-[40px] rounded-xl bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 hover:border-emerald-300 transition-colors"
                >
                  <Store className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden />
                  <span className="truncate font-medium">شعبات مون مارکت</span>
                </Link>
                <a
                  href="tel:+98910098000"
                  className="flex items-center gap-1.5 p-2.5 min-h-[40px] rounded-xl bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 hover:border-emerald-300 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden />
                  <span className="truncate font-medium" dir="ltr">
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
