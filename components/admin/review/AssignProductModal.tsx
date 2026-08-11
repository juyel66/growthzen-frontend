"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ReviewItem } from "@/types/review";
import { useGetProductsQuery } from "@/services/productApi";
import { useAdminAssignProductMutation, useUpdateReviewMutation } from "@/services/reviewApi";
import { Product } from "@/types/product";
import { SafeImage } from "@/components/ui/SafeImage";

import {
  X,
  Search,
  Loader2,
  CheckCircle2,
  Package,
} from "lucide-react";
import Swal from "sweetalert2";

interface AssignProductModalProps {
  review: ReviewItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AssignProductModal: React.FC<AssignProductModalProps> = ({
  review,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Fetch catalog products for search
  const { data: productsList = [], isLoading: isProductsLoading } = useGetProductsQuery(undefined, {
    skip: !isOpen,
  });

  const [adminAssignProduct, { isLoading: isAssigningAdmin }] = useAdminAssignProductMutation();
  const [updateReview, { isLoading: isUpdatingReview }] = useUpdateReviewMutation();

  const isAssigning = isAssigningAdmin || isUpdatingReview;

  useEffect(() => {
    if (review && isOpen) {
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
  }, [review, isOpen]);

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return productsList.slice(0, 10);
    const q = searchTerm.toLowerCase().trim();
    return productsList.filter((p: Product) => {
      const title = (p.title || p.name || "").toLowerCase();
      const code = (p.productCode || "").toLowerCase();
      const category = (typeof p.category === "string" ? p.category : p.category?.name || "").toLowerCase();
      return title.includes(q) || code.includes(q) || category.includes(q);
    }).slice(0, 15);
  }, [productsList, searchTerm]);

  // Selected product details
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

  const handleAssign = async () => {
    try {
      const payloadData = {
        productIds: selectedProductIds,
        productId: selectedProductIds.length > 0 ? selectedProductIds[0] : undefined,
      };

      try {
        await adminAssignProduct({ id: review.id, ...payloadData }).unwrap();
      } catch {
        await updateReview({ id: review.id, data: payloadData }).unwrap();
      }

      Swal.fire({
        icon: "success",
        title: "Product Associations Saved",
        text: `Assigned ${selectedProductIds.length} product(s) to review.`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Assignment Failed",
        text: err?.data?.message || err?.message || "Failed to update product associations.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Manage Associated Products
              </h2>
              <p className="text-xs text-slate-500 font-mono">Review ID: {review.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Reviewer & Comment Snippet */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Target Public Review</span>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {review.reviewerName || review.user?.name || "Anonymous Visitor"}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic truncate">
              &quot;{review.comment || "No comment provided"}&quot;
            </p>
          </div>

          {/* Selected Products Pills */}
          {selectedProductsDetails.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Selected Products ({selectedProductsDetails.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedProductsDetails.map((prod: any) => {
                  const pId = prod.id;
                  const pTitle = prod.title || prod.name || "Product";
                  const pCode = prod.productCode || prod.sku || prod.code;
                  return (
                    <div
                      key={pId}
                      className="flex items-center gap-2 pl-2.5 pr-1.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-xs font-extrabold text-indigo-700 dark:text-indigo-300 shadow-2xs"
                    >
                      <span className="truncate max-w-[180px]">{pTitle}</span>
                      {pCode && <span className="text-[10px] font-mono text-indigo-500">({pCode})</span>}
                      <button
                        type="button"
                        onClick={() => removeProduct(pId)}
                        className="p-1 hover:bg-indigo-200 dark:hover:bg-indigo-900 rounded-lg transition cursor-pointer text-indigo-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Search Catalog Products
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by product name, SKU, product code, or category..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Products Multi-Select List */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Catalog Selection ({filteredProducts.length})
            </span>

            {isProductsLoading ? (
              <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                <span className="text-xs font-semibold">Loading catalog...</span>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                {filteredProducts.map((prod: Product) => {
                  const isSelected = selectedProductIds.includes(prod.id);
                  const img = prod.thumbnailImage || (prod.images && prod.images[0]) || (prod.productImages && prod.productImages[0]);
                  const title = prod.title || prod.name || "Untitled Product";
                  const code = prod.productCode;

                  return (
                    <div
                      key={prod.id}
                      onClick={() => toggleSelectProduct(prod.id)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-indigo-50/80 border-indigo-500 dark:bg-indigo-950/60 dark:border-indigo-500 shadow-2xs"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Handled by container onClick
                          className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500 cursor-pointer"
                        />

                        {/* Product Image */}
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700 flex-shrink-0">
                          <SafeImage
                            src={img}
                            alt={title}
                            fill
                            className="object-cover"
                            fallbackSrc="/placeholder-product.png"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate">
                            {title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            SKU / CODE: {code || "N/A"}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                No matching products found.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAssign}
            disabled={isAssigning}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-extrabold shadow-md transition cursor-pointer"
          >
            {isAssigning && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Save Product Associations ({selectedProductIds.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
