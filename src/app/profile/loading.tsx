import React from 'react';

export default function ProfileLoading() {
  return (
    <div className="min-h-screen pb-24 md:pb-12 max-w-4xl mx-auto px-4 sm:px-6 pt-5 space-y-6 animate-pulse">
      {/* Top bar skeleton */}
      <div className="h-16 rounded-2xl bg-slate-200/80 dark:bg-zinc-800/80" />

      {/* Profile Hero Card Skeleton */}
      <div className="h-64 rounded-3xl bg-slate-200/70 dark:bg-zinc-800/70" />

      {/* Navigation tabs / buttons skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-slate-200/60 dark:bg-zinc-800/60" />
        ))}
      </div>
    </div>
  );
}
