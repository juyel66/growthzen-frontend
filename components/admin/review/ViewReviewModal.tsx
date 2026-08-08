"use client";

import React from "react";
import Image from "next/image";
import { ReviewItem } from "@/types/review";
import { X, Star, Calendar, User, ShoppingBag, CheckCircle2, XCircle, Clock } from "lucide-react";

interface ViewReviewModalProps {
  review: ReviewItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewReviewModal: React.FC<ViewReviewModalProps> = ({
  review,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !review) return null;

  const productTitle = review.product?.title || review.product?.name || `Product ID: ${review.productId}`;
  const productImage = review.product?.thumbnailImage || review.product?.thumbnail || review.product?.image;
  const customerName = review.reviewerName || review.user?.name || "Customer";
  const customerEmail = review.reviewerEmail || review.user?.email || "-";
  const status = (review.status || "PENDING").toUpperCase();

  return (
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
          {/* Status Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Approval Status
            </span>
            {status === "APPROVED" && (
              <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approved
              </span>
            )}
            {status === "REJECTED" && (
              <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 inline-flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Rejected
              </span>
            )}
            {status === "PENDING" && (
              <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Pending Review
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700 flex-shrink-0">
              {productImage ? (
                <Image src={productImage} alt={productTitle} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase text-slate-400">Target Product</span>
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                {productTitle}
              </h4>
            </div>
          </div>

          {/* Customer Info & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Customer</span>
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100">
                <User className="w-3.5 h-3.5 text-blue-500" />
                <span>{customerName}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 block truncate">{customerEmail}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Submitted Rating</span>
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
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
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Customer Feedback Comment:
            </span>
            <p className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 leading-relaxed">
              {review.comment ? `"${review.comment}"` : <span className="italic text-slate-400">No written comment provided.</span>}
            </p>
          </div>

          {/* Uploaded Images */}
          {review.images && review.images.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Uploaded Customer Photos ({review.images.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {review.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xs"
                  >
                    <Image src={img} alt="Review attachment" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="text-right text-[11px] font-mono text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
            Created Date: {new Date(review.createdAt).toLocaleString()}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-900">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 transition cursor-pointer"
          >
            Close Audit Modal
          </button>
        </div>
      </div>
    </div>
  );
};

