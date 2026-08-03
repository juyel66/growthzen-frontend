'use client';

import React from 'react';

export const CheckoutSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto py-6 animate-pulse">
      {/* Left Column Skeletons */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Customer Info Card Skeleton */}
        <div className="h-44 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl flex flex-col gap-4">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>

        {/* Shipping Address Card Skeleton */}
        <div className="h-96 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl flex flex-col gap-4">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="h-11 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-11 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-11 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-11 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
          <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl mt-2" />
        </div>

        {/* Delivery Method Skeleton */}
        <div className="h-44 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl flex flex-col gap-4">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Right Column Sidebar Skeleton */}
      <div className="lg:col-span-1 h-[600px] p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl flex flex-col gap-6">
        <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="flex flex-col gap-3 flex-1">
          <div className="h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
        <div className="h-11 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    </div>
  );
};

export default CheckoutSkeleton;
