'use client';

import React from 'react';
import { Product, getProductFinalPrice, getProductOriginalPrice, getProductDiscountAmount } from '@/types/product';
import { useAppSelector } from '@/redux/hooks';
import { Tag } from 'lucide-react';

interface ProductPriceProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
}

export const ProductPrice: React.FC<ProductPriceProps> = ({
  product,
  size = 'md',
  showBadge = true,
  className = '',
}) => {
  const user = useAppSelector((state) => state.auth?.user);
  const isReseller = user?.role === 'RESELLER' || user?.role === 'reseller';

  const finalPrice = getProductFinalPrice(product);
  const originalPrice = getProductOriginalPrice(product);
  const discountAmount = getProductDiscountAmount(product);

  const isDiscounted = discountAmount > 0 || originalPrice > finalPrice;
  const hasResellerPrice = isReseller && product.resellerPrice !== undefined && product.resellerPrice !== null;

  // Typography scaling
  const priceSizeClasses = {
    sm: 'text-base font-semibold',
    md: 'text-xl font-bold',
    lg: 'text-3xl font-extrabold',
  }[size];

  const originalSizeClasses = {
    sm: 'text-xs line-through text-slate-400',
    md: 'text-sm line-through text-slate-400',
    lg: 'text-lg line-through text-slate-400',
  }[size];

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Reseller Mode Pricing */}
      {hasResellerPrice ? (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`${priceSizeClasses} text-indigo-600 dark:text-indigo-400`}>
              ${product.resellerPrice?.toFixed(2)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <Tag className="w-3 h-3" /> Reseller Price
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Customer MSRP: ${finalPrice.toFixed(2)}</span>
            {originalPrice > finalPrice && (
              <span className="line-through text-slate-400">${originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      ) : (
        /* Standard Customer Pricing */
        <>
          {/* Final Price */}
          <span className={`${priceSizeClasses} text-emerald-600 dark:text-emerald-400 tracking-tight`}>
            ${finalPrice.toFixed(2)}
          </span>

          {/* Original Price (Strikethrough if discounted) */}
          {isDiscounted && originalPrice > finalPrice && (
            <span className={originalSizeClasses}>
              ${originalPrice.toFixed(2)}
            </span>
          )}

          {/* Discount Badge */}
          {isDiscounted && showBadge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
              {discountAmount > 0
                ? `-$${discountAmount.toFixed(2)}`
                : originalPrice > 0
                ? `${Math.round(((originalPrice - finalPrice) / originalPrice) * 100)}% OFF`
                : 'SALE'}
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPrice;
