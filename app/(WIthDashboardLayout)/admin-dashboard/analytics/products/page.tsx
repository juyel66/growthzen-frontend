"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetDashboardRecentQuery } from "@/services/dashboardApi";
import { useGetProductsQuery } from "@/services/productApi";
import { getProductTitle, getProductMainImage } from "@/types/product";
import {
  PackageSearch,
  Award,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  DollarSign,
  Package,
} from "lucide-react";

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(val || 0);
};

export default function ProductAnalyticsPage() {
  const recentQuery = useGetDashboardRecentQuery(undefined, { pollingInterval: 60000 });
  const productsQuery = useGetProductsQuery({ limit: 50 }, { pollingInterval: 60000 });

  const topProducts = recentQuery.data?.topSellingProducts || [];
  const productsList = productsQuery.data || [];

  const lowStock = productsList
    .filter((p) => (p.quantity !== undefined ? p.quantity <= 15 : false))
    .sort((a, b) => (a.quantity ?? 0) - (b.quantity ?? 0));

  const outOfStock = productsList.filter((p) => (p.quantity ?? 0) <= 0);

  const isLoading = recentQuery.isLoading || productsQuery.isLoading;
  const isFetching = recentQuery.isFetching || productsQuery.isFetching;

  if (isLoading) {
    return <div className="p-6 animate-pulse space-y-6"><div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" /><div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" /></div>;
  }

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PackageSearch className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Product Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Product sales performance, revenue breakdown, & stock health alerts
          </p>
        </div>

        <button
          onClick={() => { recentQuery.refetch(); productsQuery.refetch(); }}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border bg-purple-50 dark:bg-purple-950/60 border-purple-200 text-purple-800 dark:text-purple-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block">Total Catalog Items</span>
            <span className="text-3xl font-black mt-1 block">{productsList.length}</span>
          </div>
          <Package className="w-8 h-8 opacity-40 text-purple-600" />
        </div>

        <div className="p-4 rounded-2xl border bg-amber-50 dark:bg-amber-950/60 border-amber-200 text-amber-800 dark:text-amber-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block">Low Stock Alerts</span>
            <span className="text-3xl font-black mt-1 block">{lowStock.length} Products</span>
          </div>
          <AlertTriangle className="w-8 h-8 opacity-40 text-amber-600" />
        </div>

        <div className="p-4 rounded-2xl border bg-rose-50 dark:bg-rose-950/60 border-rose-200 text-rose-800 dark:text-rose-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block">Out of Stock Items</span>
            <span className="text-3xl font-black mt-1 block">{outOfStock.length} Products</span>
          </div>
          <AlertTriangle className="w-8 h-8 opacity-40 text-rose-600" />
        </div>
      </div>

      {/* Grid: Top Selling Products & Low Stock Inventory Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Top Selling Products by Revenue
            </h3>
          </div>

          <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Units Sold</th>
                  <th className="p-3">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {topProducts.length > 0 ? (
                  topProducts.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-slate-100 overflow-hidden relative flex-shrink-0">
                          {item.thumbnailImage && <Image src={item.thumbnailImage} alt={item.productName} fill className="object-cover" />}
                        </div>
                        <span>{item.productName}</span>
                      </td>
                      <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">{item.soldQuantity} Units</td>
                      <td className="p-3 font-extrabold text-emerald-600 dark:text-emerald-400">{formatCurrency(item.revenue)}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className="p-6 text-center text-slate-400">No sales data recorded.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock & Out of Stock Inventory */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Low & Out of Stock Inventory
            </h3>
          </div>

          <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Stock Level</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {lowStock.length > 0 ? (
                  lowStock.map((item, idx) => {
                    const title = getProductTitle(item);
                    const img = getProductMainImage(item);
                    const stock = item.quantity ?? 0;
                    const isZero = stock <= 0;

                    return (
                      <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded bg-slate-100 overflow-hidden relative flex-shrink-0">
                            <Image src={img} alt={title} fill className="object-cover" />
                          </div>
                          <span>{title}</span>
                        </td>
                        <td className="p-3 font-extrabold text-slate-900 dark:text-slate-100">{stock} Units</td>
                        <td className="p-3">
                          {isZero ? (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-50 text-rose-700 border border-rose-200">OUT OF STOCK</span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-700 border border-amber-200">LOW STOCK</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <Link href={`/admin-dashboard/products/edit/${item.id}`} className="text-blue-600 hover:underline font-semibold flex items-center justify-end gap-0.5">
                            Edit <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={4} className="p-6 text-center text-slate-400">Inventory levels are healthy.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
