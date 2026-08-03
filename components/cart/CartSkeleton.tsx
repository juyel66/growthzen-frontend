'use client';

import React from 'react';

export const CartItemSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl animate-pulse">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
};

export const CartSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto py-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 animate-pulse">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>
        <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CartItemSkeleton key={i} />
          ))}
        </div>
        <div className="h-96 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 animate-pulse" />
      </div>
    </div>
  );
};

export default CartSkeleton;
