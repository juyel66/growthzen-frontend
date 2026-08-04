"use client";

import React from "react";
import Link from "next/link";
import { DashboardOrderAnalytics } from "@/types/dashboard";
import {
  Clock,
  CheckCircle2,
  RefreshCw,
  PackageCheck,
  Truck,
  Package,
  XCircle,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";

interface OrderSummaryCardsProps {
  orderAnalytics?: DashboardOrderAnalytics;
}

export const OrderSummaryCards: React.FC<OrderSummaryCardsProps> = ({
  orderAnalytics,
}) => {
  const cards = [
    {
      label: "Pending",
      val: orderAnalytics?.pendingOrders || 0,
      icon: Clock,
      color: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    },
    {
      label: "Confirmed",
      val: orderAnalytics?.confirmedOrders || 0,
      icon: CheckCircle2,
      color: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    },
    {
      label: "Processing",
      val: orderAnalytics?.processingOrders || 0,
      icon: RefreshCw,
      color: "bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800",
    },
    {
      label: "Packed",
      val: orderAnalytics?.packedOrders || 0,
      icon: PackageCheck,
      color: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
    },
    {
      label: "Shipped",
      val: orderAnalytics?.shippedOrders || 0,
      icon: Truck,
      color: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    },
    {
      label: "Delivered",
      val: orderAnalytics?.deliveredOrders || 0,
      icon: Package,
      color: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    },
    {
      label: "Cancelled",
      val: orderAnalytics?.cancelledOrders || 0,
      icon: XCircle,
      color: "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800",
    },
    {
      label: "Returned",
      val: orderAnalytics?.returnedOrders || 0,
      icon: RotateCcw,
      color: "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Order Fulfillment Summary
          </h3>
        </div>
        <Link
          href="/admin-dashboard/orders"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Manage Orders
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex flex-col justify-between ${c.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                  {c.label}
                </span>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-lg font-black mt-1">{c.val}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
