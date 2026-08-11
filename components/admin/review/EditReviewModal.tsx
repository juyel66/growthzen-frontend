"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ReviewItem, ReviewStatus, UpdateReviewInput } from "@/types/review";
import { useGetProductsQuery } from "@/services/productApi";
import { Product } from "@/types/product";
import { SafeImage } from "@/components/ui/SafeImage";
import { X, Loader2, Star, Edit3, CheckCircle2, XCircle, Clock, Search, Package } from "lucide-react";

const editReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  status: z.enum(["PUBLISHED", "PENDING", "HIDDEN", "APPROVED", "REJECTED"]),
});

type EditReviewFormData = z.infer<typeof editReviewSchema>;

interface EditReviewModalProps {
  review: ReviewItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveReview: (id: string, data: UpdateReviewInput) => Promise<void>;
  isLoading?: boolean;
}

export const EditReviewModal: React.FC<EditReviewModalProps> = ({
  review,
  isOpen,
  onClose,
  onSaveReview,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Fetch catalog products for multi-product assignment
  const { data: productsList = [] } = useGetProductsQuery(undefined, { skip: !isOpen });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<EditReviewFormData>({
    resolver: zodResolver(editReviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
      status: "PUBLISHED",
    },
  });

  const currentRating = watch("rating");
  const currentStatus = watch("status");

  useEffect(() => {
    if (review && isOpen) {
      const currentSt = (review.status as ReviewStatus) || "PENDING";
      reset({
        rating: review.rating || 5,
        comment: review.comment || "",
        status: (["PUBLISHED", "PENDING", "HIDDEN", "APPROVED", "REJECTED"].includes(currentSt)
          ? currentSt
          : "PENDING") as any,
      });

      const initialIds: string[] = [];
      if (review.productIds && Array.isArray(review.productIds) && review.productIds.length > 0) {
        initialIds.push(...review.productIds);
      } else if (review.products && Array.isArray(review.products) && review.products.length > 0) {
        initialIds.push(...review.products.map((p) => p.id).filter(Boolean) as string[]);
      } else if (review.productId || review.product?.id) {
        const pId = review.product?.id || review.productId;
        if (pId) initialIds.push(pId);
      }
      setSelectedProductIds(Array.from(new Set(initialIds)));
      setSearchTerm("");
    }
  }, [review, reset, isOpen]);

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return productsList.slice(0, 6);
    const q = searchTerm.toLowerCase().trim();
    return productsList.filter((p: Product) => {
      const title = (p.title || p.name || "").toLowerCase();
      const code = (p.productCode || "").toLowerCase();
      return title.includes(q) || code.includes(q);
    }).slice(0, 10);
  }, [productsList, searchTerm]);

  // Selected product objects
  const selectedProductsDetails = useMemo(() => {
    return selectedProductIds
      .map((id) => productsList.find((p) => p.id === id) || (review?.product?.id === id ? review.product : null))
      .filter(Boolean);
  }, [selectedProductIds, productsList, review]);

  if (!isOpen || !review) return null;

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const removeProduct = (id: string) => {
    setSelectedProductIds((prev) => prev.filter((pId) => pId !== id));
  };

  const onFormSubmit = async (data: EditReviewFormData) => {
    const payload: UpdateReviewInput = {
      ...data,
      productIds: selectedProductIds,
      productId: selectedProductIds.length > 0 ? selectedProductIds[0] : null,
    };
    await onSaveReview(review.id, payload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Edit Review & Associated Products
              </h2>
              <p className="text-xs text-slate-500">
                Update review content, approval status, and product associations.
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

        {/* Form Body */}
        <form id="editReviewForm" onSubmit={handleSubmit(onFormSubmit)} className="p-6 overflow-y-auto space-y-4">
          {/* Status Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Approval Status *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setValue("status", "PUBLISHED")}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
                  currentStatus === "PUBLISHED" || currentStatus === "APPROVED"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Publish</span>
              </button>

              <button
                type="button"
                onClick={() => setValue("status", "PENDING")}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
                  currentStatus === "PENDING"
                    ? "bg-amber-500 text-white border-amber-500 shadow-md"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Pending</span>
              </button>

              <button
                type="button"
                onClick={() => setValue("status", "HIDDEN")}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
                  currentStatus === "HIDDEN" || currentStatus === "REJECTED"
                    ? "bg-rose-600 text-white border-rose-600 shadow-md"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700"
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Hide</span>
              </button>
            </div>
          </div>

          {/* Associated Products Multi-Selection */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-indigo-500" />
                <span>Associated Products ({selectedProductIds.length})</span>
              </label>
            </div>

            {/* Selected Pills */}
            {selectedProductsDetails.length > 0 && (
              <div className="flex flex-wrap gap-1.5 py-1">
                {selectedProductsDetails.map((prod: any) => {
                  const pId = prod.id;
                  const pTitle = prod.title || prod.name || "Product";
                  return (
                    <span
                      key={pId}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-[11px] font-extrabold text-indigo-700 dark:text-indigo-300"
                    >
                      <span className="truncate max-w-[140px]">{pTitle}</span>
                      <button
                        type="button"
                        onClick={() => removeProduct(pId)}
                        className="hover:text-rose-500 transition cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products to associate..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            {/* Product Checkboxes */}
            <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
              {filteredProducts.map((prod) => {
                const isSelected = selectedProductIds.includes(prod.id);
                const title = prod.title || prod.name || "Product";
                const code = prod.productCode;
                const img = prod.thumbnailImage || (prod.images && prod.images[0]);
                return (
                  <label
                    key={prod.id}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSelectProduct(prod.id);
                    }}
                    className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition ${
                      isSelected
                        ? "bg-indigo-50/70 border-indigo-400 dark:bg-indigo-950/50 dark:border-indigo-500 font-bold"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <SafeImage
                          src={img}
                          alt={title}
                          fill
                          className="object-cover"
                          fallbackSrc="/placeholder-product.png"
                        />
                      </div>
                      <span className="truncate text-slate-800 dark:text-slate-200">{title}</span>
                    </div>
                    {code && <span className="text-[10px] font-mono text-slate-400 ml-2">SKU: {code}</span>}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Rating Score (1 - 5 Stars) *
            </label>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setValue("rating", star)}
                    className="p-1 hover:scale-110 transition cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= currentRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 ml-auto">
                {currentRating} Stars
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Review Comment Content
            </label>
            <textarea
              rows={3}
              {...register("comment")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="editReviewForm"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-extrabold shadow-md transition cursor-pointer"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Save Review Updates</span>
          </button>
        </div>
      </div>
    </div>
  );
};

