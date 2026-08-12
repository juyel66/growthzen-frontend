"use client";

import React from "react";
import { CouponReportResponseData, ReportQueryParams, PaginationMeta } from "@/types/report";
import { formatMoney } from "@/utils/formatMoney";
import { ReportExportModal } from "./ReportExportModal";
import { ReportEmptyState } from "./ReportStates";
import { Ticket, CheckCircle2, Clock, DollarSign, Award, ChevronLeft, ChevronRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

interface CouponsReportViewProps {
  data?: CouponReportResponseData;
  meta?: PaginationMeta;
  queryParams: ReportQueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<ReportQueryParams>>;
}

const BAR_COLORS = ["#EC4899", "#8B5CF6", "#3B82F6", "#10B981", "#F59E0B"];

export const CouponsReportView: React.FC<CouponsReportViewProps> = ({
  data,
  meta,
  queryParams,
  setQueryParams,
}) => {
  if (!data || !data.summary) {
    return <ReportEmptyState title="No Coupon Data" message="No coupon usage records found." />;
  }

  const { summary, items } = data;

  const chartData = items
    .filter((c) => c.usageCount > 0)
    .slice(0, 5)
    .map((c) => ({
      code: c.code,
      usages: c.usageCount,
      discountGiven: c.totalDiscountGiven,
    }));

  const handlePageChange = (newPage: number) => {
    if (meta && newPage >= 1 && newPage <= meta.totalPages) {
      setQueryParams((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-pink-600" />
            Coupon Usage & Promotional Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active vouchers, redemptions, and total promotional discounts given
          </p>
        </div>
        <ReportExportModal reportType="coupons" queryParams={queryParams} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Coupons</p>
            <h4 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
              {summary.totalCoupons.toLocaleString()}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-pink-50 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400">
            <Ticket className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Active Coupons</p>
            <h4 className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {summary.activeCoupons.toLocaleString()}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Expired / Inactive</p>
            <h4 className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
              {summary.expiredCoupons.toLocaleString()}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Times Used</p>
            <h4 className="text-xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
              {summary.couponUsageCount.toLocaleString()}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
            <Award className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Discount Given</p>
            <h4 className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
              {formatMoney(summary.totalDiscountGiven)}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Usage Chart */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-pink-500" />
            Most Used Coupon Codes
          </h3>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="code" tick={{ fontSize: 11, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    name === "usages" ? `${val} redemptions` : formatMoney(val),
                    name === "usages" ? "Times Used" : "Total Discount",
                  ]}
                  contentStyle={{ backgroundColor: "#0F172A", color: "#F8FAFC", borderRadius: "12px", border: "none" }}
                />
                <Bar dataKey="usages" name="usages" radius={[8, 8, 0, 0]}>
                  {chartData.map((_, idx) => (
                    <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Coupons List ({meta?.total || items.length})
          </h3>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No coupon records match the query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Coupon Code</th>
                  <th className="py-3.5 px-4">Discount Type</th>
                  <th className="py-3.5 px-4">Discount Value</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Times Used</th>
                  <th className="py-3.5 px-4">Total Discount Given</th>
                  <th className="py-3.5 px-4">Starts At</th>
                  <th className="py-3.5 px-4">Expires At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {items.map((item) => (
                  <tr key={item.couponId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-pink-600 dark:text-pink-400 uppercase font-mono">{item.code}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.discountType}</td>
                    <td className="py-3.5 px-4 font-semibold">
                      {item.discountType === 'PERCENTAGE' ? `${item.discountValue}%` : formatMoney(item.discountValue)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md ${
                        item.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-purple-600">{item.usageCount}</td>
                    <td className="py-3.5 px-4 font-bold text-amber-600">{formatMoney(item.totalDiscountGiven)}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.startsAt}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.expiresAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing page <span className="font-semibold text-slate-800 dark:text-slate-200">{meta.page}</span> of{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">{meta.totalPages}</span> ({meta.total} total items)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page <= 1}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-200 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page >= meta.totalPages}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-200 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
