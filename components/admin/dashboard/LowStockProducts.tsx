"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, getProductTitle, getProductMainImage } from "@/types/product";
import { AlertTriangle, ArrowRight, ExternalLink } from "lucide-react";

interface LowStockProductsProps {
  products?: Product[];
}

export const LowStockProducts: React.FC<LowStockProductsProps> = ({
  products = [],
}) => {
  // Filter products with low stock (quantity <= 10 or lowest 5 items)
  const lowStockList = products
    .filter((p) => (p.quantity !== undefined ? p.quantity <= 15 : true))
    .sort((a, b) => (a.quantity ?? 0) - (b.quantity ?? 0))
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Low Stock Inventory Alerts
          </h3>
        </div>

        <Link
          href="/admin-dashboard/products"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>Manage Stock</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Current Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {lowStockList.length > 0 ? (
              lowStockList.map((item, idx) => {
                const title = getProductTitle(item);
                const img = getProductMainImage(item);
                const stock = item.quantity ?? 0;
                const isOutOfStock = stock <= 0;

                return (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <Image src={img} alt={title} fill className="object-cover" />
                      </div>
                      <span>{title}</span>
                    </td>
                    <td className="p-3 font-extrabold text-slate-900 dark:text-slate-100">
                      {stock} Units
                    </td>
                    <td className="p-3">
                      {isOutOfStock ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded border bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 uppercase">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded border bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 uppercase">
                          Low Stock ({stock})
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/admin-dashboard/products/edit/${item.id}`}
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-400">
                  All products have healthy inventory levels.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

