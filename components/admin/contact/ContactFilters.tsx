"use client";

import React from "react";
import { Search, RotateCcw, Filter, Calendar } from "lucide-react";

interface ContactFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  dateRange: string;
  setDateRange: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  limit: number;
  setLimit: (val: number) => void;
  onReset: () => void;
}

export function ContactFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  limit,
  setLimit,
  onReset,
}: ContactFiltersProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, subject..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer pr-1"
            >
              <option value="ALL">Status: All</option>
              <option value="UNREAD">Status: Unread</option>
              <option value="READ">Status: Read</option>
            </select>
          </div>

          {/* Date Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="last7">Last 7 Days</option>
              <option value="last30">Last 30 Days</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {/* Limit / Page Size Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <span>Rows:</span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
            title="Reset All Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Custom Date Inputs (only when Custom Date Range is selected) */}
      {dateRange === "custom" && (
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600 dark:text-slate-400">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600 dark:text-slate-400">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
