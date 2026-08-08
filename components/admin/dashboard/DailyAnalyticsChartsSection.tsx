"use client";

import React from "react";
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
} from "recharts";
import { DashboardCharts } from "@/types/dashboard";
import { DollarSign, TrendingUp, Package, Truck, ShoppingCart } from "lucide-react";

interface DailyAnalyticsChartsSectionProps {
  chartsData?: DashboardCharts;
}

const CustomTooltip = ({ active, payload, label, isCurrency = true }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
        <p className="font-bold text-slate-300 border-b border-slate-700 pb-1 mb-1.5">
          {label}
        </p>
        {payload.map((entry: any, index: number) => {
          const val = entry.value;
          return (
            <div key={index} className="flex items-center gap-2 py-0.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              <span className="text-slate-300 font-medium">{entry.name}:</span>
              <span className="font-bold text-white">
                {val === null || val === undefined
                  ? "--"
                  : isCurrency
                    ? `৳${Number(val).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}`
                    : Number(val).toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export const DailyAnalyticsChartsSection: React.FC<DailyAnalyticsChartsSectionProps> = ({
  chartsData,
}) => {
  const series = chartsData?.revenueChart || [];

  const chartConfigs = [
    {
      id: "daily-gross-sales",
      title: "Daily Gross Sales",
      subtitle: "Gross revenue per day",
      icon: DollarSign,
      iconColor: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60",
      data: chartsData?.grossSalesChart || series,
      dataKey: (d: any) => d.grossSales ?? d.revenue ?? 0,
      stroke: "#2563eb",
      gradientId: "dailyGrossSalesGrad",
      stopColor: "#3b82f6",
      isCurrency: true,
      name: "Gross Sales",
    },
    {
      id: "daily-net-profit",
      title: "Daily Net Profit",
      subtitle: "Net profit per day",
      icon: TrendingUp,
      iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60",
      data: chartsData?.netProfitChart || chartsData?.profitChart || series,
      dataKey: (d: any) => d.netProfit ?? d.profit ?? 0,
      stroke: "#10b981",
      gradientId: "dailyNetProfitGrad",
      stopColor: "#10b981",
      isCurrency: true,
      name: "Net Profit",
    },
    {
      id: "daily-product-cost",
      title: "Daily Product Cost",
      subtitle: "Product manufacturing/cogs per day",
      icon: Package,
      iconColor: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60",
      data: chartsData?.productCostChart || series,
      dataKey: (d: any) => d.productCost ?? 0,
      stroke: "#8b5cf6",
      gradientId: "dailyProductCostGrad",
      stopColor: "#8b5cf6",
      isCurrency: true,
      name: "Product Cost",
    },
    {
      id: "daily-courier-cost",
      title: "Daily Courier Cost",
      subtitle: "Courier & delivery expenses per day",
      icon: Truck,
      iconColor: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60",
      data: chartsData?.courierCostChart || series,
      dataKey: (d: any) => d.courierCost ?? 0,
      stroke: "#f59e0b",
      gradientId: "dailyCourierCostGrad",
      stopColor: "#f59e0b",
      isCurrency: true,
      name: "Courier Cost",
    },
    {
      id: "daily-quantity-sold",
      title: "Daily Quantity Sold",
      subtitle: "Total units sold per day",
      icon: ShoppingCart,
      iconColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60",
      data: chartsData?.quantitySoldChart || chartsData?.quantityChart || series,
      dataKey: (d: any) => d.quantitySold ?? d.quantity ?? 0,
      stroke: "#6366f1",
      gradientId: "dailyQuantitySoldGrad",
      stopColor: "#6366f1",
      isCurrency: false,
      name: "Units Sold",
      isBar: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Daily Analytics Trends
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Visualization of daily backend ledger response metrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chartConfigs.map((c) => {
          const Icon = c.icon;
          const chartData = c.data.map((item) => ({
            label: item.label,
            value: typeof c.dataKey === "function" ? c.dataKey(item) : (item as any)[c.dataKey],
          }));

          return (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${c.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {c.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {c.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-52 w-full pt-1">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    {c.isBar ? (
                      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                        <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <Tooltip content={<CustomTooltip isCurrency={c.isCurrency} />} />
                        <Bar
                          dataKey="value"
                          name={c.name}
                          fill={c.stroke}
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    ) : (
                      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id={c.gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={c.stopColor} stopOpacity={0.35} />
                            <stop offset="95%" stopColor={c.stopColor} stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                        <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <Tooltip content={<CustomTooltip isCurrency={c.isCurrency} />} />
                        <Area
                          type="monotone"
                          dataKey="value"
                          name={c.name}
                          stroke={c.stroke}
                          strokeWidth={2}
                          fillOpacity={1}
                          fill={`url(#${c.gradientId})`}
                        />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No backend daily trend data available
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

