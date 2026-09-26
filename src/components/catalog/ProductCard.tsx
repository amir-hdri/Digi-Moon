'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Product } from '@/types';
import { formatToman, toPersianDigits } from '@/lib/persian';
import { getFileUrl } from '@/lib/api';
import { PRODUCT_PLACEHOLDER } from '@/lib/product-images';
import { discountOf } from '@/lib/catalog';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToastStore } from '@/stores/useToastStore';
import {
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Star,
  Check,
  Zap,
  PackageX,
} from 'lucide-react';

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onClick?: (product: Product) => void;
  isPriority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onClick,
  isPriority = false,
}) => {
  const reduceMotion = useReducedMotion();

  /*
    Narrow selectors, not `useCartStore()` destructuring. The old version pulled the whole
    store into every card, so one `updateQuantity` re-rendered all 30+ product cards on
    the page. `selectQuantityFor` returns a primitive, so only the card whose quantity
    actually changed re-renders.
  */
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const cartQty = useCartStore((state) =>
    state.items.reduce(
      (sum, item) =>
        String(item.product.id) === String(product.id) ? sum + item.quantity : sum,
      0
    )
  );

  const toggleFavorite = useAuthStore((state) => state.toggleFavorite);
  const isFavorite = useAuthStore((state) =>
    (state.user?.favoriteProductIds ?? []).some((id) => String(id) === String(product.id))
  );

  const [justAdded, setJustAdded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The 1.4 s "added" flash used to setState after unmount on fast filter changes.
  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    },
    []
  );

  // On a load error we swap in the inline placeholder rather than the old
  // `opacity: 0.65`, which just left a faded broken-image glyph on screen.
  const candidateUrl = product.imageUrl || getFileUrl(product.fileId) || '';
  const imageUrl = imageFailed || !candidateUrl ? PRODUCT_PLACEHOLDER : candidateUrl;

  const discount = discountOf(product);
  const outOfStock = !product.inStock;
  const lowStock = product.inStock && typeof product.stockCount === 'number' && product.stockCount <= 5;
  const atStockLimit = typeof product.stockCount === 'number' && cartQty >= product.stockCount;

  const handleAddFirst = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (outOfStock) {
        useToastStore.getState().show({
          title: 'کالا موجود نیست',
          message: `«${product.title}» در حال حاضر موجود نیست.`,
          type: 'error',
        });
        return;
      }
      if (onAddToCart) onAddToCart(product);
      else addItem(product, 1);

      useToastStore.getState().show({
        title: 'افزوده شد به سبد خرید',
        message: `«${product.title}» به سبد خرید شما اضافه شد.`,
        type: 'success',
      });

      setJustAdded(true);
      if (addedTimer.current) clearTimeout(addedTimer.current);
      addedTimer.current = setTimeout(() => setJustAdded(false), 1400);
    },
    [addItem, onAddToCart, outOfStock, product]
  );

  const handleIncrement = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      updateQuantity(product.id, cartQty + 1);
    },
    [cartQty, product.id, updateQuantity]
  );

  const handleDecrement = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (cartQty <= 1) removeItem(product.id);
      else updateQuantity(product.id, cartQty - 1);
    },
    [cartQty, product.id, removeItem, updateQuantity]
  );

  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(product.id);
    },
    [product.id, toggleFavorite]
  );

  const handleCardClick = useCallback(() => onClick?.(product), [onClick, product]);
  const detailHref = `/product/${product.slug}`;

  const hoverScale = (value: number) => (reduceMotion ? undefined : { scale: value });

  return (
    <motion.article
      onClick={handleCardClick}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '24px' }}
      whileTap={hoverScale(0.985)}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={`product-card cq-product group relative flex flex-col rounded-2xl sm:rounded-3xl bg-white/96 dark:bg-zinc-900/96 backdrop-blur-sm border shadow-sm overflow-hidden w-full shrink-0 ${
        outOfStock
          ? 'border-slate-200/70 dark:border-zinc-800/80 opacity-75'
          : 'border-slate-200/70 dark:border-zinc-800/80'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/45 to-transparent dark:from-white/[0.04] pointer-events-none rounded-t-2xl sm:rounded-t-3xl z-0" aria-hidden />

      {cartQty > 0 ? (
        <div
          className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-2 ring-emerald-500/40 dark:ring-emerald-500/30 pointer-events-none z-10"
          aria-hidden
        />
      ) : null}

      <div className="p-2.5 sm:p-4 text-center flex-1 flex flex-col relative z-10">
        <div
          className="relative mb-2.5 sm:mb-3 flex justify-center items-center rounded-xl sm:rounded-2xl overflow-hidden"
          style={{ height: 'clamp(108px, 22cqw, 180px)', minHeight: '108px' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 to-slate-100/60 dark:from-zinc-800/40 dark:to-zinc-800/80" aria-hidden />

          {/*
            The image and title are a real <Link> to the product page. They used to sit in
            a <div onClick={...}> whose handler was `onClick?.(product)` — and no caller
            anywhere in the app passes `onClick`, so every card rendered `cursor-pointer`
            and navigated nowhere. A real anchor also restores keyboard and
            screen-reader access, which the div never had.
          */}
          <Link
            href={detailHref}
            tabIndex={-1}
            aria-hidden
            className="absolute inset-0 z-10"
            onClick={(e) => e.stopPropagation()}
          />

          <Image
            src={imageUrl}
            alt={product.title}
            fill
            priority={isPriority}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 240px"
            unoptimized={imageUrl.startsWith('data:')}
            onError={() => setImageFailed(true)}
            className={`product-img object-contain p-2 sm:p-3 drop-shadow-sm ${
              outOfStock ? 'grayscale' : ''
            }`}
            style={{ transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)' }}
          />

          <div className="absolute top-1.5 sm:top-2 inset-x-1.5 sm:inset-x-2 z-20 flex justify-between items-start pointer-events-none">
            {discount > 0 ? (
              <span className="inline-flex items-center gap-0.5 rounded-lg bg-red-500 px-1.5 py-0.5 text-[10px] sm:text-xs font-black text-white shadow-sm shadow-red-500/40 leading-none">
                ٪{toPersianDigits(discount)}
              </span>
            ) : (
              <span />
            )}

            {product.isSpecial ? (
              <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black text-white shadow-sm shadow-amber-500/40 leading-none">
                <Zap className="w-2.5 h-2.5 fill-white" />
                <span>شگفت‌انگیز</span>
              </span>
            ) : null}
          </div>

          {/* Out-of-stock scrim — the card was previously fully interactive while
              `inStock: false`, and let shoppers add unavailable items to the cart. */}
          {outOfStock ? (
            <div className="absolute inset-0 z-20 bg-white/55 dark:bg-zinc-950/55 backdrop-blur-[1px] flex items-center justify-center">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/85 dark:bg-zinc-100/90 text-white dark:text-zinc-900 text-[10px] font-black">
                <PackageX className="w-3 h-3" />
                ناموجود
              </span>
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
            className="absolute bottom-1.5 sm:bottom-2 start-1.5 sm:start-2 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/92 dark:bg-zinc-900/92 backdrop-blur-sm text-slate-400 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 shadow-sm transition-colors cursor-pointer flex items-center justify-center"
          >
            <Heart
              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all duration-200 ${
                isFavorite ? 'fill-red-500 text-red-500 scale-110' : ''
              }`}
            />
          </button>
        </div>

        <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-100 line-clamp-2 mb-1.5 sm:mb-2 text-right leading-snug sm:leading-relaxed group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200"
          style={{ minHeight: 'calc(2 * 1.4em)' }}
        >
          <Link href={detailHref} className="focus-visible:outline-none">
            {product.title}
          </Link>
        </h3>

        {product.rating ? (
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-amber-500 font-bold justify-start mb-1.5">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" aria-hidden />
            <span>{toPersianDigits(product.rating)}</span>
            {product.reviewsCount ? (
              <span className="text-slate-400 dark:text-zinc-500 font-normal text-[10px]">
                ({toPersianDigits(product.reviewsCount)})
              </span>
            ) : null}
          </div>
        ) : null}

        {lowStock ? (
          <p className="text-[10px] text-rose-500 dark:text-rose-400 font-bold mb-1">
            تنها {toPersianDigits(product.stockCount ?? 0)} عدد باقی مانده
          </p>
        ) : null}

        <div className="mt-auto pt-1 flex flex-col items-center justify-center">
          {product.oldPrice && product.oldPrice > product.price ? (
            <span className="text-[10px] sm:text-xs text-slate-400 dark:text-zinc-500 line-through mb-0.5">
              {formatToman(product.oldPrice, false)}
            </span>
          ) : null}
          <div className="flex items-baseline gap-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm sm:text-base md:text-lg">
              {formatToman(product.price, false)}
            </span>
            <span className="text-[9px] sm:text-[11px] font-normal text-slate-500 dark:text-zinc-400">
              تومان
            </span>
          </div>
        </div>
      </div>

      <div className="px-2.5 pb-2.5 sm:px-4 sm:pb-4">
        <AnimatePresence mode="wait" initial={false}>
          {outOfStock ? (
            <div
              key="oos"
              className="w-full h-9 sm:h-10 md:h-11 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 text-[11px] sm:text-xs font-bold flex items-center justify-center"
            >
              ناموجود
            </div>
          ) : cartQty > 0 ? (
            <motion.div
              key="stepper"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 4 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.92, y: 4 }}
              transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 }}
              className="flex items-center justify-between h-9 sm:h-10 md:h-11 w-full rounded-xl sm:rounded-2xl bg-emerald-500/12 dark:bg-emerald-950/55 border border-emerald-500/35 p-1"
            >
              <button
                type="button"
                onClick={handleIncrement}
                disabled={atStockLimit}
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shadow-emerald-600/30 cursor-pointer hover:bg-emerald-500 active:scale-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label={atStockLimit ? 'به سقف موجودی رسیده‌اید' : 'افزایش تعداد'}
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} aria-hidden />
              </button>

              <div className="flex flex-col items-center px-1">
                <motion.span
                  key={cartQty}
                  initial={reduceMotion ? false : { y: -5, opacity: 0 }}
                  animate={reduceMotion ? undefined : { y: 0, opacity: 1 }}
                  transition={{ duration: 0.12 }}
                  className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-300 tabular-nums"
                  aria-live="polite"
                >
                  {toPersianDigits(cartQty)}
                </motion.span>
                <span className="text-[8px] text-slate-400 dark:text-zinc-500 font-medium hidden sm:block leading-none -mt-0.5">
                  در سبد
                </span>
              </div>

              <button
                type="button"
                onClick={handleDecrement}
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 flex items-center justify-center border border-slate-200 dark:border-zinc-700 shadow-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-700 active:scale-90 transition-colors"
                aria-label={cartQty <= 1 ? 'حذف از سبد' : 'کاهش تعداد'}
              >
                {cartQty <= 1 ? (
                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500" aria-hidden />
                ) : (
                  <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden />
                )}
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="add-btn"
              type="button"
              onClick={handleAddFirst}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 4 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.92, y: 4 }}
              whileTap={hoverScale(0.94)}
              transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 }}
              className={`w-full h-9 sm:h-10 md:h-11 rounded-xl sm:rounded-2xl text-white text-[11px] sm:text-xs md:text-sm font-bold shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ripple-container overflow-hidden ${
                justAdded
                  ? 'bg-emerald-600 shadow-emerald-600/30'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/20 hover:shadow-md hover:shadow-emerald-600/25'
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {justAdded ? (
                  <motion.span
                    key="added"
                    initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
                    animate={reduceMotion ? undefined : { scale: 1, opacity: 1 }}
                    exit={reduceMotion ? undefined : { scale: 0.6, opacity: 0 }}
                    className="flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={3} aria-hidden />
                    <span>افزوده شد</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
                    animate={reduceMotion ? undefined : { scale: 1, opacity: 1 }}
                    exit={reduceMotion ? undefined : { scale: 0.6, opacity: 0 }}
                    className="flex items-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden />
                    <span>افزودن به سبد</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
};

export default ProductCard;
