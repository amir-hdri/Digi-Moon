import React from 'react';

export interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onChange?: (val: string) => void;
  onSubmit?: (val: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  placeholder = 'جستجو در دیجی مون...',
  onChange,
  onSubmit,
}) => {
  return (
    <section className="px-4 py-3">
      <div className="relative w-full max-w-lg mx-auto">
        <div className="relative group">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSubmit?.(value)}
            placeholder={placeholder}
            className="glass-effect w-full rounded-2xl px-4 py-3.5 pr-12 text-sm font-medium text-gray-800 placeholder-gray-400 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white bg-white/80 backdrop-blur-md border border-white/40"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
