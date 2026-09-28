'use client';

import React from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatToman, toPersianDigits } from '@/lib/persian';
import {
  User,
  Lock,
  Sparkles,
  ShoppingBag,
  Heart,
  MapPin,
  LogOut,
  ChevronLeft,
  Wallet,
  ShieldCheck,
} from 'lucide-react';

export interface ProfileHeroProps {
  isLoggedIn?: boolean;
  userPhone?: string;
  userName?: string;
  onLoginClick?: () => void;
  onFestivalClick?: () => void;
  onOrdersClick?: () => void;
  onFavoritesClick?: () => void;
  onAddressClick?: () => void;
  onLogoutClick?: () => void;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({
  isLoggedIn: controlledIsLoggedIn,
  userPhone: controlledPhone,
  userName: controlledName,
  onLoginClick,
  onFestivalClick,
  onOrdersClick,
  onFavoritesClick,
  onAddressClick,
  onLogoutClick,
}) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const isAuth = controlledIsLoggedIn !== undefined ? controlledIsLoggedIn : isAuthenticated;
  const displayName =
    controlledName ||
    (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'کاربر مون مارکت');
  const displayPhone =
    controlledPhone || (user?.phoneNumber ? toPersianDigits(user.phoneNumber) : '');
  const walletBalance = user?.walletBalance || 0;

  const handleLogout = () => {
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      logout();
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Profile Header Hero Card */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white p-6 rounded-3xl shadow-xl shadow-emerald-600/15 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -left-12 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-400/20 rounded-full blur-xl pointer-events-none" />

        {isAuth ? (
          <div className="relative z-10 space-y-5">
            {/* Top Row: User Avatar & Info + Logout */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3.5 space-x-reverse">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
                  <User className="w-7 h-7" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-lg font-black">{displayName}</h2>
                    <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  </div>
                  <p className="text-xs text-emerald-100 mt-0.5 font-medium">
                    {displayPhone}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white/90 hover:text-white transition-colors cursor-pointer"
                title="خروج از حساب"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Wallet Balance Pill */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-medium text-emerald-50">موجودی کیف پول</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-extrabold text-white">
                  {formatToman(walletBalance, false)}
                </span>
                <span className="text-[11px] text-emerald-100">تومان</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-2 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 border border-white/30 shadow-inner">
              <Lock className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-base font-bold mb-1">به مون مارکت خوش آمدید</h2>
            <p className="text-xs text-emerald-100 mb-4 max-w-xs leading-relaxed">
              برای مشاهده سوابق خرید، مدیریت آدرس‌ها و بهره‌مندی از تخفیف‌های ویژه، وارد حساب کاربری خود شوید.
            </p>
            <button
              type="button"
              onClick={onLoginClick}
              className="inline-flex items-center bg-white text-emerald-700 font-bold px-6 py-2.5 rounded-2xl shadow-lg hover:bg-emerald-50 transition-colors active:scale-95 cursor-pointer text-sm"
            >
              ورود به حساب کاربری
            </button>
          </div>
        )}
      </div>

      {/* Menu Options List */}
      <div className="space-y-2.5">
        {/* Festival Campaign Card (شگفتانه) */}
        <div
          onClick={onFestivalClick}
          className="w-full glass-effect p-4 rounded-2xl shadow-sm hover:shadow-md flex items-center justify-between transition-colors cursor-pointer bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800"
        >
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-11 h-11 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-800 dark:text-zinc-100 text-sm block">
                شگفتانه‌ها و تخفیف‌های داغ
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">
                محصولات جشنواره‌ای با تخفیف‌های استثنایی
              </span>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-slate-400 dark:text-zinc-500 shrink-0" />
        </div>

        {/* Orders Card */}
        <div
          onClick={onOrdersClick}
          className="w-full glass-effect p-4 rounded-2xl shadow-sm hover:shadow-md flex items-center justify-between transition-colors cursor-pointer bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800"
        >
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-800 dark:text-zinc-100 text-sm block">
                سفارش‌های من
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">
                پیگیری مرسوله‌ها و سوابق خرید
              </span>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-slate-400 dark:text-zinc-500 shrink-0" />
        </div>

        {/* Favorites Card */}
        <div
          onClick={onFavoritesClick}
          className="w-full glass-effect p-4 rounded-2xl shadow-sm hover:shadow-md flex items-center justify-between transition-colors cursor-pointer bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800"
        >
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-800 dark:text-zinc-100 text-sm block">
                کالاهای مورد علاقه
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">
                محصولات نشان‌شده برای خرید آینده
              </span>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-slate-400 dark:text-zinc-500 shrink-0" />
        </div>

        {/* Addresses Card */}
        <div
          onClick={onAddressClick}
          className="w-full glass-effect p-4 rounded-2xl shadow-sm hover:shadow-md flex items-center justify-between transition-colors cursor-pointer bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800"
        >
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-800 dark:text-zinc-100 text-sm block">
                آدرس‌های من
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">
                مدیریت نشانی‌های تحویل سفارش
              </span>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-slate-400 dark:text-zinc-500 shrink-0" />
        </div>
      </div>
    </div>
  );
};
export default ProfileHero;
