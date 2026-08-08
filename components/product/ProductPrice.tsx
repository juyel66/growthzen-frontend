'use client';

import React from 'react';
import { Product, getProductDisplayPrice, getProductOriginalPrice, getProductDiscountAmount } from '@/types/product';
import { useAppSelector } from '@/redux/hooks';
import { selectIsReseller } from '@/features/auth/authSlice';

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
  const isReseller = useAppSelector(selectIsReseller);

  const displayPrice = getProductDisplayPrice(product, isReseller);
  const originalPrice = getProductOriginalPrice(product, isReseller);

  const hasSpecialPrice = originalPrice > displayPrice;

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
      {/* Primary Display Price (Special Price if available, otherwise Sell Price for role) */}
      <span className={`${priceSizeClasses} text-emerald-600 dark:text-emerald-400 tracking-tight`}>
        ৳{displayPrice.toFixed(2)}
      </span>

      {/* Sell Price (Strikethrough if Special Price is active) */}
      {hasSpecialPrice && (
        <span className={originalSizeClasses}>
          ৳{originalPrice.toFixed(2)}
        </span>
      )}

      {/* Special Offer Badge */}
      {hasSpecialPrice && showBadge && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
          {`৳${(originalPrice - displayPrice).toFixed(2)} OFF`}
        </span>
      )}
    </div>
  );
};

export default ProductPrice;

