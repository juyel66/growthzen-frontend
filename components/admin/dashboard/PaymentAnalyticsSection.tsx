"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { DashboardPaymentAnalytics } from "@/types/dashboard";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  AlertOctagon,
  RotateCcw,
} from "lucide-react";

interface PaymentAnalyticsSectionProps {
  paymentAnalytics?: DashboardPaymentAnalytics;
}

const STATUS_COLORS: Record<string, string> = {
  PAID: "#10b981",
  PENDING: "#f59e0b",
  FAILED: "#ef4444",
  CANCELLED: "#64748b",
  REFUNDED: "#8b5cf6",
};

export const PaymentAnalyticsSection: React.FC<PaymentAnalyticsSectionProps> = ({
  paymentAnalytics,
}) => {
  const statusList = paymentAnalytics?.paymentsByStatus || [];
  const methodList = paymentAnalytics?.paymentsByMethod || [];

  const statusCards = [
    {
      title: "Paid Payments",
      count: paymentAnalytics?.paidPayments || 0,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
    },
    {
      title: "Pending",
      count: paymentAnalytics?.pendingPayments || 0,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800",
    },
    {
      title: "Failed",
      count: paymentAnalytics?.failedPayments || 0,
      icon: AlertOctagon,
      color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800",
    },
    {
      title: "Cancelled",
      count: paymentAnalytics?.cancelledPayments || 0,
      icon: XCircle,
      color: "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
    },
    {
      title: "Refunded",
      count: paymentAnalytics?.refundedPayments || 0,
      icon: RotateCcw,
      color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-500" />
            Payment Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comprehensive status breakdown & payment gateway distribution
          </p>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statusCards.map((sc, idx) => {
          const Icon = sc.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex flex-col justify-between ${sc.color} transition-transform hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                  {sc.title}
                </span>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xl font-black mt-2">{sc.count}</span>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Pie Chart + Method Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Status Pie Chart */}
        <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
            Payment Status Distribution
          </h3>
          <div className="h-60 w-full">
            {statusList.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusList as any[]}
                    dataKey="totalPayments"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={40}
                    paddingAngle={3}
                    label={({ name, percent }: { name?: string; percent?: number }) =>
                      `${name || ""} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {statusList.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.status] || "#3b82f6"}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [val, "Payments"]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No payment status data
              </div>
            )}
          </div>
        </div>

        {/* Payment Method Breakdown Cards */}
        <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">
            Payment Method Breakdown
          </h3>
          <div className="space-y-3">
            {methodList.length > 0 ? (
              methodList.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {m.method}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                    {m.totalPayments} Payments
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No payment method breakdown available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

