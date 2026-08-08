"use client";

import React from "react";
import {
  useGetDashboardCustomersQuery,
  useGetDashboardChartsQuery,
} from "@/services/dashboardApi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  UserCheck,
  Users,
  Calendar,
  RefreshCw,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

const formatNumber = (val: number | undefined) => {
  return new Intl.NumberFormat("en-US").format(val || 0);
};

export default function CustomerAnalyticsPage() {
  const custQuery = useGetDashboardCustomersQuery(undefined, { pollingInterval: 60000 });
  const chartsQuery = useGetDashboardChartsQuery(undefined, { pollingInterval: 60000 });

  const cust = custQuery.data;
  const growthChart = chartsQuery.data?.customerGrowthChart || cust?.growthChart || [];

  const isLoading = custQuery.isLoading || chartsQuery.isLoading;
  const isFetching = custQuery.isFetching || chartsQuery.isFetching;
  const isError = custQuery.isError || chartsQuery.isError;

  const cards = [
    { label: "Total Customer Base", val: formatNumber(cust?.totalCustomers), icon: Users, color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200" },
    { label: "Today's New Customers", val: formatNumber(cust?.todayCustomers), icon: Calendar, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200" },
    { label: "Weekly Growth", val: formatNumber(cust?.weeklyCustomers), icon: TrendingUp, color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200" },
    { label: "Monthly Growth", val: formatNumber(cust?.monthlyCustomers), icon: ArrowUpRight, color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200" },
    { label: "Yearly Growth", val: formatNumber(cust?.yearlyCustomers), icon: UserCheck, color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border-teal-200" },
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
            <UserCheck className="w-6 h-6 text-amber-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Customer Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Customer acquisition trends, growth velocities & user metrics
          </p>
        </div>

        <button
          onClick={() => { custQuery.refetch(); chartsQuery.refetch(); }}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {isError && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-rose-600" /><span>Failed to load customer analytics.</span></div>
          <button onClick={() => { custQuery.refetch(); chartsQuery.refetch(); }} className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs">Retry</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className={`p-4 rounded-2xl border ${c.color} flex flex-col justify-between`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">{c.label}</span>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-2xl font-black mt-3">{c.val}</span>
            </div>
          );
        })}
      </div>

      {/* Growth Line Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-500" /> Cumulative Customer Growth Curve
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="label" fontSize={11} stroke="#94a3b8" />
              <YAxis fontSize={11} stroke="#94a3b8" />
              <Tooltip formatter={(val) => [val, "Customers"]} />
              <Line type="monotone" dataKey="totalCustomers" name="Customers" stroke="#d97706" strokeWidth={3} dot={{ r: 4, fill: "#d97706" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

