import React from 'react';

export type BottomNavTab = 'home' | 'categories' | 'products' | 'cart';

export interface BottomNavbarProps {
  activeTab?: BottomNavTab;
  onTabChange?: (tab: BottomNavTab) => void;
  cartCount?: number;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({
  activeTab = 'home',
  onTabChange,
  cartCount = 0,
}) => {
  const tabs = [
    {
      id: 'home' as BottomNavTab,
      label: 'خانه',
      href: '/',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'categories' as BottomNavTab,
      label: 'دسته‌بندی‌ها',
      href: '/categories',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'products' as BottomNavTab,
      label: 'محصولات',
      href: '/product',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      id: 'cart' as BottomNavTab,
      label: 'سبد خرید',
      href: '/cart',
      icon: (
        <div className="relative">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <nav
      id="bottom-navbar"
      className="glass-effect fixed bottom-0 left-0 right-0 z-50 border-t border-white/30 shadow-2xl bg-white/80 backdrop-blur-md"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-emerald-600 font-bold scale-105'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="transition-transform duration-200">
                {tab.icon}
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
