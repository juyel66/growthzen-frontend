"use client";

import React from "react";
import { PaymentReportResponseData, ReportQueryParams, PaginationMeta } from "@/types/report";
import { formatMoney } from "@/utils/formatMoney";
import { ReportExportModal } from "./ReportExportModal";
import { ReportEmptyState } from "./ReportStates";
import { CreditCard, CheckCircle2, Clock, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PaymentsReportViewProps {
  data?: PaymentReportResponseData;
  meta?: PaginationMeta;
  queryParams: ReportQueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<ReportQueryParams>>;
}

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  PAID: "#10B981",
  PENDING: "#F59E0B",
  FAILED: "#EF4444",
  CANCELLED: "#64748B",
  REFUNDED: "#8B5CF6",
};

export const PaymentsReportView: React.FC<PaymentsReportViewProps> = ({
  data,
  meta,
  queryParams,
  setQueryParams,
}) => {
  if (!data || !data.summary) {
    return <ReportEmptyState title="No Payment Data" message="No payment transactions found for the selected options." />;
  }

  const { summary, items } = data;

  const chartData = [
    { name: "Paid", value: summary.paidPayments, color: PAYMENT_STATUS_COLORS.PAID },
    { name: "Pending", value: summary.pendingPayments, color: PAYMENT_STATUS_COLORS.PENDING },
    { name: "Failed", value: summary.failedPayments, color: PAYMENT_STATUS_COLORS.FAILED },
    { name: "Refunded", value: summary.refundedPayments, color: PAYMENT_STATUS_COLORS.REFUNDED },
  ].filter((d) => d.value > 0);

  const handlePageChange = (newPage: number) => {
    if (meta && newPage >= 1 && newPage <= meta.totalPages) {
      setQueryParams((prev) => ({ ...prev, page: newPage }));
    }
  };

  const getStatusBadge = (status: string) => {
    const color = PAYMENT_STATUS_COLORS[status] || "#64748B";
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
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            Payment Gateway & Method Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            COD, bKash, Nagad transaction verification and payment statuses
          </p>
        </div>
        <ReportExportModal reportType="payments" queryParams={queryParams} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Payments</p>
            <h4 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
              {summary.totalPayments.toLocaleString()}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Paid Payments</p>
            <h4 className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {summary.paidPayments.toLocaleString()}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Pending</p>
            <h4 className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
              {summary.pendingPayments.toLocaleString()}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Failed</p>
            <h4 className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
              {summary.failedPayments.toLocaleString()}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Refunded</p>
            <h4 className="text-xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
              {summary.refundedPayments.toLocaleString()}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
            <RefreshCw className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Payment Status Distribution Chart */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Payment Status Distribution
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} payments`, name]}
                  contentStyle={{ backgroundColor: "#0F172A", color: "#F8FAFC", borderRadius: "12px", border: "none" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Payment Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Payment Records ({meta?.total || items.length})
          </h3>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No payment transactions match the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Order Code</th>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Paid Amount</th>
                  <th className="py-3.5 px-4">Transaction ID</th>
                  <th className="py-3.5 px-4">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {items.map((item) => (
                  <tr key={item.paymentId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">{item.orderCode}</td>
                    <td className="py-3.5 px-4 font-semibold">{item.customerName}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.customerEmail}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                        {item.method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatMoney(item.paidAmount ?? 0)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">{item.transactionId || "N/A"}</td>
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
