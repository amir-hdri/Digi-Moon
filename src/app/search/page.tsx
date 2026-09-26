'use client';

import React, { useCallback, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CategoryHeader, BottomNavbar, ProductCard } from '@/components';
import { useCartStore } from '@/stores/useCartStore';
import { toPersianDigits } from '@/lib/persian';
import { searchCatalog, SORT_OPTIONS, type SortKey } from '@/lib/catalog';
import { SearchX, SlidersHorizontal, ArrowRight, Lightbulb } from 'lucide-react';

/** Shown when a query returns nothing — real catalog terms, so the chips actually help. */
const SUGGESTIONS = ['شیر', 'روغن زیتون', 'شامپو', 'چای', 'پنیر', 'مایع ظرفشویی'];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const addItem = useCartStore((state) => state.addItem);
  const [sort, setSort] = useState<SortKey>('popular');

  /*
    Replaces `searchAllStoreProducts()`, a fourth copy of the matching rules that used
    plain `toLowerCase().includes()` — it could not match Persian orthographic variants
    («آب» vs «اب», «ي» vs «ی», ZWNJ) and threw on products whose `categoryTitle` is null.
    `searchCatalog` normalises both sides of the comparison first.
  */
  const products = useMemo(() => searchCatalog(query, sort), [query, sort]);

  const handleAdd = useCallback(
    (product: Parameters<typeof addItem>[0]) => addItem(product, 1),
    [addItem]
  );

  return (
    <main className="min-h-screen pb-24 md:pb-12 transition-colors duration-300">
      <CategoryHeader title="جستجو در کالاها" backHref="/" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        <div className="p-6 rounded-3xl liquid-glass border border-slate-200/80 dark:border-zinc-800">
          <h1 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-zinc-100">
            {query.trim() ? (
              <>
                نتایج جستجو برای{' '}
                <span className="text-emerald-600 dark:text-emerald-400">«{query.trim()}»</span>
              </>
            ) : (
              'چه چیزی می‌خواهید بخرید؟'
            )}
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            {query.trim()
              ? `${toPersianDigits(products.length)} کالا یافت شد`
              : 'عبارتی بنویسید تا کالاهای مرتبط را ببینید.'}
          </p>
        </div>

        {query.trim() ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                مرتب‌سازی بر اساس:
              </span>
            </div>

            <div
              role="tablist"
              aria-label="ترتیب نمایش نتایج"
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
        ) : null}

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAdd} />
            ))}
          </div>
        ) : (
          <div
            role="status"
            className="text-center py-16 p-6 rounded-3xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800"
          >
            <SearchX className="w-12 h-12 text-slate-400 dark:text-zinc-500 mx-auto mb-3" />
            <h2 className="text-base font-bold text-slate-700 dark:text-zinc-200 mb-1">
              {query.trim() ? `نتیجه‌ای برای «${query.trim()}» یافت نشد` : 'جستجویی انجام نشده است'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-5">
              کلمات کلیدی دیگری را امتحان کنید یا از پیشنهادهای زیر استفاده کنید.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              {SUGGESTIONS.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="px-3.5 py-2 min-h-[40px] inline-flex items-center rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold hover:border-emerald-300 transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 dark:text-zinc-500 flex items-center justify-center gap-1.5 mb-4">
              <Lightbulb className="w-3.5 h-3.5" />
              جستجو روی نام کالا، توضیحات، مشخصات فنی و نام برند انجام می‌شود.
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به فروشگاه</span>
            </Link>
          </div>
        )}
      </div>

      <BottomNavbar activeTab="home" />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center text-sm text-slate-500">
          در حال جستجو…
        </main>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
