"use client";

import React, { useState, useMemo } from "react";
import { ReviewItem } from "@/types/review";
import { useUpdateReviewMutation } from "@/services/reviewApi";
import { useGetProductsQuery } from "@/services/productApi";
import { AssignProductModal } from "./AssignProductModal";
import { SafeImage } from "@/components/ui/SafeImage";
import {
  X,
  Star,
  User,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Clock,
  PackagePlus,
  Send,
  Edit3,
} from "lucide-react";
import Swal from "sweetalert2";

interface ViewReviewModalProps {
  review: ReviewItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export const ViewReviewModal: React.FC<ViewReviewModalProps> = ({
  review,
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  // Fetch catalog products to resolve full product details & codes if missing
  const { data: catalogProducts = [] } = useGetProductsQuery(undefined, {
    skip: !isOpen || !review,
  });

  const associatedProducts = useMemo(() => {
    if (!review) return [];

    // 1. If review.products is a non-empty array
    if (review.products && Array.isArray(review.products) && review.products.length > 0) {
      return review.products.map((p) => {
        const matched = catalogProducts.find((cp) => cp.id === p.id);
        return {
          id: p.id || matched?.id || "",
          title: p.title || p.name || matched?.title || matched?.name || "Product",
          productCode: p.productCode || p.sku || p.code || matched?.productCode || "N/A",
          image: p.thumbnailImage || p.thumbnail || p.image || (p.images && p.images[0]) || matched?.thumbnailImage || (matched?.images && matched.images[0]) || null,
        };
      });
    }

    // 2. If review.productIds is a non-empty array
    if (review.productIds && Array.isArray(review.productIds) && review.productIds.length > 0) {
      return review.productIds.map((id) => {
        const matched = catalogProducts.find((cp) => cp.id === id);
        return {
          id,
          title: matched?.title || matched?.name || (review.product?.id === id ? review.product.title : null) || `Product ID: ${id}`,
          productCode: matched?.productCode || (review.product?.id === id ? review.product.productCode || review.product.sku : null) || "N/A",
          image: matched?.thumbnailImage || (matched?.images && matched.images[0]) || (review.product?.id === id ? review.product.thumbnailImage || review.product.image : null),
        };
      });
    }

    // 3. Single product fallback
    if (review.product || review.productId) {
      const pId = review.product?.id || review.productId || "";
      const matched = catalogProducts.find((cp) => cp.id === pId);
      return [
        {
          id: pId,
          title: review.product?.title || review.product?.name || matched?.title || matched?.name || (review.productId ? `Product: ${review.productId}` : "Product"),
          productCode: review.product?.productCode || review.product?.sku || review.product?.code || matched?.productCode || "N/A",
          image: review.product?.thumbnailImage || review.product?.thumbnail || review.product?.image || matched?.thumbnailImage || (matched?.images && matched.images[0]),
        },
      ];
    }

    return [];
  }, [review, catalogProducts]);

  if (!isOpen || !review) return null;

  const hasAssociatedProducts = associatedProducts.length > 0;
  const customerName = review.reviewerName || review.user?.name || "Anonymous Visitor";
  const customerEmail = review.reviewerEmail || review.user?.email || "-";
  const status = (review.status || "PENDING").toUpperCase();
  const isVerified = review.isVerifiedPurchase === true;
  const source = review.source || (isVerified ? "VERIFIED" : "PUBLIC");

  const handlePublish = async () => {
    try {
      await updateReview({
        id: review.id,
        data: { status: "PUBLISHED" },
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Review Published",
        text: "Review status set to PUBLISHED.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });

      if (onRefresh) onRefresh();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Publish Failed",
        text: err?.data?.message || "Failed to publish review.",
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Review Details Audit
                </h2>
                <p className="text-xs text-slate-500 font-mono">ID: {review.id}</p>
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
          <div className="p-6 overflow-y-auto space-y-5">
            {/* Status & Source Banner */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Source:
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-mono">
                  {source}
                </span>
              </div>

              {/* Status Badges */}
              {(status === "PUBLISHED" || status === "APPROVED") && (
                <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Published
                </span>
              )}
              {(status === "HIDDEN" || status === "REJECTED") && (
                <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 inline-flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Hidden
                </span>
              )}
              {status === "PENDING" && (
                <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Pending
                </span>
              )}
            </div>

            {/* Target Associated Products Section */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Associated Products ({associatedProducts.length})
                </span>
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-[11px] font-extrabold hover:bg-indigo-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <PackagePlus className="w-3.5 h-3.5" />
                  <span>{hasAssociatedProducts ? "Manage Products" : "Assign Product"}</span>
                </button>
              </div>

              {hasAssociatedProducts ? (
                <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {associatedProducts.map((prod) => (
                    <div
                      key={prod.id || prod.title}
                      className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3.5 shadow-2xs"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <SafeImage
                          src={prod.image}
                          alt={prod.title}
                          fill
                          className="object-cover"
                          fallbackSrc="/placeholder-product.png"
                        />
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 truncate">
                          {prod.title}
                        </h4>
                        <div className="flex items-center gap-2 flex-wrap text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          <span>
                            SKU / CODE: <strong className="text-slate-700 dark:text-slate-200 font-semibold">{prod.productCode}</strong>
                          </span>
                          {prod.id && <span className="text-slate-400">• ID: {prod.id}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-300">
                  <span>No products assigned to this review</span>
                </div>
              )}
            </div>

            {/* Customer Info & Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Reviewer</span>
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  <span>{customerName}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 block truncate">{customerEmail}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Rating & Verified</span>
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 ml-1">
                    {review.rating}/5
                  </span>
                </div>
                <span className="text-[10px] font-extrabold block text-slate-500">
                  Verified Purchase: {isVerified ? "✓ Yes" : "No"}
                </span>
              </div>
            </div>

            {/* Title & Comment */}
            <div className="space-y-2">
              {review.title && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Review Title</span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {review.title}
                  </h4>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Review Comment:
                </span>
                <p className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 leading-relaxed">
                  {review.comment ? `"${review.comment}"` : <span className="italic text-slate-400">No written comment provided.</span>}
                </p>
              </div>
            </div>

            {/* Additional Meta (Order ID & Created Date) */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
              <span>Order ID: {review.orderId || review.orderItemId || "N/A"}</span>
              <span>Date: {new Date(review.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900 gap-3">
            {!hasAssociatedProducts && (
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-extrabold hover:bg-indigo-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <PackagePlus className="w-4 h-4" />
                <span>Assign Product</span>
              </button>
            )}

            {hasAssociatedProducts && status !== "PUBLISHED" && status !== "APPROVED" && (
              <button
                onClick={handlePublish}
                disabled={isUpdating}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Publish Review</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="ml-auto px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Assign Product Submodal */}
      <AssignProductModal
        review={review}
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={() => {
          if (onRefresh) onRefresh();
        }}
      />
    </>
  );
};
