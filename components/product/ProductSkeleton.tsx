'use client';

import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-3 animate-pulse shadow-sm">
      <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="flex justify-between items-center">
        <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-3 w-10 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
      <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="flex gap-2 pt-2">
        <div className="h-9 flex-1 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const ProductGallerySkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse">
      <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="flex gap-3 overflow-x-auto pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0" />
        ))}
      </div>
    </div>
  );
};

export const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
      {/* Gallery Skeleton */}
      <ProductGallerySkeleton />

      {/* Info & Actions Skeleton */}
      <div className="flex flex-col gap-6">
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="space-y-2 py-4">
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-4/6 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-12 flex-1 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-12 flex-1 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
