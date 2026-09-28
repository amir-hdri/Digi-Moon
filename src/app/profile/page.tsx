'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Header,
  BottomNavbar,
  ProfileHero,
  ProductCard,
  LoginModal,
  AddressModal,
  MessagePanel,
} from '@/components';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { mockOrders, mockProducts } from '@/data/mock-data';
import { formatToman, toPersianDigits } from '@/lib/persian';
import { Address, Order } from '@/types';
import {
  ShoppingBag,
  Heart,
  MapPin,
  Clock,
  CheckCircle2,
  PackageCheck,
  Truck,
  Plus,
  MessageSquare,
} from 'lucide-react';

type ProfileTab = 'orders' | 'favorites' | 'addresses' | 'messages';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const activeAddress = useAuthStore((s) => s.activeAddress);
  const setActiveAddress = useAuthStore((s) => s.setActiveAddress);
  const addItem = useCartStore((state) => state.addItem);
  const placedOrders = useOrderStore((state) => state.orders);
  const orders = [...placedOrders, ...mockOrders];

  const [activeTab, setActiveTab] = useState<ProfileTab>('orders');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const favoriteProducts = (user?.favoriteProductIds ?? [])
    .map((id) => mockProducts.find((p) => String(p.id) === String(id)))
    .filter((p): p is (typeof mockProducts)[number] => Boolean(p));

  // Iranian Order Status Badge
  const renderStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>در حال پردازش</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <Truck className="w-3.5 h-3.5" />
            <span>تحویل به پست</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>تحویل داده شد</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-xs font-bold">
            <span>در انتظار پرداخت</span>
          </span>
        );
    }
  };

  return (
    <main className="min-h-screen pb-24 md:pb-12 transition-colors duration-300">
      <Header
        onAddressClick={() => setIsAddressModalOpen(true)}
        onLoginClick={() => setIsLoginModalOpen(true)}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Profile Hero Card */}
        <ProfileHero
          onLoginClick={() => setIsLoginModalOpen(true)}
          onFestivalClick={() => router.push('/#festival-deals')}
          onOrdersClick={() => setActiveTab('orders')}
          onFavoritesClick={() => setActiveTab('favorites')}
          onAddressClick={() => setActiveTab('addresses')}
        />

        {/* Profile Navigation Tabs */}
        <div className="flex items-center gap-1 liquid-glass bg-slate-100/80 dark:bg-zinc-800/80 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>سفارش‌های من</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>علاقه‌مندی‌ها</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>آدرس‌ها</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('messages')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>پیام‌ها</span>
          </button>
        </div>

        {/* Tab Content: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-3xl liquid-glass-card bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 shadow-sm space-y-4"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-slate-800 dark:text-zinc-200">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-zinc-500">
                        {order.createdAt}
                      </span>
                    </div>
                    {renderStatusBadge(order.status)}
                  </div>

                  {/* Order Items Thumbnails */}
                  <div className="flex items-center gap-3 overflow-x-auto py-1">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="relative w-16 h-16 rounded-xl bg-slate-50 dark:bg-zinc-800/60 p-1.5 border border-slate-100 dark:border-zinc-800 shrink-0 flex items-center justify-center"
                        title={item.product.title}
                      >
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          fill
                          sizes="64px"
                          unoptimized={item.product.imageUrl.startsWith('data:')}
                          className="object-contain"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Order Total & Tracking */}
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <div className="flex items-baseline gap-1 text-slate-800 dark:text-zinc-200">
                      <span className="text-slate-500 dark:text-zinc-400">مبلغ پرداخت‌شده:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        {formatToman(order.finalAmount, false)}
                      </span>
                      <span className="text-[10px] text-slate-400">تومان</span>
                    </div>

                    {order.trackingCode && (
                      <div className="text-slate-500 dark:text-zinc-400 text-[11px]">
                        کد رهگیری پستی:{' '}
                        <span className="font-mono font-bold text-slate-700 dark:text-zinc-300">
                          {toPersianDigits(order.trackingCode)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
                <PackageCheck className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">هنوز سفارشی ثبت نکرده‌اید.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Favorites */}
        {activeTab === 'favorites' && (
          <div className="space-y-4">
            {favoriteProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {favoriteProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(p) => addItem(p, 1)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
                <Heart className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500">
                  هنوز کالایی را نشان نکرده‌اید. روی قلب هر محصول بزنید تا اینجا ذخیره شود.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                نشانی‌های ذخیره‌شده
              </span>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن آدرس جدید</span>
              </button>
            </div>

            {user?.addresses && user.addresses.length > 0 ? (
              user.addresses.map((addr) => {
                const isSelected = activeAddress?.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setActiveAddress(addr)}
                    className={`p-4 rounded-2xl border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-800 dark:text-zinc-100">
                          {addr.title}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                            پیش‌فرض
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          آدرس فعال
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 mb-2">
                      {addr.fullAddress}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-zinc-400">
                      <span>تحویل‌گیرنده: {addr.receiverName}</span>
                      <span>تلفن: {toPersianDigits(addr.receiverPhone)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
                <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">هنوز نشانی ذخیره نشده است.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Messages */}
        {activeTab === 'messages' && <MessagePanel />}
      </div>

      <BottomNavbar activeTab="profile" />

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
