'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Header,
  BottomNavbar,
  AddressModal,
  LoginModal,
} from '@/components';
import { useCartStore, selectHasStockConflict } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useToastStore } from '@/stores/useToastStore';
import { formatToman, toPersianDigits } from '@/lib/persian';
import { getFileUrl } from '@/lib/api';
import { PRODUCT_PLACEHOLDER } from '@/lib/product-images';
import { Address } from '@/types';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MapPin,
  ShieldCheck,
  Truck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function CartPage() {
  // Narrow selectors rather than `useCartStore()`. The whole-store version meant every
  // +/- tap re-rendered the entire page — line items, totals, checkout panel and all —
  // on a page that can hold 30+ rows.
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const hasStockConflict = useCartStore(selectHasStockConflict);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const activeAddress = useAuthStore((state) => state.activeAddress);
  const setActiveAddress = useAuthStore((state) => state.setActiveAddress);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderCode, setPlacedOrderCode] = useState('');
  const [placedTrackingCode, setPlacedTrackingCode] = useState('');
  const placeOrder = useOrderStore((state) => state.placeOrder);
  const placingOrder = useOrderStore((state) => state.placing);
  const pushNotification = useNotificationStore((state) => state.pushLocal);

  // Derived totals are pure functions of `items`, so a memo keyed on `items` is exact.
  const { subtotal, totalDiscount, payableTotal } = useMemo(
    () => ({
      subtotal: items.reduce(
        (sum, item) => sum + (item.product.oldPrice ?? item.product.price) * item.quantity,
        0
      ),
      totalDiscount: items.reduce(
        (sum, item) =>
          item.product.oldPrice && item.product.oldPrice > item.product.price
            ? sum + (item.product.oldPrice - item.product.price) * item.quantity
            : sum,
        0
      ),
      payableTotal: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    }),
    [items]
  );

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!activeAddress) {
      setIsAddressModalOpen(true);
      return;
    }
    try {
      const order = await placeOrder({
        items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
        addressId: activeAddress.id,
        paymentMethod: 'online',
      });
      pushNotification({
        type: 'order',
        title: 'سفارش جدید ثبت شد',
        message: `سفارش ${order.orderNumber} با موفقیت ثبت شد و آماده ارسال است.`,
        href: '/profile',
      });
      useToastStore.getState().show({
        title: 'سفارش ثبت شد',
        message: `سفارش شما با کد ${order.orderNumber} با موفقیت ثبت شد و آماده ارسال است.`,
        type: 'success',
      });
      setPlacedOrderCode(order.orderNumber);
      setPlacedTrackingCode(order.trackingCode ?? '');
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      useToastStore.getState().show({
        title: 'خطا در ثبت سفارش',
        message: err instanceof Error ? err.message : 'ثبت سفارش ناموفق بود.',
        type: 'error',
      });
    }
  };

  return (
    <main className="min-h-screen pb-24 md:pb-12 transition-colors duration-300">
      <Header
        onAddressClick={() => setIsAddressModalOpen(true)}
        onLoginClick={() => setIsLoginModalOpen(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-800 dark:text-zinc-100">
                سبد خرید شما
              </h1>
              <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                {items.length > 0
                  ? `${toPersianDigits(items.length)} قلم کالا آماده ارسال`
                  : 'هیچ کالایی انتخاب نشده است'}
              </span>
            </div>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>خالی کردن سبد</span>
            </button>
          )}
        </div>

        {orderPlaced ? (
          /* Order Success State */
          <div className="max-w-lg mx-auto text-center py-16 p-8 rounded-3xl liquid-glass-card bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 shadow-xl space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-black text-slate-800 dark:text-zinc-100">
              سفارش شما با موفقیت ثبت شد!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              کد پیگیری سفارش شما{' '}
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {placedOrderCode}
              </span>{' '}
              است.
              {placedTrackingCode && (
                <>
                  {' '}کد رهگیری پستی:{' '}
                  <span className="font-mono font-bold text-slate-700 dark:text-zinc-200">
                    {toPersianDigits(placedTrackingCode)}
                  </span>
                </>
              )}
              {' '}جزئیات ارسال از طریق پیامک به اطلاع شما خواهد رسید.
            </p>
            <div className="pt-3 flex justify-center gap-3">
              <Link
                href="/profile"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 transition-colors"
              >
                مشاهده در سفارش‌های من
              </Link>
              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
              >
                بازگشت به فروشگاه
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-20 p-8 rounded-3xl liquid-glass-card bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 shadow-sm space-y-4 max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-10 h-10 stroke-1" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100">
              سبد خرید شما در حال حاضر خالی است!
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              می‌توانید برای مشاهده محصولات جدید و پیشنهادات شگفت‌انگیز به صفحه اصلی فروشگاه مراجعه نمایید.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 hover:from-emerald-700 hover:to-emerald-800 transition-all cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>شروع خرید از فروشگاه</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Populated Cart Grid: Items (8 cols) + Financial Summary (4 cols) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-3.5">
              {items.map(({ product, quantity, selectedColor }) => {
                const img = product.imageUrl || getFileUrl(product.fileId) || PRODUCT_PLACEHOLDER;
                const colorObj =
                  typeof selectedColor === 'object' ? selectedColor : undefined;

                return (
                  <div
                    key={`${product.id}-${colorObj?.name || 'default'}`}
                    className="p-4 rounded-2xl liquid-glass-card bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-center gap-4 transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-50 dark:bg-zinc-800/60 p-2 shrink-0 flex items-center justify-center border border-slate-100 dark:border-zinc-800">
                      <Image
                        src={img}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 96px, 112px"
                        unoptimized={img.startsWith('data:')}
                        className="object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 text-right space-y-1.5 w-full">
                      <Link
                        href={`/product/${product.id}`}
                        className="text-sm font-bold text-slate-800 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 line-clamp-2 transition-colors"
                      >
                        {product.title}
                      </Link>

                      {/* Attributes */}
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        {colorObj && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/10"
                              style={{ backgroundColor: colorObj.hex }}
                            />
                            {colorObj.name}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-zinc-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>ضمانت اصالت و سلامت مون مارکت</span>
                        </span>
                      </div>

                      {/* Pricing per item */}
                      <div className="pt-2 flex items-baseline gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                        <span>{formatToman(product.price * quantity, false)}</span>
                        <span className="text-[10px] font-normal text-slate-500 dark:text-zinc-400">
                          تومان
                        </span>
                        {quantity > 1 && (
                          <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-normal mr-2">
                            (هر عدد {formatToman(product.price, false)} تومان)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Control & Delete Button */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                        title="حذف از سبد"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/60 p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-800 dark:text-zinc-100">
                          {toPersianDigits(quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Delivery Address Pill Card */}
              <div className="p-4 rounded-2xl liquid-glass-card bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-100 block">
                      آدرس تحویل سفارش
                    </span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 truncate max-w-sm block">
                      {activeAddress ? activeAddress.fullAddress : 'هنوز آدرسی انتخاب نشده است'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  {activeAddress ? 'تغییر آدرس' : 'انتخاب آدرس'}
                </button>
              </div>
            </div>

            {/* Financial Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-3xl liquid-glass-card bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 shadow-md space-y-4 sticky top-20">
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 pb-3 border-b border-slate-100 dark:border-zinc-800">
                  خلاصه فاکتور خرید
                </h3>

                <div className="space-y-3 text-xs">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                    <span>مبلغ کل کالاها:</span>
                    <span className="font-bold text-slate-800 dark:text-zinc-200">
                      {formatToman(subtotal, false)} تومان
                    </span>
                  </div>

                  {/* Total Discount */}
                  {totalDiscount > 0 && (
                    <div className="flex items-center justify-between text-red-500 font-medium">
                      <span>سود شما از خرید:</span>
                      <span className="font-bold">
                        {formatToman(totalDiscount, false)} تومان
                      </span>
                    </div>
                  )}

                  {/* Shipping */}
                  <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>هزینه ارسال:</span>
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      رایگان
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                      مبلغ قابل پرداخت:
                    </span>
                    <div className="flex items-baseline gap-1 text-emerald-600 dark:text-emerald-400 font-black text-lg">
                      <span>{formatToman(payableTotal, false)}</span>
                      <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">
                        تومان
                      </span>
                    </div>
                  </div>
                </div>

                {/*
                  The cart can hold a line whose quantity now exceeds available stock
                  (persisted carts, or a stock change since the item was added). The
                  conflict was detected by `hasStockConflict()` but never acted on — the
                  CTA stayed enabled and checkout silently proceeded. It now blocks.
                */}
                {hasStockConflict ? (
                  <p
                    id="cart-stock-alert"
                    role="alert"
                    className="w-full mb-3 px-3.5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-[11px] text-rose-600 dark:text-rose-400 leading-relaxed"
                  >
                    تعداد برخی کالاها از موجودی انبار بیشتر است. لطفاً تعداد را اصلاح کنید تا
                    بتوانید سفارش را ثبت کنید.
                  </p>
                ) : null}

                {/* Checkout CTA */}
                <button
                  type="button"
                  onClick={() => void handleCheckout()}
                  disabled={placingOrder || hasStockConflict}
                  aria-describedby={hasStockConflict ? 'cart-stock-alert' : undefined}
                  className="w-full min-h-[48px] py-3.5 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 hover:from-emerald-700 hover:to-emerald-800 active:scale-98 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" aria-hidden />
                  <span>
                    {placingOrder
                      ? 'در حال ثبت سفارش...'
                      : hasStockConflict
                        ? 'موجودی کافی نیست'
                        : 'ثبت و تکمیل خرید'}
                  </span>
                </button>

                <p className="text-[10px] text-slate-400 dark:text-zinc-500 text-center leading-relaxed">
                  با ثبت سفارش، کالاها به مدت ۲ ساعت در انبار برای شما رزرو خواهند شد.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNavbar activeTab="cart" />

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsLoginModalOpen(false)}
      />

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSelectAddress={(addr: Address) => {
          setActiveAddress(addr);
          setIsAddressModalOpen(false);
        }}
      />
    </main>
  );
}
