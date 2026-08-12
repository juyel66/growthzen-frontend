"use client";

import React from "react";
import { CustomerReportResponseData, ReportQueryParams, PaginationMeta } from "@/types/report";
import { formatMoney } from "@/utils/formatMoney";
import { ReportExportModal } from "./ReportExportModal";
import { ReportEmptyState } from "./ReportStates";
import { Users, UserPlus, UserCheck, Crown, ChevronLeft, ChevronRight } from "lucide-react";
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

interface CustomersReportViewProps {
  data?: CustomerReportResponseData;
  meta?: PaginationMeta;
  queryParams: ReportQueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<ReportQueryParams>>;
}

const BAR_COLORS = ["#3B82F6", "#10B981", "#6366F1", "#8B5CF6", "#EC4899"];

export const CustomersReportView: React.FC<CustomersReportViewProps> = ({
  data,
  meta,
  queryParams,
  setQueryParams,
}) => {
  if (!data || !data.summary) {
    return <ReportEmptyState title="No Customer Data" message="No customer data found matching the selected criteria." />;
  }

  const { summary, items } = data;

  const topSpendersChartData = summary.topCustomers.map((c) => ({
    name: c.name.length > 12 ? `${c.name.slice(0, 12)}...` : c.name,
    fullName: c.name,
    spent: c.totalSpent,
    orders: c.totalOrders,
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
            <Users className="w-5 h-5 text-blue-600" />
            Customer Performance & Spend Segmentation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Registered customer acquisition, active spenders, and order history
          </p>
        </div>
        <ReportExportModal reportType="customers" queryParams={queryParams} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Customers & Resellers</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
              {summary.totalCustomers.toLocaleString()}
            </h3>
            <span className="inline-block mt-1 text-[11px] font-medium text-slate-400">Registered Accounts</span>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">New Customers</p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {summary.newCustomers.toLocaleString()}
            </h3>
            <span className="inline-block mt-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
              Joined In Date Range
            </span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <UserPlus className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Spenders</p>
            <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {summary.activeCustomers.toLocaleString()}
            </h3>
            <span className="inline-block mt-1 text-[11px] font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
              Placed Orders
            </span>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Top Spender</p>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 line-clamp-1" title={summary.topCustomers[0]?.name}>
              {summary.topCustomers[0]?.name || "N/A"}
            </h3>
            <span className="inline-block mt-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
              {formatMoney(summary.topCustomers[0]?.totalSpent || 0)}
            </span>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl">
            <Crown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Top Customers Chart */}
      {topSpendersChartData.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" />
              Highest Spending Customers (Delivered Orders)
            </h3>
            <span className="text-xs text-slate-400 font-medium">Top Spenders</span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSpendersChartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} interval={0} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={(val) => `৳${val}`} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    name === "spent" ? formatMoney(val) : `${val} orders`,
                    name === "spent" ? "Total Spent" : "Total Orders",
                  ]}
                  contentStyle={{ backgroundColor: "#0F172A", color: "#F8FAFC", borderRadius: "12px", border: "none" }}
                />
                <Bar dataKey="spent" name="spent" radius={[8, 8, 0, 0]}>
                  {topSpendersChartData.map((_, idx) => (
                    <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Customers Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Customers List ({meta?.total || items.length})
          </h3>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No customers match the current query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Total Orders</th>
                  <th className="py-3.5 px-4">Delivered</th>
                  <th className="py-3.5 px-4">Total Spent</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {items.map((item) => (
                  <tr key={item.userId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">{item.name}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {item.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md ${
                        item.isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      }`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold">{item.totalOrders}</td>
                    <td className="py-3.5 px-4 font-semibold text-blue-600">{item.deliveredOrders}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatMoney(item.totalSpent)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{item.registeredAt}</td>
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
