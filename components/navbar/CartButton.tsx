'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import CartBadge from '@/components/cart/CartBadge';

export const CartButton = () => {
  const theme = useTheme();

  return (
    <Link
      href="/cart"
      className="relative p-2 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-full transition-all group outline-none flex items-center justify-center cursor-pointer"
      aria-label="View Shopping Cart"
    >
      <ShoppingCart
        className="w-5.5 h-5.5 transition-all group-hover:scale-110 text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
        style={{ color: theme.textColor }}
      />
      <div className="absolute -top-0.5 -right-0.5">
        <CartBadge />
      </div>
    </Link>
  );
};

export default CartButton;

