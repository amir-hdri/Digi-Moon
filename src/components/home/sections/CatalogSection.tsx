'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { SlidersHorizontal, ShoppingBag, RotateCcw, SearchX } from 'lucide-react';
import { ProductCard } from '@/components/catalog/ProductCard';
import { toPersianDigits } from '@/lib/persian';
import { SORT_OPTIONS, resolveCategory, type SortKey } from '@/lib/catalog';
import type { Product } from '@/types';

/** Why the result set is empty — drives the copy and which "clear" button we offer. */
function diagnoseEmpty({
  query,
  categoryId,
  brand,
}: {
  query: string;
  categoryId: string | null;
  brand: string | null;
}): { title: string; body: string; canClearAll: boolean } {
  const node = resolveCategory(categoryId);

  if (query.trim()) {
    return {
      title: `نتیجه‌ای برای «${query.trim()}» پیدا نشد`,
      body: 'املای عبارت را بررسی کنید یا کلمه کلی‌تری امتحان کنید؛ جستجو روی نام، توضیح، مشخصات و برند کالا انجام می‌شود.',
      canClearAll: true,
    };
  }
  if (node && brand) {
    return {
      title: `برند انتخابی در «${node.title}» کالایی ندارد`,
      body: 'فیلتر برند را بردارید یا دسته‌بندی دیگری را انتخاب کنید.',
      canClearAll: true,
    };
  }
  if (node) {
    return {
      title: `در «${node.title}» کالایی موجود نیست`,
      body: 'این دسته‌بندی به‌زودی تکمیل می‌شود. می‌توانید سایر دسته‌ها را ببینید.',
      canClearAll: true,
    };
  }
  return {
    title: 'محصولی با این مشخصات یافت نشد',
    body: 'فیلترهای برند و دسته‌بندی را پاک کنید.',
    canClearAll: Boolean(brand),
  };
}

export function CatalogSection({
  products,
  query,
  categoryId,
  brand,
  sort,
  onSort,
  onClearAll,
  onClearBrand,
  onClearCategory,
  onAddToCart,
}: {
  products: Product[];
  query: string;
  categoryId: string | null;
  brand: string | null;
  sort: SortKey;
  onSort: (sort: SortKey) => void;
  onClearAll: () => void;
  onClearBrand: () => void;
  onClearCategory: () => void;
  onAddToCart: (product: Product) => void;
}) {
  const reduceMotion = useReducedMotion();
  const node = resolveCategory(categoryId);
  const empty = products.length === 0 ? diagnoseEmpty({ query, categoryId, brand }) : null;

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 25 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      aria-labelledby="catalog-heading"
      className="space-y-5"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2
              id="catalog-heading"
              className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-zinc-100"
            >
              {node ? `محصولات ${node.title}` : 'همه کالاهای سوپرمارکت'}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              نمایش {toPersianDigits(products.length)} کالا با قیمت روز و ارسال سریع
              {brand ? ` • برند: ${brand}` : ''}
            </p>
          </div>
        </div>

        {/*
          `aria-pressed` + a real `radiogroup` semantics: the sliding-pill tabs were
          plain buttons with no selected state exposed to assistive tech.
        */}
        <div
          role="tablist"
          aria-label="ترتیب نمایش کالاها"
          className="relative flex items-center liquid-glass p-1 rounded-2xl text-xs font-semibold overflow-x-auto w-full sm:w-auto shadow-xs no-scrollbar"
        >
          {SORT_OPTIONS.map((option) => {
            const isActive = sort === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSort(option.id)}
                className={`relative z-10 px-3.5 py-2 min-h-[36px] rounded-xl transition-colors shrink-0 ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
                }`}
              >
                {isActive ? (
                  <motion.span
                    layoutId="sort-pill-indicator"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    aria-hidden
                    className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-xl shadow-sm -z-10 border border-slate-200/60 dark:border-zinc-700/60"
                  />
                ) : null}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {empty ? (
        <div
          role="status"
          className="text-center py-14 px-6 rounded-3xl liquid-glass border border-slate-200/80 dark:border-zinc-800 flex flex-col items-center justify-center gap-4 shadow-sm"
        >
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-md shadow-emerald-500/10">
            {query.trim() ? (
              <SearchX className="w-9 h-9" />
            ) : (
              <ShoppingBag className="w-9 h-9" />
            )}
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-base font-bold text-slate-800 dark:text-zinc-100">{empty.title}</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{empty.body}</p>
          </div>

          {/* Offer the narrowest reset that actually helps, not only "clear everything". */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {brand ? (
              <button
                type="button"
                onClick={onClearBrand}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
              >
                حذف فیلتر برند
              </button>
            ) : null}
            {node ? (
              <button
                type="button"
                onClick={onClearCategory}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
              >
                حذف فیلتر دسته‌بندی
              </button>
            ) : null}
            {empty.canClearAll ? (
              <button
                type="button"
                onClick={onClearAll}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-500 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>پاک کردن همه فیلترها</span>
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </motion.section>
  );
}
