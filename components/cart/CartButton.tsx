'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import CartBadge from './CartBadge';

interface CartButtonProps {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
}

export const CartButton: React.FC<CartButtonProps> = ({
  className = '',
  iconClassName = 'w-5.5 h-5.5',
  showText = false,
}) => {
  return (
    <Link
      href="/cart"
      className={`relative p-2 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-full transition-all group outline-none flex items-center gap-2 cursor-pointer ${className}`}
      aria-label="Shopping Cart"
    >
      <div className="relative flex items-center justify-center">
        <ShoppingCart
          className={`${iconClassName} transition-all group-hover:scale-110 text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400`}
        />
        <div className="absolute -top-2 -right-2">
          <CartBadge />
        </div>
      </div>
      {showText && (
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          Cart
        </span>
      )}
    </Link>
  );
};

export default CartButton;
