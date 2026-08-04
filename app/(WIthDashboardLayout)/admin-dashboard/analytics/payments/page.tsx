"use client";

import React from "react";
import {
  useGetDashboardPaymentsQuery,
  useGetDashboardChartsQuery,
} from "@/services/dashboardApi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertOctagon,
  RotateCcw,
  RefreshCw,
  AlertTriangle,
  Wallet,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PAID: "#10b981",
  PENDING: "#f59e0b",
  FAILED: "#ef4444",
  CANCELLED: "#64748b",
  REFUNDED: "#8b5cf6",
};

export default function PaymentAnalyticsPage() {
  const payQuery = useGetDashboardPaymentsQuery(undefined, { pollingInterval: 60000 });
  const chartsQuery = useGetDashboardChartsQuery(undefined, { pollingInterval: 60000 });

  const pay = payQuery.data;
  const paymentChart = chartsQuery.data?.paymentChart || [];

  const statusList = pay?.paymentsByStatus || [];
  const methodList = pay?.paymentsByMethod || [];

  const isLoading = payQuery.isLoading || chartsQuery.isLoading;
  const isFetching = payQuery.isFetching || chartsQuery.isFetching;
  const isError = payQuery.isError || chartsQuery.isError;

  const statusCards = [
    { title: "Paid Payments", count: pay?.paidPayments || 0, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200" },
    { title: "Pending Payments", count: pay?.pendingPayments || 0, icon: Clock, color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200" },
    { title: "Failed Payments", count: pay?.failedPayments || 0, icon: AlertOctagon, color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200" },
    { title: "Refunded Payments", count: pay?.refundedPayments || 0, icon: RotateCcw, color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200" },
  ];

  if (isLoading) {
    return <div className="p-6 animate-pulse space-y-6"><div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" /><div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" /></div>;
  }

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Payment Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Payment gateway distribution, settlement audit logs & status metrics
          </p>
        </div>

        <button
          onClick={() => { payQuery.refetch(); chartsQuery.refetch(); }}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {isError && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-rose-600" /><span>Failed to load payment analytics.</span></div>
          <button onClick={() => { payQuery.refetch(); chartsQuery.refetch(); }} className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs">Retry</button>
        </div>
      )}

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statusCards.map((sc, idx) => {
          const Icon = sc.icon;
          return (
            <div key={idx} className={`p-4 rounded-2xl border ${sc.color} flex flex-col justify-between`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">{sc.title}</span>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-2xl font-black mt-3">{sc.count}</span>
            </div>
          );
        })}
      </div>

      {/* Main Payment Status Trend Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-500" /> Transaction Settlement Trends
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={paymentChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="label" fontSize={11} stroke="#94a3b8" />
              <YAxis fontSize={11} stroke="#94a3b8" />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="paidPayments" name="Paid" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pendingPayments" name="Pending" fill="#fbbf24" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failedPayments" name="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Status Pie Chart & Method Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-500" /> Payment Status Distribution
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusList as any[]}
                  dataKey="totalPayments"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={3}
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name || ""} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusList.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || "#3b82f6"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-indigo-500" /> Payment Gateway & Method Breakdown
          </h4>
          <div className="space-y-3">
            {methodList.length > 0 ? (
              methodList.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-indigo-600" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{m.method}</span>
                  </div>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{m.totalPayments} Payments</span>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">No method breakdown available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
