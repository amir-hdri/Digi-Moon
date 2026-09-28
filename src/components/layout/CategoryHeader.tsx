'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/stores/useCartStore';
import { toPersianDigits } from '@/lib/persian';
import { ArrowRight, ShoppingBag, Search } from 'lucide-react';

export interface CategoryHeaderProps {
  title?: string;
  /** Imperative back handler. Must NOT be passed from a Server Component — use `backHref` instead. */
  onBack?: () => void;
  /**
   * Declarative back target so Server Components can render this header without
   * serialising an event handler across the RSC boundary. Falls back to
   * `router.back()` when omitted, and takes precedence over `onBack` when both are given.
   */
  backHref?: string;
  cartCount?: number;
  onCartClick?: () => void;
  onSearchClick?: () => void;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  title = 'دسته‌بندی‌ها',
  onBack,
  backHref = '/',
  cartCount: controlledCartCount,
  onCartClick,
  onSearchClick,
}) => {
  const router = useRouter();
  const storeCartCount = useCartStore((state) => state.getItemCount());
  const cartCount = controlledCartCount !== undefined ? controlledCartCount : storeCartCount;

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    // Guard against a no-op back when there is no history to return to.
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(backHref);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-effect bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md shadow-sm border-b border-slate-200/80 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Back Button & Title */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleBack}
            className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="بازگشت"
          >
            <ArrowRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          </button>
          <h1 className="text-lg font-black gradient-text tracking-tight text-balance">
            {title}
          </h1>
        </div>

        {/* Action Controls: Search + Cart */}
        <div className="flex items-center gap-2">
          {onSearchClick && (
            <button
              type="button"
              onClick={onSearchClick}
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="جستجو"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
            </button>
          )}

          {onCartClick ? (
            <button
              type="button"
              onClick={onCartClick}
              className="relative min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white flex items-center justify-center shadow-sm active:scale-95 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label={cartCount > 0 ? `سبد خرید، ${toPersianDigits(cartCount)} کالا` : 'سبد خرید، خالی'}
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              {cartCount > 0 && (
                <span aria-hidden="true" className="absolute -top-1.5 -end-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow-sm tabular-nums">
                  {toPersianDigits(cartCount)}
                </span>
              )}
            </button>
          ) : (
            <Link
              href="/cart"
              className="relative min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white flex items-center justify-center shadow-sm active:scale-95 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label={cartCount > 0 ? `سبد خرید، ${toPersianDigits(cartCount)} کالا` : 'سبد خرید، خالی'}
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              {cartCount > 0 && (
                <span aria-hidden="true" className="absolute -top-1.5 -end-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow-sm tabular-nums">
                  {toPersianDigits(cartCount)}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
export default CategoryHeader;
