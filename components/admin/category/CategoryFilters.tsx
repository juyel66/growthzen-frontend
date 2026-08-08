'use client';

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

interface CategoryFiltersProps {
  statusFilter: string;
  onStatusChange: (value: string) => void;
  homepageFilter: string;
  onHomepageChange: (value: string) => void;
  onReset: () => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  statusFilter,
  onStatusChange,
  homepageFilter,
  onHomepageChange,
  onReset,
}) => {
  const isFiltered = statusFilter !== 'ALL' || homepageFilter !== 'ALL';

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Status Filter */}
      <div className="flex items-center gap-1.5 text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-400" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">ACTIVE Only</option>
          <option value="INACTIVE">INACTIVE Only</option>
        </select>
      </div>

      {/* Homepage Filter */}
      <div className="flex items-center gap-1.5 text-xs">
        <select
          value={homepageFilter}
          onChange={(e) => onHomepageChange(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="ALL">Homepage: All</option>
          <option value="YES">Show on Homepage</option>
          <option value="NO">Hidden from Homepage</option>
        </select>
      </div>

      {/* Reset Filter Button */}
      {isFiltered && (
        <button
          type="button"
          onClick={onReset}
          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      )}
    </div>
  );
};

export default CategoryFilters;

