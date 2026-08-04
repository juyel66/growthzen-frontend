'use client';

import React from 'react';
import { useGetCartQuery } from '@/services/cartApi';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { useTheme } from '@/hooks/useTheme';

interface CartBadgeProps {
  className?: string;
}

export const CartBadge: React.FC<CartBadgeProps> = ({ className = '' }) => {
  const theme = useTheme();

  const { data: cartData } = useGetCartQuery();

  const count =
    cartData?.summary?.totalQuantity ??
    cartData?.totalQuantity ??
    cartData?.items?.reduce((acc, item) => acc + (item.quantity || 1), 0) ??
    0;

  if (count <= 0) return null;

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full text-[11px] font-extrabold text-white bg-emerald-600 dark:bg-emerald-500 shadow-sm transition-all duration-300 animate-fade-in ${className}`}
      style={{
        backgroundColor: theme.primaryColor || undefined,
      }}
      aria-label={`${count} items in cart`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default CartBadge;
