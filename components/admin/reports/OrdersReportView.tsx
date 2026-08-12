"use client";

import React from "react";
import { OrderReportResponseData, ReportQueryParams, PaginationMeta } from "@/types/report";
import { formatMoney } from "@/utils/formatMoney";
import { ReportExportModal } from "./ReportExportModal";
import { ReportEmptyState } from "./ReportStates";
import { ShoppingCart, CheckCircle2, Clock, Truck, XCircle, RotateCcw, ChevronLeft, ChevronRight, Package, Box } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface OrdersReportViewProps {
  data?: OrderReportResponseData;
  meta?: PaginationMeta;
  queryParams: ReportQueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<ReportQueryParams>>;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#F59E0B",
  CONFIRMED: "#3B82F6",
  PROCESSING: "#6366F1",
  PACKED: "#8B5CF6",
  SHIPPED: "#06B6D4",
  DELIVERED: "#10B981",
  CANCELLED: "#EF4444",
  RETURNED: "#F43F5E",
};

export const OrdersReportView: React.FC<OrdersReportViewProps> = ({
  data,
  meta,
  queryParams,
  setQueryParams,
}) => {
  if (!data || !data.summary) {
    return <ReportEmptyState title="No Order Data" message="No orders found for the selected status or date range." />;
  }

  const { summary, items } = data;

  const chartData = [
    { name: "Pending", value: summary.pendingOrders, color: STATUS_COLORS.PENDING },
    { name: "Confirmed", value: summary.confirmedOrders, color: STATUS_COLORS.CONFIRMED },
    { name: "Processing", value: summary.processingOrders, color: STATUS_COLORS.PROCESSING },
    { name: "Packed", value: summary.packedOrders, color: STATUS_COLORS.PACKED },
    { name: "Shipped", value: summary.shippedOrders, color: STATUS_COLORS.SHIPPED },
    { name: "Delivered", value: summary.deliveredOrders, color: STATUS_COLORS.DELIVERED },
    { name: "Cancelled", value: summary.cancelledOrders, color: STATUS_COLORS.CANCELLED },
    { name: "Returned", value: summary.returnedOrders, color: STATUS_COLORS.RETURNED },
  ].filter((item) => item.value > 0);

  const handlePageChange = (newPage: number) => {
    if (meta && newPage >= 1 && newPage <= meta.totalPages) {
      setQueryParams((prev) => ({ ...prev, page: newPage }));
    }
  };

  const getStatusBadge = (status: string) => {
    const color = STATUS_COLORS[status] || "#64748B";
    return (
      <span
        className="px-2.5 py-0.5 text-[11px] font-bold rounded-lg border"
        style={{
          backgroundColor: `${color}15`,
          color: color,
          borderColor: `${color}40`,
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            Order Analytics & Status Distribution
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Complete lifecycle breakdown of customer orders
          </p>
        </div>
        <ReportExportModal reportType="orders" queryParams={queryParams} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Orders", count: summary.totalOrders, icon: ShoppingCart, bg: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400" },
          { label: "Pending", count: summary.pendingOrders, icon: Clock, bg: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400" },
          { label: "Confirmed", count: summary.confirmedOrders, icon: CheckCircle2, bg: "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400" },
          { label: "Processing", count: summary.processingOrders, icon: Package, bg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400" },
          { label: "Packed", count: summary.packedOrders, icon: Box, bg: "bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400" },
          { label: "Shipped", count: summary.shippedOrders, icon: Truck, bg: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400" },
          { label: "Delivered", count: summary.deliveredOrders, icon: CheckCircle2, bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400" },
          { label: "Cancelled", count: summary.cancelledOrders, icon: XCircle, bg: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400" },
          { label: "Returned", count: summary.returnedOrders, icon: RotateCcw, bg: "bg-pink-50 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400" },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{card.label}</p>
                <h4 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
                  {card.count.toLocaleString()}
                </h4>
              </div>
              <div className={`p-2.5 rounded-xl ${card.bg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pie Chart Status Distribution */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Order Status Share Distribution
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} orders`, name]}
                  contentStyle={{ backgroundColor: "#0F172A", color: "#F8FAFC", borderRadius: "12px", border: "none" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Order Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Orders List ({meta?.total || items.length})
          </h3>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No order records match the current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Order Code</th>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Payable Amount</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {items.map((item) => (
                  <tr key={item.orderId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-indigo-600 dark:text-indigo-400">{item.orderCode}</td>
                    <td className="py-3.5 px-4 font-semibold">{item.customerName}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.customerEmail}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.customerPhone || "N/A"}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatMoney(item.payableAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{item.paymentMethod || "N/A"}</td>
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
