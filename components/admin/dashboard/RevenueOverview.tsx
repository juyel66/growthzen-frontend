"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { DashboardRevenueChartPoint } from "@/types/dashboard";
import { TrendingUp } from "lucide-react";

interface RevenueOverviewProps {
  revenueChart?: DashboardRevenueChartPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg border border-slate-700">
        <p className="text-slate-300 text-[10px]">{label}</p>
        <p className="text-blue-400">
          ${Number(payload[0].value || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </p>
      </div>
    );
  }
  return null;
};

export const RevenueOverview: React.FC<RevenueOverviewProps> = ({
  revenueChart = [],
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Last 7 Days Revenue
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Lightweight weekly sales overview
            </p>
          </div>
        </div>
      </div>

      <div className="h-44 w-full pt-1">
        {revenueChart.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueChart} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="revGradSmall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#revGradSmall)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No recent revenue trend available
          </div>
        )}
      </div>
    </div>
  );
};

