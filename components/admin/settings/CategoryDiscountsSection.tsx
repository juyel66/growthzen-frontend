"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { CategoryDiscountItem, UpdateCategoryDiscountInput } from "@/types/settings";
import {
  useGetCategoryDiscountsQuery,
  useUpdateCategoryDiscountMutation,
} from "@/services/settingsApi";
import { EditCategoryDiscountModal } from "./EditCategoryDiscountModal";

import {
  Percent,
  Search,
  Edit3,
  AlertTriangle,
  ArrowUpDown,
  Tag,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Swal from "sweetalert2";

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const CategoryDiscountsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"highest" | "lowest" | "name">("highest");
  const [editingItem, setEditingItem] = useState<CategoryDiscountItem | null>(null);

  // RTK Query hooks
  const { data: discountList = [], isLoading, isFetching, isError, refetch } = useGetCategoryDiscountsQuery();
  const [updateDiscountMutation, { isLoading: isUpdating }] = useUpdateCategoryDiscountMutation();

  // Filter & sort list
  const filteredDiscounts = useMemo(() => {
    let list = [...discountList];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter((item) => {
        const name = (item.categoryName || item.category?.name || "").toLowerCase();
        return name.includes(q);
      });
    }

    list.sort((a, b) => {
      const pctA = a.discountPercentage || 0;
      const pctB = b.discountPercentage || 0;
      const nameA = a.categoryName || a.category?.name || "";
      const nameB = b.categoryName || b.category?.name || "";

      if (sortOrder === "highest") return pctB - pctA;
      if (sortOrder === "lowest") return pctA - pctB;
      if (sortOrder === "name") return nameA.localeCompare(nameB);
      return 0;
    });

    return list;
  }, [discountList, searchTerm, sortOrder]);

  const handleSaveDiscountSubmit = async (
    categoryId: string,
    data: UpdateCategoryDiscountInput
  ) => {
    try {
      await updateDiscountMutation({ categoryId, data }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Category Discount Updated",
        text: `Discount rules updated successfully via PATCH /settings/category-discounts/${categoryId}.`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });
      setEditingItem(null);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err?.data?.message || "Failed to update category discount rule.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Search & Sort Controls */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by category name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortOrder}
              onChange={(e: any) => setSortOrder(e.target.value)}
              className="bg-transparent focus:outline-none text-slate-800 dark:text-slate-200 font-bold cursor-pointer"
            >
              <option value="highest">Highest Discount %</option>
              <option value="lowest">Lowest Discount %</option>
              <option value="name">Category Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {isError && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Failed to load category discounts from backend endpoint.</span>
          </div>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Category Discounts Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Category Image</th>
                <th className="p-3.5">Category Name</th>
                <th className="p-3.5">Discount %</th>
                <th className="p-3.5">Discount Enabled</th>
                <th className="p-3.5">Updated Date</th>
                <th className="p-3.5 text-right w-[120px] min-w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDiscounts.length > 0 ? (
                filteredDiscounts.map((item) => {
                  const catName = item.categoryName || item.category?.name || "Category";
                  const catImage = item.categoryImage || item.category?.image || item.category?.thumbnail;
                  const isEnabled = item.isDiscountEnabled !== false && item.discountPercentage > 0;

                  return (
                    <tr
                      key={item.categoryId}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Image */}
                      <td className="p-3.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700 shadow-2xs">
                          {catImage ? (
                            <Image
                              src={catImage}
                              alt={catName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-[10px]">
                              Img
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Category Name */}
                      <td className="p-3.5 font-extrabold text-slate-900 dark:text-slate-100">
                        {catName}
                      </td>

                      {/* Discount % Badge */}
                      <td className="p-3.5 font-black">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black border ${
                            item.discountPercentage > 0
                              ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          <Tag className="w-3.5 h-3.5" />
                          <span>{item.discountPercentage}% OFF</span>
                        </span>
                      </td>

                      {/* Discount Enabled Badge */}
                      <td className="p-3.5">
                        {isEnabled ? (
                          <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-md border tracking-wide uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 inline-flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Enabled
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-md border tracking-wide uppercase bg-slate-100 text-slate-500 border-slate-200 inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Disabled
                          </span>
                        )}
                      </td>

                      {/* Updated Date */}
                      <td className="p-3.5 text-slate-500 whitespace-nowrap">
                        {formatDate(item.updatedAt)}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right whitespace-nowrap w-[120px] min-w-[120px]">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="flex items-center justify-end gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-2xs transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-400">
                    No category discount rules defined.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Category Discount Modal */}
      <EditCategoryDiscountModal
        item={editingItem}
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        onSaveDiscount={handleSaveDiscountSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
};

