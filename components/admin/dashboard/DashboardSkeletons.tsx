"use client";

import React from "react";

export const DashboardSkeletons: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. Header Skeleton */}
      <div className="h-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xs">
        <div className="h-6 w-48 rounded-md animate-shimmer" />
        <div className="h-4 w-64 rounded-md animate-shimmer" />
      </div>

      {/* 2. Profit & Courier Revenue KPI Cards Skeleton (10 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded-md animate-shimmer" />
              <div className="w-8 h-8 rounded-xl animate-shimmer" />
            </div>
            <div className="h-6 w-24 rounded-md animate-shimmer mt-2" />
          </div>
        ))}
      </div>

      {/* 3. Business Summary Section Skeleton (11 Executive Cards) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl animate-shimmer" />
            <div className="space-y-1">
              <div className="h-4 w-36 rounded-md animate-shimmer" />
              <div className="h-3 w-48 rounded-md animate-shimmer" />
            </div>
          </div>
          <div className="h-5 w-24 rounded-lg animate-shimmer" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
            >
              <div className="space-y-2">
                <div className="h-3 w-24 rounded-md animate-shimmer" />
                <div className="h-6 w-28 rounded-md animate-shimmer" />
              </div>
              <div className="w-9 h-9 rounded-xl animate-shimmer" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Analytics Charts Skeleton (5 Daily Charts) */}
      <div className="space-y-4">
        <div className="h-6 w-44 rounded-md animate-shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl animate-shimmer" />
                  <div className="space-y-1">
                    <div className="h-4 w-28 rounded-md animate-shimmer" />
                    <div className="h-3 w-36 rounded-md animate-shimmer" />
                  </div>
                </div>
              </div>
              <div className="h-52 bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-shimmer" />
            </div>
          ))}
        </div>
      </div>

      {/* 5. Tables Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4"
          >
            <div className="h-5 w-36 rounded-md animate-shimmer" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-shimmer" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

