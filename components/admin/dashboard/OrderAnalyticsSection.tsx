"use client";

import React from "react";
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
} from "recharts";
import { DashboardOrderAnalytics } from "@/types/dashboard";
import { PackageCheck, Calendar, CreditCard, Truck } from "lucide-react";

interface OrderAnalyticsSectionProps {
  orderAnalytics?: DashboardOrderAnalytics;
}

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6", "#6366f1"];

export const OrderAnalyticsSection: React.FC<OrderAnalyticsSectionProps> = ({
  orderAnalytics,
}) => {
  const byStatus = orderAnalytics?.ordersByStatus || [];
  const byMonth = orderAnalytics?.ordersByMonth || [];
  const byPayment = orderAnalytics?.ordersByPaymentMethod || [];
  const byShipping = orderAnalytics?.ordersByShippingMethod || [];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Order Analytics Breakdown
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Multi-dimensional order distribution across status, month, payment, & shipping
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Orders By Status */}
        <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <PackageCheck className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Orders by Status
            </h3>
          </div>
          <div className="h-56 w-full">
            {byStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byStatus} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis type="number" fontSize={11} stroke="#94a3b8" />
                  <YAxis dataKey="status" type="category" fontSize={10} stroke="#94a3b8" width={80} />
                  <Tooltip formatter={(value) => [value, "Orders"]} />
                  <Bar dataKey="totalOrders" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No status data
              </div>
            )}
          </div>
        </div>

        {/* 2. Orders By Month */}
        <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Monthly Order Trend
            </h3>
          </div>
          <div className="h-56 w-full">
            {byMonth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byMonth} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="month" fontSize={11} stroke="#94a3b8" />
                  <YAxis fontSize={11} stroke="#94a3b8" />
                  <Tooltip formatter={(value) => [value, "Orders"]} />
                  <Bar dataKey="totalOrders" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No monthly data
              </div>
            )}
          </div>
        </div>

        {/* 3. Orders By Payment Method */}
        <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-purple-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Orders by Payment Method
            </h3>
          </div>
          <div className="h-56 w-full">
            {byPayment.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byPayment as any[]}
                    dataKey="totalOrders"
                    nameKey="method"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={35}
                    paddingAngle={3}
                    label={({ name, percent }: { name?: string; percent?: number }) =>
                      `${name || ""} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {byPayment.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Orders"]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No payment method data
              </div>
            )}
          </div>
        </div>

        {/* 4. Orders By Shipping Method */}
        <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Orders by Shipping Method
            </h3>
          </div>
          <div className="h-56 w-full">
            {byShipping.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byShipping} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="shippingMethod" fontSize={11} stroke="#94a3b8" />
                  <YAxis fontSize={11} stroke="#94a3b8" />
                  <Tooltip formatter={(value) => [value, "Orders"]} />
                  <Bar dataKey="totalOrders" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No shipping method data
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

