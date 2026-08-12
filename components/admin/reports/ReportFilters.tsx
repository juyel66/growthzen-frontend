"use client";

import React from "react";
import { ReportQueryParams, SortByField, SortOrder } from "@/types/report";
import { Search, RotateCcw, ArrowUpDown, Filter } from "lucide-react";
import { ReportTabType } from "./ReportTabs";

interface ReportFiltersProps {
  activeTab: ReportTabType;
  queryParams: ReportQueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<ReportQueryParams>>;
  onReset: () => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  activeTab,
  queryParams,
  setQueryParams,
  onReset,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams((prev) => ({
      ...prev,
      search: e.target.value || undefined,
      page: 1,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQueryParams((prev) => ({
      ...prev,
      status: e.target.value || undefined,
      page: 1,
    }));
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQueryParams((prev) => ({
      ...prev,
      paymentMethod: e.target.value || undefined,
      page: 1,
    }));
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQueryParams((prev) => ({
      ...prev,
      sortBy: (e.target.value as SortByField) || undefined,
      page: 1,
    }));
  };

  const toggleSortOrder = () => {
    setQueryParams((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQueryParams((prev) => ({
      ...prev,
      limit: Number(e.target.value) || 10,
      page: 1,
    }));
  };

  // Status dropdown options depending on tab
  const getStatusOptions = () => {
    if (activeTab === "orders") {
      return [
        { label: "All Order Statuses", value: "" },
        { label: "Pending", value: "PENDING" },
        { label: "Confirmed", value: "CONFIRMED" },
        { label: "Processing", value: "PROCESSING" },
        { label: "Packed", value: "PACKED" },
        { label: "Shipped", value: "SHIPPED" },
        { label: "Delivered", value: "DELIVERED" },
        { label: "Cancelled", value: "CANCELLED" },
        { label: "Returned", value: "RETURNED" },
      ];
    }
    if (activeTab === "products") {
      return [
        { label: "All Product Statuses", value: "" },
        { label: "Active", value: "ACTIVE" },
        { label: "Inactive", value: "INACTIVE" },
        { label: "Draft", value: "DRAFT" },
        { label: "Archived", value: "ARCHIVED" },
      ];
    }
    if (activeTab === "payments") {
      return [
        { label: "All Payment Statuses", value: "" },
        { label: "Paid", value: "PAID" },
        { label: "Pending", value: "PENDING" },
        { label: "Failed", value: "FAILED" },
        { label: "Cancelled", value: "CANCELLED" },
        { label: "Refunded", value: "REFUNDED" },
      ];
    }
    return null;
  };

  const statusOptions = getStatusOptions();
  const showPaymentMethod = activeTab === "payments";

  const getSortByOptions = () => {
    const common = [
      { label: "Sort: Default Date", value: "createdAt" },
      { label: "Sort: Revenue", value: "revenue" },
    ];
    if (activeTab === "sales" || activeTab === "orders" || activeTab === "products" || activeTab === "customers") {
      common.push({ label: "Sort: Orders / Qty", value: "orders" });
    }
    return common;
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search items, codes, names..."
          value={queryParams.search || ""}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {/* Dynamic Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Status Filter */}
        {statusOptions && (
          <div className="relative">
            <select
              value={queryParams.status || ""}
              onChange={handleStatusChange}
              className="pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer appearance-none outline-none"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}

        {/* Payment Method Filter */}
        {showPaymentMethod && (
          <div className="relative">
            <select
              value={queryParams.paymentMethod || ""}
              onChange={handlePaymentMethodChange}
              className="pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer appearance-none outline-none"
            >
              <option value="">All Payment Methods</option>
              <option value="COD">Cash On Delivery (COD)</option>
              <option value="BKASH">bKash</option>
              <option value="NAGAD">Nagad</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}

        {/* Sort By Dropdown */}
        <div className="relative">
          <select
            value={queryParams.sortBy || "createdAt"}
            onChange={handleSortByChange}
            className="pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer appearance-none outline-none"
          >
            {getSortByOptions().map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Sort Order Toggle */}
        <button
          type="button"
          onClick={toggleSortOrder}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
          title="Toggle sort direction"
        >
          {queryParams.sortOrder === "asc" ? "Asc ↑" : "Desc ↓"}
        </button>

        {/* Rows per page */}
        <select
          value={queryParams.limit || 10}
          onChange={handleLimitChange}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer outline-none"
        >
          <option value={10}>10 / page</option>
          <option value={25}>25 / page</option>
          <option value={50}>50 / page</option>
          <option value={100}>100 / page</option>
        </select>

        {/* Reset Filters */}
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60 rounded-xl text-xs font-semibold hover:bg-rose-100 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
