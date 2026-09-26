import React from 'react';

export default function CartLoading() {
  return (
    <div className="min-h-screen pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 pt-5 space-y-8 animate-pulse">
      {/* Header bar skeleton */}
      <div className="h-16 rounded-2xl bg-slate-200/80 dark:bg-zinc-800/80" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cart items column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="h-8 w-40 rounded-xl bg-slate-200/80 dark:bg-zinc-800/80" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-3xl bg-slate-200/60 dark:bg-zinc-800/60" />
          ))}
        </div>

        {/* Financial summary column */}
        <div className="lg:col-span-4">
          <div className="h-72 rounded-3xl bg-slate-200/70 dark:bg-zinc-800/70" />
        </div>
      </div>
    </div>
  );
}
