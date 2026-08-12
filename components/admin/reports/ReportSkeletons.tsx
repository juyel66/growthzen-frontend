"use client";

import React from "react";

export const ReportCardsSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs animate-pulse space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
          <div className="w-36 h-7 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="w-20 h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
        </div>
      ))}
    </div>
  );
};

export const ReportChartSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-48 h-5 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>
      <div className="w-full h-64 bg-slate-100 dark:bg-slate-800/50 rounded-xl flex items-end justify-between p-4 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-full bg-slate-200 dark:bg-slate-700/60 rounded-t-md"
            style={{ height: `${Math.floor(Math.random() * 60) + 20}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export const ReportTableSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 animate-pulse space-y-4">
      <div className="w-32 h-5 bg-slate-200 dark:bg-slate-800 rounded-md mb-2" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800/60">
            <div className="w-1/4 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="w-1/4 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="w-1/4 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="w-1/6 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};
