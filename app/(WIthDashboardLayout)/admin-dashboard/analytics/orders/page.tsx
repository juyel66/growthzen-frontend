"use client";

import React from "react";
import {
  useGetDashboardOrdersQuery,
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
  ListOrdered,
  PackageCheck,
  Calendar,
  CreditCard,
  Truck,
  RefreshCw,
  AlertTriangle,
  Percent,
  CheckCircle,
  XCircle,
} from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6", "#6366f1"];

export default function OrderAnalyticsPage() {
  const ordersQuery = useGetDashboardOrdersQuery(undefined, { pollingInterval: 60000 });
  const chartsQuery = useGetDashboardChartsQuery(undefined, { pollingInterval: 60000 });

  const ord = ordersQuery.data;
  const ordersChart = chartsQuery.data?.ordersChart || [];

  const isLoading = ordersQuery.isLoading || chartsQuery.isLoading;
  const isFetching = ordersQuery.isFetching || chartsQuery.isFetching;
  const isError = ordersQuery.isError || chartsQuery.isError;

  const total = ord?.totalOrders || 0;
  const delivered = ord?.deliveredOrders || 0;
  const cancelled = ord?.cancelledOrders || 0;

  const successRate = total > 0 ? ((delivered / total) * 100).toFixed(1) : "0.0";
  const cancellationRate = total > 0 ? ((cancelled / total) * 100).toFixed(1) : "0.0";

  if (isLoading) {
    return <div className="p-6 animate-pulse space-y-6"><div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" /><div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" /></div>;
  }

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ListOrdered className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Order Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fulfillment performance, order status distributions & conversion metrics
          </p>
        </div>

        <button
          onClick={() => { ordersQuery.refetch(); chartsQuery.refetch(); }}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {isError && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-rose-600" /><span>Failed to load order analytics data.</span></div>
          <button onClick={() => { ordersQuery.refetch(); chartsQuery.refetch(); }} className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs">Retry</button>
        </div>
      )}

      {/* KPI Rates */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block">Fulfillment Success Rate</span>
            <span className="text-3xl font-black mt-1 block">{successRate}%</span>
          </div>
          <CheckCircle className="w-8 h-8 opacity-40 text-emerald-600" />
        </div>

        <div className="p-4 rounded-2xl border bg-rose-50 dark:bg-rose-950/60 border-rose-200 text-rose-800 dark:text-rose-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block">Cancellation Rate</span>
            <span className="text-3xl font-black mt-1 block">{cancellationRate}%</span>
          </div>
          <XCircle className="w-8 h-8 opacity-40 text-rose-600" />
        </div>

        <div className="p-4 rounded-2xl border bg-blue-50 dark:bg-blue-950/60 border-blue-200 text-blue-800 dark:text-blue-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block">Total Volume Executed</span>
            <span className="text-3xl font-black mt-1 block">{total} Orders</span>
          </div>
          <Percent className="w-8 h-8 opacity-40 text-blue-600" />
        </div>
      </div>

      {/* Main Order fulfillment chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-emerald-500" /> Order Fulfillment Volume Trend
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordersChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="label" fontSize={11} stroke="#94a3b8" />
              <YAxis fontSize={11} stroke="#94a3b8" />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="totalOrders" name="Total Orders" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="deliveredOrders" name="Delivered" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pendingOrders" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Status, Month, Payment Method, Shipping Method */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-blue-500" /> Orders by Status
          </h4>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ord?.ordersByStatus || []} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis type="number" fontSize={11} stroke="#94a3b8" />
                <YAxis dataKey="status" type="category" fontSize={10} stroke="#94a3b8" width={80} />
                <Tooltip />
                <Bar dataKey="totalOrders" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" /> Orders by Month
          </h4>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ord?.ordersByMonth || []} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="month" fontSize={11} stroke="#94a3b8" />
                <YAxis fontSize={11} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="totalOrders" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-purple-500" /> Orders by Payment Method
          </h4>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={(ord?.ordersByPaymentMethod || []) as any[]}
                  dataKey="totalOrders"
                  nameKey="method"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={35}
                  paddingAngle={3}
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name || ""} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {(ord?.ordersByPaymentMethod || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-500" /> Orders by Shipping Method
          </h4>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ord?.ordersByShippingMethod || []} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="shippingMethod" fontSize={11} stroke="#94a3b8" />
                <YAxis fontSize={11} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="totalOrders" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

