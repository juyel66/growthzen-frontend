'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CartSummary as CartSummaryType } from '@/types/cart';
import { ArrowRight, ShieldCheck, ShoppingBag, Tag, Truck } from 'lucide-react';

interface CartSummaryProps {
  summary?: CartSummaryType;
  totalItems: number;
  subtotal: number;
  discount: number;
  grandTotal: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  summary,
  totalItems,
  subtotal,
  discount,
  grandTotal,
}) => {
  const router = useRouter();

  const displaySubtotal = summary?.subtotal ?? subtotal;
  const displayDiscount = summary?.discount ?? discount;
  const displayGrandTotal = summary?.grandTotal ?? grandTotal;

  const handleCheckoutClick = () => {
    router.push('/checkout');
  };

  return (
    <div className="sticky top-6 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs flex flex-col gap-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <Tag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        Order Summary
      </h3>

      <div className="flex flex-col gap-3.5 text-xs font-medium text-slate-600 dark:text-slate-400">
        {/* Total Products */}
        <div className="flex items-center justify-between">
          <span>Total Products</span>
          <span className="font-bold text-slate-900 dark:text-white">{totalItems} items</span>
        </div>

        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-bold text-slate-900 dark:text-white">${displaySubtotal.toFixed(2)}</span>
        </div>

        {/* Discount */}
        {displayDiscount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span>Discount Savings</span>
            <span className="font-bold">-${displayDiscount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Divider & Grand Total */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-base font-extrabold text-slate-900 dark:text-white">Grand Total</span>
        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
          ${displayGrandTotal.toFixed(2)}
        </span>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col gap-3 pt-2">
        <button
          type="button"
          onClick={handleCheckoutClick}
          className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Proceed To Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <Link href="/products" className="w-full">
          <button
            type="button"
            className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </button>
        </Link>
      </div>

      {/* Trust Badge */}
      <div className="flex items-center justify-center gap-2 pt-2 text-[11px] font-semibold text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>256-bit Encrypted Secure Checkout</span>
      </div>
    </div>
  );
};

export default CartSummary;
