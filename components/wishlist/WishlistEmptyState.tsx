'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

export const WishlistEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 sm:p-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs max-w-2xl mx-auto my-8">
      {/* Decorative Vector Graphic */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-900/60 flex items-center justify-center shadow-inner">
          <Heart className="w-12 h-12 text-rose-500 stroke-[1.75] animate-pulse" />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md animate-bounce">
          <Sparkles className="w-4 h-4 fill-white" />
        </div>
      </div>

      {/* Heading & Details */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
        Your Wishlist is Empty
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md mb-8 leading-relaxed">
        Explore our enterprise product catalog, find your favorite items, and save them to your wishlist to review or purchase later.
      </p>

      {/* Action Button */}
      <Link href="/products">
        <button
          type="button"
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </Link>
    </div>
  );
};

export default WishlistEmptyState;
