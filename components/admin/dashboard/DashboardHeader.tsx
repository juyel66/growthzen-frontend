"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardRangeKey } from "@/types/dashboard";
import {
  Calendar,
  Clock,
  RefreshCw,
  Filter,
  PlusCircle,
  FolderPlus,
  ShoppingBag,
  Ticket,
} from "lucide-react";

interface DashboardHeaderProps {
  range?: DashboardRangeKey;
  setRange?: (range: DashboardRangeKey) => void;
  fromDate?: string;
  setFromDate?: (date: string) => void;
  toDate?: string;
  setToDate?: (date: string) => void;
  lastUpdated: Date | null;
  onRefresh: () => void;
  isFetching: boolean;
}

const RANGE_OPTIONS: { label: string; value: DashboardRangeKey }[] = [
  { label: "Today", value: "TODAY" },
  { label: "Yesterday", value: "YESTERDAY" },
  { label: "Last 7 Days", value: "LAST_7_DAYS" },
  { label: "Last 30 Days", value: "LAST_30_DAYS" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Yearly", value: "YEARLY" },
  { label: "Custom Range", value: "CUSTOM" },
];

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  range,
  setRange,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  lastUpdated,
  onRefresh,
  isFetching,
}) => {
  const [currentDateTime, setCurrentDateTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Date Details */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Dashboard
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Business Overview
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>Current Time:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {currentDateTime || "Loading time..."}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Last Updated:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {lastUpdated
                  ? lastUpdated.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : "Just now"}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {setRange && range && (
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <Filter className="w-4 h-4 text-slate-400 ml-1" />
              <select
                value={range}
                onChange={(e) => setRange(e.target.value as DashboardRangeKey)}
                className="bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-2"
              >
                {RANGE_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={onRefresh}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
            title="Refresh Dashboard Data"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
          Quick Actions:
        </span>

        <Link
          href="/admin-dashboard/products/add"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition shadow-2xs cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>+ Add Product</span>
        </Link>

        <Link
          href="/admin-dashboard/products/categories"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-violet-600 text-white hover:bg-violet-700 rounded-xl transition shadow-2xs cursor-pointer"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>+ Add Category</span>
        </Link>

        <Link
          href="/admin-dashboard/orders"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl transition shadow-2xs cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>View Orders</span>
        </Link>

        <Link
          href="/admin-dashboard/coupons"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 rounded-xl transition shadow-2xs cursor-pointer"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Create Coupon</span>
        </Link>
      </div>

      {/* Custom Range Inputs */}
      {range === "CUSTOM" && setFromDate && setToDate && (
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              From Date:
            </label>
            <input
              type="date"
              value={fromDate || ""}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              To Date:
            </label>
            <input
              type="date"
              value={toDate || ""}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>
      )}
    </div>
  );
};
