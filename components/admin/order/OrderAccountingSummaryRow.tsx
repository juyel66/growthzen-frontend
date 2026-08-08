"use client";

import React from "react";
import { OrderSummaryData } from "@/types/order";
import { DollarSign, Package, Truck, TrendingUp } from "lucide-react";

interface OrderAccountingSummaryRowProps {
  summaryData?: OrderSummaryData | null;
  isLoading?: boolean;
  isError?: boolean;
}

const formatCurrency = (val: number | null | undefined): string => {
  if (val === null || val === undefined) return "--";
  return `৳${Number(val).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const OrderAccountingSummaryRow: React.FC<OrderAccountingSummaryRowProps> = ({
  summaryData,
  isLoading = false,
  isError = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl animate-pulse space-y-3"
          >
            <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  const salesVal = isError
    ? null
    : summaryData?.totalSales ?? summaryData?.grossSales ?? summaryData?.totalRevenue;
  const productCostVal = isError
    ? null
    : summaryData?.totalProductCost ?? summaryData?.productCost;
  const courierCostVal = isError
    ? null
    : summaryData?.totalCourierCost ?? summaryData?.courierCost ?? summaryData?.courierServiceCost;
  const netProfitVal = isError
    ? null
    : summaryData?.totalNetProfit ?? summaryData?.netProfit;

  const cards = [
    {
      title: "Total Sales",
      value: formatCurrency(salesVal),
      icon: DollarSign,
      colorBg: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Product Cost",
      value: formatCurrency(productCostVal),
      icon: Package,
      colorBg: "bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400",
    },
    {
      title: "Total Courier Cost",
      value: formatCurrency(courierCostVal),
      icon: Truck,
      colorBg: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Total Net Profit",
      value: formatCurrency(netProfitVal),
      icon: TrendingUp,
      colorBg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xs flex items-center justify-between transition-all hover:border-slate-200 dark:hover:border-slate-700"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {card.title}
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-slate-100 block tracking-tight">
                {card.value}
              </span>
            </div>
            <div className={`p-3 rounded-xl flex-shrink-0 ${card.colorBg}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
