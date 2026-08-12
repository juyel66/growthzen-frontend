"use client";

import React from "react";
import { DashboardOverview } from "@/types/dashboard";
import {
  Calendar,
  TrendingUp,
  Package,
  Truck,
  ShoppingCart,
  Clock,
} from "lucide-react";

interface BusinessSummarySectionProps {
  overview?: DashboardOverview;
}

const formatCurrency = (val: number | null | undefined) => {
  if (val === null || val === undefined) return "--";
  return `৳${Number(val).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatNumber = (val: number | null | undefined) => {
  if (val === null || val === undefined) return "--";
  return new Intl.NumberFormat("en-US").format(val);
};

export const BusinessSummarySection: React.FC<BusinessSummarySectionProps> = ({
  overview,
}) => {
  const revenue = overview?.revenue;
  const accounting = overview?.accounting;
  const products = overview?.products;

  const todayMetrics = [
    {
      title: "Today's Gross Sales",
      value: formatCurrency(
        revenue?.todaySales ??
          revenue?.todayCustomerSales ??
          accounting?.todaySales ??
          revenue?.todayRevenue
      ),
      icon: Calendar,
      colorBg: "bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400",
    },
    {
      title: "Today's Net Profit",
      value: formatCurrency(
        revenue?.todayNetProfit ??
          revenue?.todayProfit ??
          accounting?.todayProfit
      ),
      icon: TrendingUp,
      colorBg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Today's Product Cost",
      value: formatCurrency(revenue?.todayProductCost ?? revenue?.todayCost),
      icon: Package,
      colorBg: "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400",
    },
    {
      title: "Today's Courier Cost",
      value: formatCurrency(revenue?.todayCourierCost),
      icon: Truck,
      colorBg: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Today's Quantity Sold",
      value: formatNumber(
        revenue?.todayQuantitySold ??
          revenue?.todayQuantity ??
          products?.todayUnits ??
          accounting?.todayQuantity
      ),
      icon: ShoppingCart,
      colorBg: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Today's Business Performance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daily real-time performance ledger
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60">
          Today's Ledger
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {todayMetrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between transition-all hover:bg-slate-50 dark:hover:bg-slate-800/60"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block truncate">
                  {item.title}
                </span>
                <span className="text-xl font-black text-slate-900 dark:text-slate-100 block tracking-tight">
                  {item.value}
                </span>
              </div>
              <div className={`p-2.5 rounded-xl flex-shrink-0 ${item.colorBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
