"use client";

import React from "react";
import {
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  RotateCcw,
  DollarSign,
  TrendingDown,
} from "lucide-react";

interface PaymentSummaryCardsProps {
  counts: Record<string, number>;
  totalRevenue: number;
  totalRefunds: number;
  activeStatusFilter: string;
  onSelectStatusFilter: (status: string) => void;
  isLoading?: boolean;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT", currencyDisplay: "narrowSymbol",
  }).format(val || 0);
};

export const PaymentSummaryCards: React.FC<PaymentSummaryCardsProps> = ({
  counts,
  totalRevenue,
  totalRefunds,
  activeStatusFilter,
  onSelectStatusFilter,
  isLoading = false,
}) => {
  const cards = [
    {
      key: "ALL",
      label: "Total Payments",
      count: counts.total || 0,
      icon: CreditCard,
      color: "border-indigo-200 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300",
    },
    {
      key: "PENDING",
      label: "Pending",
      count: counts.PENDING || 0,
      icon: Clock,
      color: "border-amber-200 bg-amber-50/70 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300",
    },
    {
      key: "PAID",
      label: "Paid",
      count: counts.PAID || 0,
      icon: CheckCircle2,
      color: "border-emerald-200 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300",
    },
    {
      key: "FAILED",
      label: "Failed",
      count: counts.FAILED || 0,
      icon: AlertOctagon,
      color: "border-rose-200 bg-rose-50/70 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300",
    },
    {
      key: "CANCELLED",
      label: "Cancelled",
      count: counts.CANCELLED || 0,
      icon: XCircle,
      color: "border-slate-200 bg-slate-100/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300",
    },
    {
      key: "REFUNDED",
      label: "Refunded",
      count: counts.REFUNDED || 0,
      icon: RotateCcw,
      color: "border-purple-200 bg-purple-50/70 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300",
    },
  ];

  return (
    <div className="space-y-3">
      {/* Top Revenue Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block opacity-80">
              Total Revenue Collected (Paid)
            </span>
            {isLoading ? (
              <div className="h-8 w-32 rounded-md animate-shimmer mt-1" />
            ) : (
              <span className="text-3xl font-black mt-1 block">
                {formatCurrency(totalRevenue)}
              </span>
            )}
          </div>
          <DollarSign className="w-9 h-9 opacity-40 text-emerald-600 dark:text-emerald-400" />
        </div>

        <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/80 dark:bg-purple-950/50 text-purple-800 dark:text-purple-200 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block opacity-80">
              Total Refund Amount Issued
            </span>
            {isLoading ? (
              <div className="h-8 w-32 rounded-md animate-shimmer mt-1" />
            ) : (
              <span className="text-3xl font-black mt-1 block">
                {formatCurrency(totalRefunds)}
              </span>
            )}
          </div>
          <TrendingDown className="w-9 h-9 opacity-40 text-purple-600 dark:text-purple-400" />
        </div>
      </div>

      {/* Status KPI Filter Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          const isSelected = activeStatusFilter === c.key;

          return (
            <button
              key={c.key}
              onClick={() => onSelectStatusFilter(c.key)}
              className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${c.color} ${
                isSelected
                  ? "ring-2 ring-indigo-600 scale-[1.03] shadow-md font-bold"
                  : "hover:opacity-90"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                  {c.label}
                </span>
                <Icon className="w-4 h-4" />
              </div>
              {isLoading ? (
                <div className="h-7 w-12 rounded-md animate-shimmer mt-2" />
              ) : (
                <span className="text-2xl font-black mt-2">{c.count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

