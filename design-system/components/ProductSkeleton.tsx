import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="product-card rounded-2xl shadow-md overflow-hidden bg-white border border-gray-100 w-full shrink-0 animate-pulse flex flex-col">
      <div className="p-3 text-center flex-1 flex flex-col">
        {/* Skeleton Image Slot */}
        <div className="relative h-40 w-full mb-3 flex justify-center items-center bg-gray-200 rounded-xl">
          <div className="absolute top-0 inset-x-0 z-20 flex justify-between items-start p-2 w-full">
            <div className="h-5 w-10 bg-gray-300 rounded-lg"></div>
            <div className="h-5 w-12 bg-gray-300 rounded-lg mr-auto"></div>
          </div>
        </div>

        {/* Skeleton Title Lines */}
        <div className="space-y-2 mb-2">
          <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>

        {/* Skeleton Price Cluster */}
        <div className="flex flex-col items-center justify-center min-h-15 space-y-1 mt-auto">
          <div className="h-3 bg-gray-100 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      {/* Skeleton Action Button */}
      <div className="px-3 pb-3 mt-auto">
        <div className="h-11 bg-gray-200 rounded-xl w-full"></div>
      </div>
    </div>
  );
};
