'use client';

import React from 'react';

export const WishlistCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xs p-5 flex flex-col gap-4 animate-pulse">
      <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="flex flex-col gap-2">
        <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-5 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
        <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const WishlistSkeleton: React.FC = () => {
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

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <WishlistCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default WishlistSkeleton;

