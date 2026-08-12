"use client";

import React from "react";
import { RevenueReportResponseData, ReportQueryParams, PaginationMeta } from "@/types/report";
import { formatMoney } from "@/utils/formatMoney";
import { ReportExportModal } from "./ReportExportModal";
import { ReportEmptyState } from "./ReportStates";
import { DollarSign, Calendar, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface RevenueReportViewProps {
  data?: RevenueReportResponseData;
  meta?: PaginationMeta;
  queryParams: ReportQueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<ReportQueryParams>>;
}

export const RevenueReportView: React.FC<RevenueReportViewProps> = ({
  data,
  meta,
  queryParams,
  setQueryParams,
}) => {
  if (!data || !data.summary) {
    return <ReportEmptyState title="No Revenue Data" message="No revenue records found for the selected period." />;
  }

  const { summary, breakdown, items } = data;

  const handlePageChange = (newPage: number) => {
    if (meta && newPage >= 1 && newPage <= meta.totalPages) {
      setQueryParams((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Revenue Analytics & Financial Breakdown
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Strictly DELIVERED orders with PAID status
          </p>
        </div>
        <ReportExportModal reportType="revenue" queryParams={queryParams} />
      </div>

      {/* Revenue Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          { label: "Today's Revenue", amount: summary.todayRevenue, color: "text-blue-600 dark:text-blue-400" },
          { label: "Yesterday", amount: summary.yesterdayRevenue, color: "text-indigo-600 dark:text-indigo-400" },
          { label: "Last 7 Days", amount: summary.weeklyRevenue, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "This Month", amount: summary.monthlyRevenue, color: "text-teal-600 dark:text-teal-400" },
          { label: "This Year", amount: summary.yearlyRevenue, color: "text-amber-600 dark:text-amber-400" },
          { label: "Filtered Range", amount: summary.customDateRangeRevenue, color: "text-purple-600 dark:text-purple-400" },
        ].map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              {card.label}
            </span>
            <h4 className={`text-lg font-black tracking-tight ${card.color}`}>
              {formatMoney(card.amount)}
            </h4>
          </div>
        ))}
      </div>

      {/* Revenue Breakdown Area Chart */}
      {breakdown && breakdown.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Daily Revenue Timeline & Delivered Order Volume
            </h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
              {breakdown.length} Timeline Points
            </span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={breakdown} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={(val) => `৳${val}`} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    name === "revenue" ? formatMoney(val) : val,
                    name === "revenue" ? "Revenue" : "Delivered Orders",
                  ]}
                  contentStyle={{ backgroundColor: "#0F172A", color: "#F8FAFC", borderRadius: "12px", border: "none" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Revenue Items Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Revenue Transactions ({meta?.total || items.length})
          </h3>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No revenue records match the criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Order Code</th>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Customer Email</th>
                  <th className="py-3.5 px-4">Revenue Amount</th>
                  <th className="py-3.5 px-4">Delivered Date</th>
                  <th className="py-3.5 px-4">Order Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {items.map((item) => (
                  <tr key={item.orderId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">{item.orderCode}</td>
                    <td className="py-3.5 px-4 font-semibold">{item.customerName}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.customerEmail}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatMoney(item.payableAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{item.deliveredAt || "N/A"}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.createdAt}</td>
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
