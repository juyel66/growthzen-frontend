"use client";

import React from "react";
import Link from "next/link";
import { DashboardRecentOrderItem } from "@/types/dashboard";
import { ShoppingBag, ArrowRight, ExternalLink } from "lucide-react";

interface RecentOrdersTableProps {
  orders?: DashboardRecentOrderItem[];
}

const getStatusBadge = (status: string | null) => {
  if (!status) return null;
  const s = status.toUpperCase();

  let color = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  if (["DELIVERED", "PAID", "COMPLETED"].includes(s)) {
    color = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800";
  } else if (["PENDING", "PROCESSING", "PACKED", "CONFIRMED"].includes(s)) {
    color = "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-800";
  } else if (["SHIPPED"].includes(s)) {
    color = "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/60 dark:border-blue-800";
  } else if (["CANCELLED", "FAILED"].includes(s)) {
    color = "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60 dark:border-rose-800";
  }

  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border tracking-wide uppercase ${color}`}>
      {s}
    </span>
  );
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT", currencyDisplay: "narrowSymbol",
  }).format(val || 0);
};

const formatDate = (dateStr: string | Date) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
  orders = [],
}) => {
  const latest5 = orders.slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Recent Orders
          </h3>
        </div>

        <Link
          href="/admin-dashboard/orders"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="p-3">Order Number</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {latest5.length > 0 ? (
              latest5.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-3 font-bold text-blue-600 dark:text-blue-400">
                    {item.orderNumber}
                  </td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                    {item.customerName || "Guest Customer"}
                  </td>
                  <td className="p-3 font-bold">{formatCurrency(item.totalAmount)}</td>
                  <td className="p-3 text-slate-500">{item.paymentMethod || "COD"}</td>
                  <td className="p-3">{getStatusBadge(item.orderStatus)}</td>
                  <td className="p-3 text-slate-500">{formatDate(item.createdAt)}</td>
                  <td className="p-3 text-right">
                    <Link
                      href="/admin-dashboard/orders"
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">
                  No recent orders available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

