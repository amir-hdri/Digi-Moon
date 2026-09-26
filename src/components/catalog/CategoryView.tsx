'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { CategoryHeader, BottomNavbar, ProductCard } from '@/components';
import { useCartStore } from '@/stores/useCartStore';
import { toPersianDigits } from '@/lib/persian';
import { CategoryIcon } from '@/components/navigation/category-icons';
import {
  SORT_OPTIONS,
  filterCatalog,
  resolveCategory,
  type CategoryNode,
  type SortKey,
} from '@/lib/catalog';
import { PackageX, ChevronLeft, X } from 'lucide-react';

/**
 * Client view for a resolved category.
 *
 * The route (`src/app/category/[slug]/page.tsx`) is a Server Component: it resolves the
 * taxonomy, throws `notFound()` for unknown slugs so the HTTP status is a real 404, and
 * reads the `?q=` term from page props. That means the grid below is server-rendered on
 * first paint; only the sort tabs are client state.
 */
export function CategoryView({ node, initialTerm }: { node: CategoryNode; initialTerm: string }) {
  const reduceMotion = useReducedMotion();
  const addItem = useCartStore((state) => state.addItem);
  const [sort, setSort] = useState<SortKey>('popular');
  // The drawer's per-item deep links point at `/category/<sub>?q=<term>`; nothing used to
  // read `q`, so those chips navigated here and silently dropped the term.
  const term = initialTerm;

  const products = useMemo(
    () => filterCatalog({ categoryId: node.id, query: term, sort }),
    [node.id, sort, term]
  );

  const siblings = useMemo(() => {
    if (!node.isParent && node.parentId) {
      return resolveCategory(node.parentId)?.children ?? [];
    }
    return node.children ?? [];
  }, [node]);

  const handleAdd = useCallback(
    (product: Parameters<typeof addItem>[0], quantity = 1) => addItem(product, quantity),
    [addItem]
  );

  return (
    <main className="min-h-screen pb-24 md:pb-12 transition-colors duration-300">
      <CategoryHeader title={node.title} backHref="/" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* Breadcrumb: parent category → this subcategory */}
        {!node.isParent && node.parentSlug ? (
          <nav aria-label="مسیر دسته‌بندی" className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400">
            <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              فروشگاه
            </Link>
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden />
            <Link
              href={`/category/${node.parentSlug}`}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {resolveCategory(node.parentId)?.title}
            </Link>
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden />
            <span aria-current="page" className="font-bold text-slate-700 dark:text-zinc-200">
              {node.title}
            </span>
          </nav>
        ) : null}

        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center shrink-0">
              <CategoryIcon iconName={node.icon} className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 min-w-0">
              <h1 className="text-xl sm:text-3xl font-black">{node.title}</h1>
              <p className="text-emerald-100 text-xs sm:text-sm">
                مجموعه کامل و به‌روز از برترین محصولات با تضمین سلامت و اصالت فیزیکی کالا
              </p>
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
                {toPersianDigits(products.length)} کالا موجود است
              </span>
            </div>
          </div>
        </div>

        {/* Active term from a `/search?q=` or drawer deep link, with a way to drop it. */}
        {term.trim() ? (
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25">
            <span className="text-xs text-emerald-700 dark:text-emerald-300">
              فیلتر عبارت: <span className="font-black">«{term.trim()}»</span>
            </span>
            <Link
              href={`/category/${node.slug}`}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15 transition-colors"
            >
              <X className="w-3.5 h-3.5" aria-hidden />
              حذف فیلتر
            </Link>
          </div>
        ) : null}

        {/* Subcategory chips — the old page navigated to subcategory URLs that then
            silently showed the parent category, so this row had no equivalent. */}
        {siblings.length > 0 ? (
          <nav aria-label="زیر‌دسته‌ها" className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {siblings.map((child) => {
              const isCurrent = child.id === node.id;
              return (
                <Link
                  key={child.id}
                  href={`/category/${child.slug}`}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`px-4 py-2 min-h-[40px] inline-flex items-center rounded-xl text-xs font-bold border shrink-0 transition-colors ${
                    isCurrent
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-200/80 dark:border-zinc-800 hover:border-emerald-300'
                  }`}
                >
                  {child.title}
                </Link>
              );
            })}
          </nav>
        ) : null}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-zinc-800">
          <span className="text-sm font-bold text-slate-800 dark:text-zinc-100">
            مرتب‌سازی بر اساس:
          </span>

          <div
            role="tablist"
            aria-label="ترتیب نمایش کالاها"
            className="flex items-center gap-1 liquid-glass bg-slate-100/80 dark:bg-zinc-800/80 p-1 rounded-xl text-xs font-semibold overflow-x-auto w-full sm:w-auto no-scrollbar"
          >
            {SORT_OPTIONS.map((option) => {
              const isActive = sort === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSort(option.id)}
                  className={`px-3.5 py-2 min-h-[36px] rounded-lg transition-colors shrink-0 ${
                    isActive
                      ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(prod) => handleAdd(prod, 1)}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            role="status"
            className="text-center py-20 p-6 rounded-3xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800"
          >
            <PackageX className="w-12 h-12 text-slate-400 dark:text-zinc-500 mx-auto mb-3" />
            <h2 className="text-base font-bold text-slate-700 dark:text-zinc-200 mb-1">
              کالایی در «{node.title}» موجود نیست
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
              به‌زودی محصولات جدید به این بخش اضافه می‌شوند.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {siblings.length > 0 ? (
                <Link
                  href={`/category/${node.parentSlug ?? siblings[0].slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors"
                >
                  دیدن همه کالاهای این دسته
                </Link>
              ) : null}
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 transition-colors"
              >
                بازگشت به فروشگاه
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      <BottomNavbar activeTab="categories" />
    </main>
  );
}
