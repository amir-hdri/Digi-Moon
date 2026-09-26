import React from 'react';
import { Product } from '../types';
import { formatToman, toPersianDigits } from '../lib/persian';
import { getFileUrl } from '../lib/api';

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onClick,
}) => {
  const imageUrl = product.imageUrl || getFileUrl(product.fileId);
  const discount = product.discountPercent || (product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0);

  return (
    <div
      onClick={() => onClick?.(product)}
      className="product-card group relative flex flex-col rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden w-full shrink-0 cursor-pointer"
    >
      <div className="p-3 text-center flex-1 flex flex-col">
        {/* Product Image Slot with Overlay Badges */}
        <div className="relative h-40 w-full mb-3 flex justify-center items-center bg-gray-50 rounded-xl overflow-hidden group-hover:scale-102 transition-transform duration-300">
          <img
            src={imageUrl}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-contain p-2"
          />

          {/* Top Overlays: Stock Status & Discount Badge */}
          <div className="absolute top-0 inset-x-0 z-20 flex justify-between items-start p-2 w-full">
            {discount > 0 ? (
              <span className="rounded-lg bg-red-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                ٪{toPersianDigits(discount)}
              </span>
            ) : <span />}

            {product.isSpecial && (
              <span className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm mr-auto">
                ویژه
              </span>
            )}
          </div>
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 text-right leading-snug">
          {product.title}
        </h3>

        {/* Price & Unit Cluster */}
        <div className="mt-auto flex flex-col items-center justify-center min-h-15 py-1">
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatToman(product.oldPrice, false)}
            </span>
          )}
          <div className="flex items-baseline gap-1 text-emerald-600 font-extrabold text-base">
            <span>{formatToman(product.price, false)}</span>
            <span className="text-xs font-normal text-gray-500">تومان</span>
          </div>
        </div>
      </div>

      {/* Action Footer: Add to Cart CTA */}
      <div className="px-3 pb-3 mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product);
          }}
          className="w-full h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-600 text-white text-sm font-medium shadow-md transition-all hover:from-emerald-700 hover:to-emerald-700 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>افزودن به سبد</span>
        </button>
      </div>
    </div>
  );
};
