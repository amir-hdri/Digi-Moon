'use client';

import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="cq-product group relative flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden bg-white/95 dark:bg-zinc-900/95 border border-slate-200/70 dark:border-zinc-800/80 shadow-sm w-full shrink-0">
      {/* Image area */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col">
        <div
          className="shimmer-skeleton relative w-full rounded-xl sm:rounded-2xl mb-2.5 sm:mb-3 overflow-hidden"
          style={{ height: 'clamp(108px, 22cqw, 180px)', minHeight: '108px' }}
        >
          {/* Badge placeholders */}
          <div className="absolute top-2 start-2 h-4 w-8 rounded-lg shimmer-skeleton" />
          <div className="absolute top-2 end-2 h-4 w-12 rounded-lg shimmer-skeleton" />
        </div>

        {/* Title lines */}
        <div className="space-y-1.5 mb-2.5">
          <div className="shimmer-skeleton h-3.5 rounded-md w-full" />
          <div className="shimmer-skeleton h-3.5 rounded-md w-3/4" />
        </div>

        {/* Stars placeholder */}
        <div className="shimmer-skeleton h-3 rounded w-16 mb-2" />

        {/* Price */}
        <div className="mt-auto flex flex-col items-center gap-1 py-1">
          <div className="shimmer-skeleton h-2.5 rounded w-1/3" />
          <div className="shimmer-skeleton h-5 rounded w-2/5" />
        </div>
      </div>

      {/* Button */}
      <div className="px-2.5 pb-2.5 sm:px-4 sm:pb-4">
        <div className="shimmer-skeleton h-9 sm:h-10 md:h-11 rounded-xl sm:rounded-2xl w-full" />
      </div>
    </div>
  );
};

export default ProductSkeleton;
