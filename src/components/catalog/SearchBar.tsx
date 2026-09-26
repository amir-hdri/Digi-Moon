'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onChange?: (val: string) => void;
  onSubmit?: (val: string) => void;
  onClear?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  placeholder = 'جستجو در مون مارکت (خواربار، لبنیات، آرایشی و بهداشتی، شوینده)...',
  onChange,
  onSubmit,
  onClear,
  className = '',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit?.(value);
    }
  };

  const handleClear = () => {
    onChange?.('');
    onClear?.();
  };

  return (
    <section className={`w-full ${className}`}>
      <div className="relative w-full max-w-3xl mx-auto">
        <div className="relative flex items-center group">
          {/* Search Icon */}
          <div className="absolute start-4 pointer-events-none text-emerald-500 dark:text-emerald-400 transition-colors group-focus-within:text-emerald-600">
            <Search className="w-5 h-5" />
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full rounded-2xl py-3.5 ps-12 pe-11 text-xs sm:text-sm font-medium text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 liquid-glass border border-slate-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />

          {/* Clear Button */}
          {value.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute end-3.5 p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="پاک کردن متن"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
export default SearchBar;
