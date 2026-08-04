"use client";

import React from "react";
import Link from "next/link";
import { DashboardCouponSummary } from "@/types/dashboard";
import { Ticket, Sparkles } from "lucide-react";

interface CouponSummaryProps {
  couponSummary?: DashboardCouponSummary;
}

export const CouponSummary: React.FC<CouponSummaryProps> = ({
  couponSummary,
}) => {
  const total = couponSummary?.totalCoupons || 0;

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-rose-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Promotions & Coupons
          </h3>
        </div>

        <Link
          href="/admin-dashboard/coupons"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Manage Coupons
        </Link>
      </div>

      <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
            Total Coupons Created
          </span>
          <span className="text-2xl font-black mt-1 block">{total}</span>
        </div>

        <div className="p-3 bg-rose-500/10 rounded-xl">
          <Sparkles className="w-6 h-6 text-rose-600 dark:text-rose-400" />
        </div>
      </div>
    </div>
  );
};
