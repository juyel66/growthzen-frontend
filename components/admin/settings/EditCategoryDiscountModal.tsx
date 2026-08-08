"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CategoryDiscountItem, UpdateCategoryDiscountInput } from "@/types/settings";
import { X, Loader2, Percent, CheckCircle } from "lucide-react";

const discountSchema = z.object({
  discountPercentage: z
    .number()
    .min(0, "Discount cannot be less than 0%")
    .max(100, "Discount cannot exceed 100%"),
  isDiscountEnabled: z.boolean(),
});

type DiscountFormData = z.infer<typeof discountSchema>;

interface EditCategoryDiscountModalProps {
  item: CategoryDiscountItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveDiscount: (categoryId: string, data: UpdateCategoryDiscountInput) => Promise<void>;
  isLoading?: boolean;
}

export const EditCategoryDiscountModal: React.FC<EditCategoryDiscountModalProps> = ({
  item,
  isOpen,
  onClose,
  onSaveDiscount,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DiscountFormData>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      discountPercentage: 0,
      isDiscountEnabled: true,
    },
  });

  const isEnabled = watch("isDiscountEnabled");

  useEffect(() => {
    if (item) {
      reset({
        discountPercentage: item.discountPercentage ?? 0,
        isDiscountEnabled: item.isDiscountEnabled !== false,
      });
    }
  }, [item, reset, isOpen]);

  if (!isOpen || !item) return null;

  const categoryName = item.categoryName || item.category?.name || "Category";
  const categoryImage = item.categoryImage || item.category?.image || item.category?.thumbnail;

  const onFormSubmit = async (data: DiscountFormData) => {
    await onSaveDiscount(item.categoryId, data);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Edit Category Discount
              </h2>
              <p className="text-xs text-slate-500">
                Apply category-wide percentage markdown rule.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Preview Header */}
        <div className="px-6 pt-5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700 flex-shrink-0">
            {categoryImage ? (
              <Image src={categoryImage} alt={categoryName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                Img
              </div>
            )}
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              {categoryName}
            </h3>
            <span className="text-[11px] font-mono text-slate-400">ID: {item.categoryId}</span>
          </div>
        </div>

        {/* Form Body */}
        <form id="discountForm" onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-5">
          {/* Discount Percentage Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Discount Percentage (%) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                {...register("discountPercentage", { valueAsNumber: true })}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-extrabold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              <Percent className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.discountPercentage && (
              <p className="text-[11px] font-medium text-rose-500">{errors.discountPercentage.message}</p>
            )}
          </div>

          {/* Discount Enabled Switch */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Enable Discount Rule
              </span>
              <span className="text-[10px] text-slate-500">
                Apply markdown across all products in this category
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setValue("isDiscountEnabled", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="discountForm"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-extrabold shadow-md transition cursor-pointer"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Save Discount Rule</span>
          </button>
        </div>
      </div>
    </div>
  );
};

