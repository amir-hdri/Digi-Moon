import React from 'react';
import { toPersianDigits } from '../lib/persian';

export interface HeaderProps {
  cartCount?: number;
  currentAddress?: string;
  onCartClick?: () => void;
  onAddressClick?: () => void;
  logoSrc?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount = 0,
  currentAddress = 'آدرس را انتخاب کنید',
  onCartClick,
  onAddressClick,
  logoSrc = '/logo.png',
}) => {
  return (
    <header className="glass-effect sticky top-0 z-40 shadow-xl bg-white/80 backdrop-blur-md border-b border-white/30">
      <div className="px-4 py-4">
        {/* Top Row: Logo & Brand Title + Cart Action */}
        <div className="flex items-center justify-between">
          {/* Logo & Brand Name */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="rounded-2xl bg-linear-to-br from-green-500 to-teal-500 p-1 text-white shadow-sm">
              <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <img
                  src={logoSrc}
                  alt="لوگوی دیجی مون"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div>
              <h1 className="gradient-text text-xl font-black tracking-tight">
                دیجی مون
              </h1>
            </div>
          </div>

          {/* Cart Button with Floating Badge */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <button
              onClick={onCartClick}
              aria-label="سبد خرید"
              className="relative rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-600 p-3 text-white shadow-lg transition-all hover:from-emerald-700 hover:to-emerald-700 active:scale-95 cursor-pointer"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              {cartCount > 0 && (
                <span className="cart-badge floating absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white shadow-md">
                  {toPersianDigits(cartCount)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Address Selection Trigger */}
        <div className="mt-3">
          <button
            onClick={onAddressClick}
            className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 transition-colors hover:text-emerald-600 cursor-pointer w-full text-right"
          >
            {/* Location Pin Icon */}
            <svg className="h-6 w-6 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex flex-col items-start gap-0.5 mr-2 min-w-30 flex-1">
              <span className="font-medium text-gray-800 text-xs line-clamp-1">آدرس شما</span>
              <span className="font-normal text-xs text-gray-500 line-clamp-1">{currentAddress}</span>
            </div>
            {/* Chevron Down */}
            <svg className="h-5 w-5 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
