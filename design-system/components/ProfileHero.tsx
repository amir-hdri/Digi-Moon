import React from 'react';

export interface ProfileHeroProps {
  isLoggedIn?: boolean;
  userPhone?: string;
  userName?: string;
  onLoginClick?: () => void;
  onFestivalClick?: () => void;
  onOrdersClick?: () => void;
  onFavoritesClick?: () => void;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({
  isLoggedIn = false,
  userPhone,
  userName = 'کاربر دیجی مون',
  onLoginClick,
  onFestivalClick,
  onOrdersClick,
  onFavoritesClick,
}) => {
  return (
    <div className="w-full space-y-4">
      {/* Profile Header Hero Card */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-10 -left-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

        {isLoggedIn ? (
          <div className="flex items-center space-x-4 space-x-reverse relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold border border-white/30">
              👤
            </div>
            <div className="text-right">
              <h2 className="text-lg font-black">{userName}</h2>
              <p className="text-xs text-green-100 mt-1">{userPhone}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-2 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl mb-3 border border-white/30">
              🔐
            </div>
            <h2 className="text-base font-bold mb-1">به دیجی‌مون خوش آمدید</h2>
            <p className="text-xs text-green-100 mb-4 max-w-xs">
              برای مشاهده سوابق خرید و دسترسی به تخفیف‌های ویژه، وارد حساب کاربری خود شوید.
            </p>
            <button
              onClick={onLoginClick}
              className="inline-flex items-center bg-white text-green-600 font-bold px-6 py-2.5 rounded-2xl shadow-lg hover:bg-green-50 transition-all active:scale-95 cursor-pointer text-sm"
            >
              ورود به حساب
            </button>
          </div>
        )}
      </div>

      {/* Menu Options List */}
      <div className="space-y-3">
        {/* Festival Campaign Card (شگفتانه) */}
        <div
          onClick={onFestivalClick}
          className="w-full glass-effect p-4 rounded-2xl shadow-md flex items-center justify-between hover:shadow-xl transition-all cursor-pointer bg-white/80 dark:bg-zinc-900 border border-white/40 dark:border-zinc-800"
        >
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0">
              <span className="text-xl">🎉</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-800 dark:text-zinc-100 text-sm block">
                شگفتانه
              </span>
              <span className="text-xs text-gray-500 dark:text-zinc-400">
                محصولات جشنواره‌ای با تخفیف ویژه
              </span>
            </div>
          </div>
          <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Orders Card */}
        <div
          onClick={onOrdersClick}
          className="w-full glass-effect p-4 rounded-2xl shadow-md flex items-center justify-between hover:shadow-xl transition-all cursor-pointer bg-white/80 dark:bg-zinc-900 border border-white/40 dark:border-zinc-800"
        >
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0">
              <span className="text-xl">📦</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-800 dark:text-zinc-100 text-sm block">
                سفارش‌های من
              </span>
              <span className="text-xs text-gray-500 dark:text-zinc-400">
                پیگیری مرسوله‌ها و تاریخچه خرید
              </span>
            </div>
          </div>
          <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Favorites Card */}
        <div
          onClick={onFavoritesClick}
          className="w-full glass-effect p-4 rounded-2xl shadow-md flex items-center justify-between hover:shadow-xl transition-all cursor-pointer bg-white/80 dark:bg-zinc-900 border border-white/40 dark:border-zinc-800"
        >
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0">
              <span className="text-xl">❤️</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-800 dark:text-zinc-100 text-sm block">
                علاقه‌مندی‌ها
              </span>
              <span className="text-xs text-gray-500 dark:text-zinc-400">
                کالاهای نشان‌شده برای خرید بعد
              </span>
            </div>
          </div>
          <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
