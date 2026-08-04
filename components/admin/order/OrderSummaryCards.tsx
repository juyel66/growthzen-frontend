"use client";

import React from "react";
import { OrderStatus } from "@/types/order";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  RefreshCw,
  PackageCheck,
  Truck,
  Package,
  XCircle,
  RotateCcw,
} from "lucide-react";

interface OrderSummaryCardsProps {
  counts: Record<string, number>;
  activeStatusFilter: string;
  onSelectStatusFilter: (status: string) => void;
}

export const OrderSummaryCards: React.FC<OrderSummaryCardsProps> = ({
  counts,
  activeStatusFilter,
  onSelectStatusFilter,
}) => {
  const cards = [
    {
      key: "ALL",
      label: "Total Orders",
      count: counts.total || 0,
      icon: ShoppingBag,
      color: "border-blue-200 bg-blue-50/70 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300",
    },
    {
      key: "PENDING",
      label: "Pending",
      count: counts.PENDING || 0,
      icon: Clock,
      color: "border-amber-200 bg-amber-50/70 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300",
    },
    {
      key: "CONFIRMED",
      label: "Confirmed",
      count: counts.CONFIRMED || 0,
      icon: CheckCircle2,
      color: "border-sky-200 bg-sky-50/70 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300",
    },
    {
      key: "PROCESSING",
      label: "Processing",
      count: counts.PROCESSING || 0,
      icon: RefreshCw,
      color: "border-indigo-200 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300",
    },
    {
      key: "PACKED",
      label: "Packed",
      count: counts.PACKED || 0,
      icon: PackageCheck,
      color: "border-violet-200 bg-violet-50/70 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300",
    },
    {
      key: "SHIPPED",
      label: "Shipped",
      count: counts.SHIPPED || 0,
      icon: Truck,
      color: "border-purple-200 bg-purple-50/70 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300",
    },
    {
      key: "DELIVERED",
      label: "Delivered",
      count: counts.DELIVERED || 0,
      icon: Package,
      color: "border-emerald-200 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300",
    },
    {
      key: "CANCELLED",
      label: "Cancelled",
      count: counts.CANCELLED || 0,
      icon: XCircle,
      color: "border-rose-200 bg-rose-50/70 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300",
    },
    {
      key: "RETURNED",
      label: "Returned",
      count: counts.RETURNED || 0,
      icon: RotateCcw,
      color: "border-slate-200 bg-slate-100/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = activeStatusFilter === c.key;

        return (
          <button
            key={c.key}
            onClick={() => onSelectStatusFilter(c.key)}
            className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${c.color} ${
              isSelected ? "ring-2 ring-blue-600 scale-[1.03] shadow-md font-bold" : "hover:opacity-90"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                {c.label}
              </span>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span className="text-xl font-black mt-2">{c.count}</span>
          </button>
        );
      })}
    </div>
  );
};
