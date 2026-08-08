"use client";

import React from "react";
import Link from "next/link";
import { DashboardCouponSummary } from "@/types/dashboard";
import { useGetCouponsQuery } from "@/services/couponApi";
import { Ticket, Sparkles, TrendingUp, Award, Clock } from "lucide-react";

interface CouponSummaryProps {
  couponSummary?: DashboardCouponSummary;
}

export const CouponSummary: React.FC<CouponSummaryProps> = ({
  couponSummary,
}) => {
  const { data: coupons = [], isLoading } = useGetCouponsQuery();

  const totalCoupons = couponSummary?.totalCoupons ?? coupons.length;

  const totalUsage = coupons.reduce(
    (sum, c) => sum + (c.usageCount ?? c._count?.usages ?? 0),
    0
  );

  const activeCouponsCount = coupons.filter((c) => c.isActive).length;

  const mostUsedCoupon = [...coupons].sort(
    (a, b) => (b.usageCount ?? b._count?.usages ?? 0) - (a.usageCount ?? a._count?.usages ?? 0)
  )[0];

  const recentCoupons = [...coupons]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 4);

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-rose-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Coupon & Promotions Analytics
          </h3>
        </div>

        <Link
          href="/admin-dashboard/coupons"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Manage Coupons →
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Coupons */}
        <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-800/60 bg-rose-50/60 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
              Total Coupons
            </span>
            <span className="text-xl font-black mt-0.5 block">{totalCoupons}</span>
            <span className="text-[10px] font-medium opacity-80">{activeCouponsCount} Active</span>
          </div>
          <div className="p-2.5 bg-rose-500/10 rounded-xl">
            <Sparkles className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
        </div>

        {/* Total Usage Count */}
        <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
              Total Coupon Usage
            </span>
            <span className="text-xl font-black mt-0.5 block">{totalUsage}</span>
            <span className="text-[10px] font-medium opacity-80">Applications</span>
          </div>
          <div className="p-2.5 bg-blue-500/10 rounded-xl">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Most Used Coupon */}
        <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
              Most Used Coupon
            </span>
            <span className="text-sm font-black font-mono mt-0.5 block truncate uppercase">
              {mostUsedCoupon?.code || "N/A"}
            </span>
            <span className="text-[10px] font-medium opacity-80">
              {mostUsedCoupon ? `${mostUsedCoupon.usageCount ?? mostUsedCoupon._count?.usages ?? 0} uses` : "No usage yet"}
            </span>
          </div>
          <div className="p-2.5 bg-emerald-500/10 rounded-xl shrink-0">
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Recent Coupon Usage List */}
      {recentCoupons.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Recent Coupons Overview
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recentCoupons.map((c) => {
              const uses = c.usageCount ?? c._count?.usages ?? 0;
              const isFixed = c.discountType?.toUpperCase() === "FIXED";

              return (
                <div
                  key={c.id}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 flex items-center justify-between text-xs"
                >
                  <div className="flex flex-col">
                    <span className="font-mono font-bold text-slate-900 dark:text-white uppercase">
                      {c.code}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {isFixed ? `৳${c.discountValue}` : `${c.discountValue}%`} OFF
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[10px] font-extrabold text-slate-700 dark:text-slate-300">
                    {uses} {uses === 1 ? "use" : "uses"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

