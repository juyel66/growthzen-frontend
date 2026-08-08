"use client";

import React from "react";
import { FileText, DollarSign, Calendar, TrendingUp } from "lucide-react";
import { InvoiceSummaryData } from "@/types/invoice";

interface InvoiceSummaryCardsProps {
  summary?: InvoiceSummaryData;
  isLoading?: boolean;
}

const formatNumber = (val: number | null | undefined): string => {
  if (val === null || val === undefined) return "0";
  return new Intl.NumberFormat("en-US").format(val);
};

const formatCurrency = (val: number | null | undefined): string => {
  if (val === null || val === undefined) return "৳0";
  return `৳${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(val)}`;
};

export const InvoiceSummaryCards: React.FC<InvoiceSummaryCardsProps> = ({
  summary,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl animate-pulse space-y-3"
          >
            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-7 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  const totalInvoices = summary?.totalInvoices ?? 0;
  const totalSales = summary?.totalSales ?? summary?.totalGrandTotal ?? 0;
  const todayInvoices = summary?.todayInvoices ?? 0;
  const todaySales = summary?.todaySales ?? summary?.todayGrandTotal ?? 0;

  const cards = [
    {
      label: "Total Invoices",
      value: formatNumber(totalInvoices),
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200",
    },
    {
      label: "Total Sales",
      value: formatCurrency(totalSales),
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200",
    },
    {
      label: "Today's Invoices",
      value: formatNumber(todayInvoices),
      icon: Calendar,
      color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200",
    },
    {
      label: "Today's Sales",
      value: formatCurrency(todaySales),
      icon: TrendingUp,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {card.label}
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100 block tracking-tight">
                {card.value}
              </span>
            </div>

            <div className={`p-3 rounded-xl border flex-shrink-0 ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
