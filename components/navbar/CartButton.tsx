'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useGetCartQuery } from '@/services/cartApi';

export const CartButton = () => {
  const theme = useTheme();
  
  const { data: cartData } = useGetCartQuery();

  const count = cartData?.totalQuantity ?? cartData?.items?.reduce((acc, item) => acc + (item.quantity || 1), 0) ?? 0;

  return (
    <Link
      href="/cart"
      className="relative p-2 hover:bg-slate-100/80 rounded-full transition-all group outline-none flex items-center justify-center cursor-pointer"
      aria-label={`View Cart, ${count} items`}
    >
      <ShoppingBag
        className="w-5.5 h-5.5 transition-all group-hover:scale-105"
        style={{ color: theme.textColor }}
      />
      {count > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
          style={{
            backgroundColor: theme.primaryColor,
          }}
        >
          {count}
        </span>
      )}
    </Link>
  );
};
export default CartButton;
