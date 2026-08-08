"use client";

import React from "react";
import Link from "next/link";
import { DashboardShippingSummary } from "@/types/dashboard";
import { Truck, CheckCircle, XCircle } from "lucide-react";

interface ShippingSummaryProps {
  shippingSummary?: DashboardShippingSummary;
}

export const ShippingSummary: React.FC<ShippingSummaryProps> = ({
  shippingSummary,
}) => {
  const activeCount = shippingSummary?.activeShippingMethods || 0;
  const inactiveCount = shippingSummary?.inactiveShippingMethods || 0;
  const totalCount = shippingSummary?.totalShippingMethods || activeCount + inactiveCount;

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-sky-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Shipping Methods
          </h3>
        </div>

        <Link
          href="/admin-dashboard/shipping"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Manage Shipping
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Active Methods
            </span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <span className="text-xl font-black mt-1.5 block">{activeCount}</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Inactive Methods
            </span>
            <XCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span className="text-xl font-black mt-1.5 block">{inactiveCount}</span>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400">
        Total configured shipping channels: <span className="font-bold">{totalCount}</span>
      </p>
    </div>
  );
};

