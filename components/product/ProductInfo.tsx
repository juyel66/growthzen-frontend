'use client';

import React from 'react';
import { Product, getProductTitle, getProductCategoryName } from '@/types/product';
import { Star, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const title = getProductTitle(product);
  const categoryName = getProductCategoryName(product);
  const averageRating = product.averageRating ?? product.ratingsAverage ?? 0;
  const reviewCount = product.reviewCount ?? product.ratingsCount ?? 0;

  const isFeatured = product.isFeatured;
  const status = product.status || (product.isActive !== false ? 'ACTIVE' : 'INACTIVE');
  const isAvailable = status.toUpperCase() === 'ACTIVE' || status.toUpperCase() === 'IN_STOCK';

  return (
    <div className="flex flex-col gap-3">
      {/* Category & Status Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
            {categoryName}
          </span>
          {isFeatured && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
              <Sparkles className="w-3 h-3 fill-amber-400 text-amber-500" /> Featured
            </span>
          )}
        </div>

        {/* Stock Status Badge */}
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
            isAvailable
              ? 'bg-slate-100 text-emerald-700 dark:bg-slate-800 dark:text-emerald-400'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
          }`}
        >
          {isAvailable ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> In Stock
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Out of Stock
            </>
          )}
        </span>
      </div>

      {/* Product Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
        {title}
      </h1>

      {/* Rating & Review Summary */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(averageRating)
                  ? 'fill-amber-400 text-amber-400'
                  : i < averageRating
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'text-slate-300 dark:text-slate-700'
              }`}
            />
          ))}
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">
            {averageRating.toFixed(1)}
          </span>
        </div>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
        </span>
        {product.productCode && (
          <>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-400">SKU: {product.productCode}</span>
          </>
        )}
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
          {product.shortDescription}
        </p>
      )}

      {/* Full Description */}
      {product.description && (
        <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed space-y-2 mt-1">
          <p>{product.description}</p>
        </div>
      )}

      {/* Trust Badges */}
      <div className="flex items-center gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Authentic Guarantee</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Quality Inspected</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;

