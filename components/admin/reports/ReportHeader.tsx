"use client";

import React, { useEffect, useState } from "react";
import { ReportDateRange } from "@/types/report";
import {
  Calendar,
  Clock,
  RefreshCw,
  Filter,
  BarChart3,
  X,
  Check,
} from "lucide-react";

interface ReportHeaderProps {
  range: ReportDateRange;
  setRange: (range: ReportDateRange) => void;
  fromDate: string;
  setFromDate: (date: string) => void;
  toDate: string;
  setToDate: (date: string) => void;
  onRefresh: () => void;
  isFetching: boolean;
  onApplyCustomRange: () => void;
}

const RANGE_OPTIONS: { label: string; value: ReportDateRange }[] = [
  { label: "Today", value: "TODAY" },
  { label: "Yesterday", value: "YESTERDAY" },
  { label: "Last 7 Days", value: "LAST_7_DAYS" },
  { label: "Last 30 Days", value: "LAST_30_DAYS" },
  { label: "This Month", value: "THIS_MONTH" },
  { label: "Last Month", value: "LAST_MONTH" },
  { label: "This Year", value: "THIS_YEAR" },
  { label: "Custom Range", value: "CUSTOM" },
];

export const ReportHeader: React.FC<ReportHeaderProps> = ({
  range,
  setRange,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  onRefresh,
  isFetching,
  onApplyCustomRange,
}) => {
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [tempFromDate, setTempFromDate] = useState<string>(fromDate);
  const [tempToDate, setTempToDate] = useState<string>(toDate);

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

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as ReportDateRange;
    setRange(selected);
    if (selected === "CUSTOM") {
      setShowCustomModal(true);
    }
  };

  const handleApplyCustom = () => {
    if (tempFromDate && tempToDate) {
      setFromDate(tempFromDate);
      setToDate(tempToDate);
      onApplyCustomRange();
      setShowCustomModal(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Description */}
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                REPORTS
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Business intelligence and performance insights
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400 mt-3">
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Current Time:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {currentDateTime || "Loading..."}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-200/60 dark:border-emerald-800/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold">Live System Data</span>
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 transition-all disabled:opacity-60 cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-slate-600 dark:text-slate-400 ${
                isFetching ? "animate-spin text-blue-500" : ""
              }`}
            />
            <span>{isFetching ? "Refreshing..." : "Refresh"}</span>
          </button>

          {/* Global Date Filter Dropdown */}
          <div className="relative flex items-center">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 absolute left-3.5 pointer-events-none z-10" />
            <select
              value={range}
              onChange={handleRangeChange}
              className="pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer appearance-none outline-none transition-all"
            >
              {RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
          </div>

          {range === "CUSTOM" && (
            <button
              onClick={() => setShowCustomModal(true)}
              className="px-3 py-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/70 dark:border-blue-800 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-all cursor-pointer"
            >
              {fromDate && toDate
                ? `${fromDate.split("T")[0]} to ${toDate.split("T")[0]}`
                : "Set Range"}
            </button>
          )}
        </div>
      </div>

      {/* Custom Date Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Select Custom Date Range
                </h3>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Start Date (From)
                </label>
                <input
                  type="date"
                  value={tempFromDate ? tempFromDate.split("T")[0] : ""}
                  onChange={(e) =>
                    setTempFromDate(
                      e.target.value ? `${e.target.value}T00:00:00.000Z` : ""
                    )
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  End Date (To)
                </label>
                <input
                  type="date"
                  value={tempToDate ? tempToDate.split("T")[0] : ""}
                  onChange={(e) =>
                    setTempToDate(
                      e.target.value ? `${e.target.value}T23:59:59.999Z` : ""
                    )
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustom}
                disabled={!tempFromDate || !tempToDate}
                className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
