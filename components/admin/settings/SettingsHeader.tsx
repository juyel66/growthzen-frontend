"use client";

import React from "react";
import { Settings, Image as ImageIcon, Percent, RefreshCw } from "lucide-react";

export type SettingsTab = "banners" | "system" | "category-discounts";

interface SettingsHeaderProps {
  activeTab: SettingsTab;
  setActiveTab: (tab: SettingsTab) => void;
  isFetching?: boolean;
  onRefresh?: () => void;
  bannerCount?: number;
  discountCount?: number;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  activeTab,
  setActiveTab,
  isFetching = false,
  onRefresh,
  bannerCount,
  discountCount,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-6">
      {/* Top Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Settings className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Enterprise System Settings
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pl-11">
            Manage global store configurations, homepage banners, and category discounts.
          </p>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isFetching}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh Settings</span>
          </button>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-0 overflow-x-auto">
        <button
          onClick={() => setActiveTab("banners")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "banners"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Homepage Banners</span>
          {typeof bannerCount === "number" && (
            <span className="ml-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
              {bannerCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("system")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "system"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Store & System Config</span>
        </button>

        <button
          onClick={() => setActiveTab("category-discounts")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "category-discounts"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>Category Discounts</span>
          {typeof discountCount === "number" && (
            <span className="ml-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300">
              {discountCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

