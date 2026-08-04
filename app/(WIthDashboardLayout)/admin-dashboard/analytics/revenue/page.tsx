"use client";

import React, { useState } from "react";
import { DashboardRangeKey } from "@/types/dashboard";
import {
  useGetDashboardRevenueQuery,
  useGetDashboardChartsQuery,
} from "@/services/dashboardApi";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Filter,
  RefreshCw,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";

const RANGE_OPTIONS: { label: string; value: DashboardRangeKey }[] = [
  { label: "Today", value: "TODAY" },
  { label: "Yesterday", value: "YESTERDAY" },
  { label: "Last 7 Days", value: "LAST_7_DAYS" },
  { label: "Last 30 Days", value: "LAST_30_DAYS" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Yearly", value: "YEARLY" },
  { label: "Custom Range", value: "CUSTOM" },
];

const formatCurrency = (val: number | undefined) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(val || 0);
};

export default function RevenueAnalyticsPage() {
  const [range, setRange] = useState<DashboardRangeKey>("LAST_30_DAYS");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const queryParams = {
    range,
    from: range === "CUSTOM" && fromDate ? fromDate : undefined,
    to: range === "CUSTOM" && toDate ? toDate : undefined,
  };

  const revenueQuery = useGetDashboardRevenueQuery(queryParams, { pollingInterval: 60000 });
  const chartsQuery = useGetDashboardChartsQuery(queryParams, { pollingInterval: 60000 });

  const rev = revenueQuery.data;
  const chartData = chartsQuery.data?.revenueChart || [];

  const isLoading = revenueQuery.isLoading || chartsQuery.isLoading;
  const isFetching = revenueQuery.isFetching || chartsQuery.isFetching;
  const isError = revenueQuery.isError || chartsQuery.isError;

  const cards = [
    { label: "Total Revenue", val: formatCurrency(rev?.totalRevenue), color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200" },
    { label: "Selected Range Revenue", val: formatCurrency(rev?.selectedRevenue), color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200" },
    { label: "Today's Revenue", val: formatCurrency(rev?.todayRevenue), color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200" },
    { label: "Yesterday's Revenue", val: formatCurrency(rev?.yesterdayRevenue), color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200" },
    { label: "Weekly Revenue", val: formatCurrency(rev?.weeklyRevenue), color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200" },
    { label: "Monthly Revenue", val: formatCurrency(rev?.monthlyRevenue), color: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200" },
    { label: "Yearly Revenue", val: formatCurrency(rev?.yearlyRevenue), color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border-teal-200" },
  ];

  if (isLoading) {
    return <div className="p-6 animate-pulse space-y-6"><div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" /><div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" /></div>;
  }

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Revenue Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Detailed revenue breakdowns, time-series growth trends & sales statistics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <Filter className="w-4 h-4 text-slate-400 ml-1" />
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as DashboardRangeKey)}
              className="bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-2"
            >
              {RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => { revenueQuery.refetch(); chartsQuery.refetch(); }}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {range === "CUSTOM" && (
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <label className="text-xs font-semibold text-slate-600">From:</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="px-3 py-1 text-xs border rounded-lg bg-slate-50 dark:bg-slate-800" />
          <label className="text-xs font-semibold text-slate-600">To:</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="px-3 py-1 text-xs border rounded-lg bg-slate-50 dark:bg-slate-800" />
        </div>
      )}

      {isError && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-rose-600" /><span>Failed to load revenue analytics data.</span></div>
          <button onClick={() => { revenueQuery.refetch(); chartsQuery.refetch(); }} className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs">Retry</button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((c, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border ${c.color} flex flex-col justify-between`}>
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">{c.label}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black">{c.val}</span>
              <ArrowUpRight className="w-4 h-4 opacity-50" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid: Line Chart & Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-500" /> Revenue Growth Area Chart
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="label" fontSize={11} stroke="#94a3b8" />
                <YAxis fontSize={11} stroke="#94a3b8" />
                <Tooltip formatter={(val) => [`$${Number(val).toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#analyticsRevGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-500" /> Revenue Comparison Bar Chart
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="label" fontSize={11} stroke="#94a3b8" />
                <YAxis fontSize={11} stroke="#94a3b8" />
                <Tooltip formatter={(val) => [`$${Number(val).toLocaleString()}`, "Revenue"]} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="revenue" name="Revenue ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
