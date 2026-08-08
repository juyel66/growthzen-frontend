"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { DashboardCharts } from "@/types/dashboard";
import { TrendingUp, ShoppingCart, CreditCard, UserPlus } from "lucide-react";

interface ChartsSectionProps {
  chartsData?: DashboardCharts;
}

const CustomTooltip = ({ active, payload, label, isCurrency = false }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
        <p className="font-bold text-slate-300 border-b border-slate-700 pb-1 mb-1.5">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 py-0.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color || entry.fill }}
            />
            <span className="text-slate-300 font-medium">{entry.name}:</span>
            <span className="font-bold text-white">
              {isCurrency
                ? `৳${Number(entry.value).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}`
                : entry.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const ChartsSection: React.FC<ChartsSectionProps> = ({ chartsData }) => {
  const revenueSeries = chartsData?.revenueChart || [];
  const ordersSeries = chartsData?.ordersChart || [];
  const paymentSeries = chartsData?.paymentChart || [];
  const customerSeries = chartsData?.customerGrowthChart || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Revenue Line / Area Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Revenue Growth Trend
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Delivered revenue metrics over selected range
              </p>
            </div>
          </div>
        </div>

        <div className="h-72 w-full mt-2">
          {revenueSeries.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip isCurrency={true} />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No revenue chart data available
            </div>
          )}
        </div>
      </div>

      {/* 2. Orders Volume Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Order Fulfillment Volume
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Breakdown of total, delivered, & pending orders
              </p>
            </div>
          </div>
        </div>

        <div className="h-72 w-full mt-2">
          {ordersSeries.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="totalOrders" name="Total Orders" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="deliveredOrders" name="Delivered" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pendingOrders" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No order chart data available
            </div>
          )}
        </div>
      </div>

      {/* 3. Payment Settlement Analytics Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Payment Status Distribution
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paid, pending, and failed payment transactions
              </p>
            </div>
          </div>
        </div>

        <div className="h-72 w-full mt-2">
          {paymentSeries.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="paidPayments" name="Paid" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pendingPayments" name="Pending" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failedPayments" name="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No payment chart data available
            </div>
          )}
        </div>
      </div>

      {/* 4. Customer Growth Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Customer Acquisition Growth
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cumulative user growth curve over time
              </p>
            </div>
          </div>
        </div>

        <div className="h-72 w-full mt-2">
          {customerSeries.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="totalCustomers"
                  name="Total Customers"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#d97706" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No customer growth chart data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

