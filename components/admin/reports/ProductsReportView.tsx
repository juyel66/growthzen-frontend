"use client";

import React from "react";
import { ProductReportResponseData, ReportQueryParams, PaginationMeta } from "@/types/report";
import { formatMoney } from "@/utils/formatMoney";
import { ReportExportModal } from "./ReportExportModal";
import { ReportEmptyState } from "./ReportStates";
import { Package, CheckCircle2, XCircle, Star, Award, ChevronLeft, ChevronRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

interface ProductsReportViewProps {
  data?: ProductReportResponseData;
  meta?: PaginationMeta;
  queryParams: ReportQueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<ReportQueryParams>>;
}

const BAR_COLORS = ["#6366F1", "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"];

export const ProductsReportView: React.FC<ProductsReportViewProps> = ({
  data,
  meta,
  queryParams,
  setQueryParams,
}) => {
  if (!data || !data.summary) {
    return <ReportEmptyState title="No Product Data" message="No products found matching the criteria." />;
  }

  const { summary, items } = data;

  const chartData = summary.bestSellingProducts.map((p) => ({
    name: p.title.length > 15 ? `${p.title.slice(0, 15)}...` : p.title,
    fullTitle: p.title,
    soldQuantity: p.soldQuantity,
    revenue: p.totalRevenue,
  }));

  const handlePageChange = (newPage: number) => {
    if (meta && newPage >= 1 && newPage <= meta.totalPages) {
      setQueryParams((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600" />
            Product Catalog & Performance Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Inventory metrics, best sellers, and sales revenue per item
          </p>
        </div>
        <ReportExportModal reportType="products" queryParams={queryParams} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Products</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
              {summary.totalProducts.toLocaleString()}
            </h3>
            <span className="inline-block mt-1 text-[11px] font-medium text-slate-400">In System</span>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-2xl">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Products</p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {summary.activeProducts.toLocaleString()}
            </h3>
            <span className="inline-block mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
              Visible On Store
            </span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Inactive Products</p>
            <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
              {summary.inactiveProducts.toLocaleString()}
            </h3>
            <span className="inline-block mt-1 text-[11px] font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md">
              Hidden / Disabled
            </span>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-2xl">
            <XCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Featured Products</p>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {summary.featuredProducts.toLocaleString()}
            </h3>
            <span className="inline-block mt-1 text-[11px] font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
              Promoted Items
            </span>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl">
            <Star className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Best Sellers Chart */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-500" />
              Top Products by Units Sold (Delivered Orders)
            </h3>
            <span className="text-xs text-slate-400 font-medium">Top Performers</span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    name === "soldQuantity" ? `${val} Units` : formatMoney(val),
                    name === "soldQuantity" ? "Sold Quantity" : "Total Revenue",
                  ]}
                  contentStyle={{ backgroundColor: "#0F172A", color: "#F8FAFC", borderRadius: "12px", border: "none" }}
                />
                <Bar dataKey="soldQuantity" name="soldQuantity" radius={[8, 8, 0, 0]}>
                  {chartData.map((_, idx) => (
                    <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Product Performance Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Products List ({meta?.total || items.length})
          </h3>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No products match the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Product Title</th>
                  <th className="py-3.5 px-4">Code / SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Sell Price</th>
                  <th className="py-3.5 px-4">Cost Price</th>
                  <th className="py-3.5 px-4">Sold Qty</th>
                  <th className="py-3.5 px-4">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {items.map((item) => (
                  <tr key={item.productId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 max-w-[200px] truncate" title={item.title}>
                      {item.title}
                      {item.isFeatured && (
                        <span className="ml-1.5 px-1.5 py-0.2 bg-amber-50 text-amber-600 text-[10px] rounded font-semibold">
                          ★ Featured
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-blue-600">{item.productCode}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.category}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md ${
                        item.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold">{formatMoney(item.customerSellPrice)}</td>
                    <td className="py-3.5 px-4 text-slate-400">{formatMoney(item.costPrice)}</td>
                    <td className="py-3.5 px-4 font-bold text-indigo-600">{item.soldQuantity}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600">{formatMoney(item.totalRevenue)}</td>
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
