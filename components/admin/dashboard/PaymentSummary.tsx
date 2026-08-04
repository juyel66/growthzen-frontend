"use client";

import React from "react";
import Link from "next/link";
import { DashboardPaymentAnalytics } from "@/types/dashboard";
import { CreditCard, CheckCircle2, Clock, AlertOctagon, RotateCcw } from "lucide-react";

interface PaymentSummaryProps {
  paymentAnalytics?: DashboardPaymentAnalytics;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  paymentAnalytics,
}) => {
  const items = [
    {
      title: "Paid",
      count: paymentAnalytics?.paidPayments || 0,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
    },
    {
      title: "Pending",
      count: paymentAnalytics?.pendingPayments || 0,
      icon: Clock,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800",
    },
    {
      title: "Failed",
      count: paymentAnalytics?.failedPayments || 0,
      icon: AlertOctagon,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800",
    },
    {
      title: "Refunded",
      count: paymentAnalytics?.refundedPayments || 0,
      icon: RotateCcw,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Payment Summary
          </h3>
        </div>

        <Link
          href="/admin-dashboard/payments"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          View Payments
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex flex-col justify-between ${item.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                  {item.title}
                </span>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-lg font-black mt-1.5">{item.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
