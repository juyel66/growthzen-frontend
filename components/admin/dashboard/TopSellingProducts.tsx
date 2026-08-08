"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { DashboardTopSellingProductItem } from "@/types/dashboard";
import { Award, ArrowRight, ExternalLink } from "lucide-react";

interface TopSellingProductsProps {
  products?: DashboardTopSellingProductItem[];
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT", currencyDisplay: "narrowSymbol",
  }).format(val || 0);
};

export const TopSellingProducts: React.FC<TopSellingProductsProps> = ({
  products = [],
}) => {
  const top5 = products.slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-purple-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Top Selling Products
          </h3>
        </div>

        <Link
          href="/admin-dashboard/products"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Sold Quantity</th>
              <th className="p-3">Revenue</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {top5.length > 0 ? (
              top5.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-3 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700 flex-shrink-0">
                      {item.thumbnailImage ? (
                        <Image
                          src={item.thumbnailImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400">
                          Img
                        </div>
                      )}
                    </div>
                    <span>{item.productName}</span>
                  </td>
                  <td className="p-3 font-extrabold text-indigo-600 dark:text-indigo-400">
                    {item.soldQuantity} Units
                  </td>
                  <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(item.revenue)}
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin-dashboard/products/edit/${item.productId}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-400">
                  No top selling product entries available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

