'use client';

import React from 'react';
import { Product, getProductDisplayPrice, getProductOriginalPrice, getProductDiscountAmount } from '@/types/product';
import { useAppSelector } from '@/redux/hooks';
import { selectIsReseller, selectCurrentUser } from '@/features/auth/authSlice';

interface ProductPriceProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  showRoleLabel?: boolean;
  className?: string;
}

export const ProductPrice: React.FC<ProductPriceProps> = ({
  product,
  size = 'md',
  showBadge = true,
  showRoleLabel = true,
  className = '',
}) => {
  const isReseller = useAppSelector(selectIsReseller);
  const currentUser = useAppSelector(selectCurrentUser);
  const isCustomer = currentUser?.role?.toUpperCase() === 'CUSTOMER';

  const displayPrice = getProductDisplayPrice(product, isReseller);
  const originalPrice = getProductOriginalPrice(product, isReseller);
  const hasDiscount = originalPrice > displayPrice;

  // Determine role label & badge text
  let roleLabel = '';
  let badgeText = '';

  if (isReseller) {
    if (product.resellerSpecialPriceEnabled || (product.resellerSpecialPrice && Number(product.resellerSpecialPrice) > 0 && Number(product.resellerSpecialPrice) < Number(product.resellerPrice || product.resellerSellPrice || originalPrice))) {
      roleLabel = 'SPECIAL RESELLER PRICE';
      badgeText = 'SPECIAL RESELLER PRICE';
    } else {
      roleLabel = 'RESELLER PRICE';
    }
  } else if (isCustomer) {
    if (product.customerSpecialPriceEnabled || (product.customerSpecialPrice && Number(product.customerSpecialPrice) > 0 && Number(product.customerSpecialPrice) < Number(product.customerSellPrice || product.price || originalPrice))) {
      roleLabel = 'SPECIAL CUSTOMER PRICE';
      badgeText = 'SPECIAL CUSTOMER PRICE';
    } else {
      roleLabel = 'CUSTOMER PRICE';
    }
  } else {
    // Guest
    if (hasDiscount) {
      badgeText = 'SPECIAL OFFER';
    }
  }

  // Typography scaling
  const priceSizeClasses = {
    sm: 'text-sm sm:text-base font-bold',
    md: 'text-lg sm:text-xl font-extrabold',
    lg: 'text-2xl sm:text-3xl font-black',
  }[size];

  const originalSizeClasses = {
    sm: 'text-xs line-through text-slate-400 font-medium',
    md: 'text-xs sm:text-sm line-through text-slate-400 font-medium',
    lg: 'text-sm sm:text-base line-through text-slate-400 font-medium',
  }[size];

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {/* Role / Pricing Label */}
      {showRoleLabel && roleLabel && (
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          {roleLabel}
        </span>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {/* Primary Display Price */}
        <span className={`${priceSizeClasses} text-emerald-600 dark:text-emerald-400 tracking-tight`}>
          ৳{displayPrice.toFixed(2)}
        </span>

        {/* Original Price (Strikethrough) */}
        {hasDiscount && (
          <span className={originalSizeClasses}>
            ৳{originalPrice.toFixed(2)}
          </span>
        )}

        {/* Offer Badge */}
        {showBadge && (hasDiscount || badgeText) && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/60">
            {hasDiscount ? `৳${(originalPrice - displayPrice).toFixed(2)} OFF` : badgeText || 'SPECIAL OFFER'}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductPrice;

