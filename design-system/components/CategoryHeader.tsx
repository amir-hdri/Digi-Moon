import React from 'react';

export interface CategoryHeaderProps {
  title?: string;
  onBack?: () => void;
  cartCount?: number;
  onCartClick?: () => void;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  title = 'دسته‌بندی‌ها',
  onBack,
  cartCount = 0,
  onCartClick,
}) => {
  return (
    <div className="flex sticky top-0 items-center justify-between shadow-lg glass-effect bg-white/80 backdrop-blur-md z-100 px-4 py-3 border-b border-white/30">
      <div className="flex items-center">
        {onBack && (
          <button
            onClick={onBack}
            className="ml-3 p-2 hover:bg-gray-100/60 rounded-xl transition-colors cursor-pointer"
            aria-label="بازگشت"
          >
            <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        <h2 className="text-xl font-black gradient-text">
          {title}
        </h2>
      </div>

      <div className="flex items-center space-x-3 space-x-reverse">
        <button
          onClick={onCartClick}
          className="relative rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-600 p-2.5 text-white shadow-md transition-all hover:from-emerald-700 cursor-pointer"
          aria-label="سبد خرید"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          {cartCount > 0 && (
            <span className="cart-badge floating absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
