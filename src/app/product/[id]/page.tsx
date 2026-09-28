'use client';

import React, { use, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { CategoryHeader, ProductCard } from '@/components';
import { mockProducts } from '@/data/mock-data';
import { ProductColor } from '@/types';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToastStore } from '@/stores/useToastStore';
import { formatToman, toPersianDigits } from '@/lib/persian';
import { getFileUrl } from '@/lib/api';
import { PRODUCT_PLACEHOLDER } from '@/lib/product-images';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  Package,
} from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  // Find product by id or slug
  const allProducts = useMemo(() => mockProducts, []);
  const product = useMemo(() => {
    return allProducts.find((p) => String(p.id) === id || p.slug === id);
  }, [allProducts, id]);

  if (!product) notFound();

  // Selected options state
  const [selectedColor, setSelectedColor] = useState<ProductColor | undefined>(
    product?.colors?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const toggleFavorite = useAuthStore((state) => state.toggleFavorite);
  const isFavorite = useAuthStore((state) =>
    (state.user?.favoriteProductIds ?? []).some((id) => String(id) === String(product.id))
  );

  // Related products from same category
  const relatedProducts = useMemo(() => {
    return allProducts
      .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
      .slice(0, 4);
  }, [allProducts, product]);

  const imageUrl = product.imageUrl || getFileUrl(product.fileId) || PRODUCT_PLACEHOLDER;
  const discount =
    product.discountPercent ||
    (product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor);
    useToastStore.getState().show({
      title: 'افزوده شد به سبد خرید',
      message: `«${product.title}» (${toPersianDigits(quantity)} عدد) به سبد خرید اضافه شد.`,
      type: 'success',
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <main className="min-h-screen pb-28 md:pb-12 transition-colors duration-300">
      {/* Category Header */}
      <CategoryHeader
        title={product.categoryTitle}
        onBack={() => router.back()}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            خانه
          </Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <Link
            href={`/category/${product.categoryId}`}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {product.categoryTitle}
          </Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-slate-800 dark:text-zinc-200 font-medium truncate max-w-xs">
            {product.title}
          </span>
        </nav>

        {/* Top Product Showcase Card: Image + Details + Purchase Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 rounded-3xl liquid-glass-card bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 shadow-md">
          {/* 1. Product Image Showcase (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full aspect-square max-w-md rounded-2xl bg-slate-50 dark:bg-zinc-800/60 p-6 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-zinc-800">
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 480px"
                unoptimized={imageUrl.startsWith('data:')}
                className="object-contain hover:scale-105 transition-transform duration-300"
              />

              {/* Badges Overlay */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
                {discount > 0 ? (
                  <span className="rounded-xl bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                    ٪{toPersianDigits(discount)} تخفیف
                  </span>
                ) : (
                  <span />
                )}

                {product.isSpecial && (
                  <span className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                    پیشنهاد ویژه
                  </span>
                )}
              </div>

              {/* Action Buttons: Favorite & Share */}
              <div className="absolute bottom-4 start-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleFavorite(product.id)}
                  className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm hover:text-red-500 text-slate-500 dark:text-zinc-400 transition-colors cursor-pointer"
                  title="نشان کردن"
                >
                  <Heart
                    className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: product.title, url: window.location.href });
                    }
                  }}
                  className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  title="اشتراک‌گذاری"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 2. Product Information & Attributes (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg">
                  {product.categoryTitle}
                </span>

                {product.rating && (
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{toPersianDigits(product.rating)}</span>
                    {product.reviewsCount && (
                      <span className="text-slate-400 dark:text-zinc-500 font-normal">
                        ({toPersianDigits(product.reviewsCount)} دیدگاه خریداران)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-zinc-100 leading-snug">
                {product.title}
              </h1>

              {/* Description */}
              {product.description && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                    انتخاب رنگ:{' '}
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {selectedColor?.name || ''}
                    </span>
                  </span>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor?.name === color.name;
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          aria-pressed={isSelected}
                          className={`flex items-center gap-2 px-3 min-h-[44px] py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 shadow-sm'
                              : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>{color.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Warranty & Guarantees */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-800 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{product.warranty || 'ضمانت اصالت و سلامت فیزیکی کالا'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                  <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>ارسال سریع مون مارکت اکسپرس در کمتر از ۱ ساعت</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                  <RotateCcw className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>۷ روز ضمانت بازگشت و تعویض بی‌قید و شرط</span>
                </div>
              </div>
            </div>

            {/* Desktop Pricing & Buy Button */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Price Cluster */}
              <div className="text-right w-full sm:w-auto">
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-xs text-slate-400 dark:text-zinc-500 line-through block">
                    {formatToman(product.oldPrice, false)}
                  </span>
                )}
                <div className="flex items-baseline gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="text-2xl sm:text-3xl font-black">
                    {formatToman(product.price, false)}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                    تومان
                  </span>
                </div>
              </div>

              {/* Quantity & CTA */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Quantity adjuster */}
                <div className="flex items-center rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/60 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-800 dark:text-zinc-100">
                    {toPersianDigits(quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 sm:flex-none px-6 h-12 rounded-xl text-white font-bold text-sm shadow-md transition-colors active:scale-98 flex items-center justify-center gap-2 cursor-pointer ${
                    isAdded
                      ? 'bg-green-600 shadow-green-600/30'
                      : 'bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 shadow-emerald-600/20'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5 animate-scale-check" />
                      <span>به سبد اضافه شد</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>افزودن به سبد خرید</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Technical Specifications Table */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <section className="p-6 sm:p-8 rounded-3xl liquid-glass-card bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-500" />
              <span>مشخصات فنی و ویژگی‌های محصول</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800/80 text-xs"
                >
                  <span className="text-slate-500 dark:text-zinc-400 font-medium">{key}</span>
                  <span className="text-slate-800 dark:text-zinc-100 font-bold text-left ltr">
                    {toPersianDigits(value)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Related Products Rail */}
        {relatedProducts.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-zinc-100">
              محصولات مرتبط و مشابه
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={(prod) => addItem(prod, 1)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Mobile Add-to-Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden liquid-glass bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg border-t border-slate-200/80 dark:border-zinc-800 p-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-3">
          <div className="text-right">
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-[11px] text-slate-400 dark:text-zinc-500 line-through block">
                {formatToman(product.oldPrice, false)}
              </span>
            )}
            <div className="flex items-baseline gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="text-lg font-black">{formatToman(product.price, false)}</span>
              <span className="text-[10px] text-slate-500 dark:text-zinc-400">تومان</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 h-11 rounded-xl text-white font-bold text-xs shadow-md active:scale-95 transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              isAdded
                ? 'bg-green-600'
                : 'bg-gradient-to-br from-emerald-600 to-emerald-700'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>افزوده شد</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>افزودن به سبد</span>
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
