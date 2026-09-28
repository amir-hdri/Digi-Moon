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
    <div className={`w-full ${className}`}>
      <div className="relative w-full max-w-3xl mx-auto">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.(value);
          }}
          className="relative flex items-center group"
        >
          {/* Search Icon */}
          <div className="absolute start-4 pointer-events-none text-emerald-500 dark:text-emerald-400 transition-colors group-focus-within:text-emerald-600" aria-hidden="true">
            <Search className="w-5 h-5" aria-hidden="true" />
          </div>

          {/* Search Input */}
          <label htmlFor="catalog-search" className="sr-only">جستجو در مون مارکت</label>
          <input
            id="catalog-search"
            name="q"
            type="search"
            autoComplete="off"
            inputMode="search"
            spellCheck={false}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`${placeholder}…`}
            className="w-full rounded-2xl py-3.5 ps-12 pe-14 text-sm font-medium text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 liquid-glass border border-slate-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />

          {/* Clear Button */}
          {value.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute end-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="پاک کردن متن جستجو"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
export default SearchBar;
