"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetMyReviewsQuery, useDeleteReviewMutation } from "@/services/reviewApi";
import {
  Star,
  MessageSquare,
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import Swal from "sweetalert2";

export default function MyReviewsPage() {
  const { data: reviews = [], isLoading, isError, refetch } = useGetMyReviewsQuery();
  const [deleteReviewMutation] = useDeleteReviewMutation();

  const handleDelete = async (id: string, productTitle?: string) => {
    const confirm = await Swal.fire({
      title: "Delete Review?",
      text: `Are you sure you want to delete your review for "${productTitle || "this product"}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteReviewMutation(id).unwrap();
        Swal.fire({
          icon: "success",
          title: "Review Deleted",
          text: "Your review has been removed.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
        });
        refetch();
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: err?.data?.message || "Could not delete review.",
        });
      }
    }
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || "PENDING").toUpperCase();
    if (s === "APPROVED") {
      return (
        <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 inline-flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Approved
        </span>
      );
    }
    if (s === "REJECTED") {
      return (
        <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 inline-flex items-center gap-1">
          <XCircle className="w-3 h-3" /> Rejected
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 inline-flex items-center gap-1">
        <Clock className="w-3 h-3" /> Pending Approval
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
            <MessageSquare className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              My Product Reviews
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your submitted ratings, product feedback, and upload status.
            </p>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
          Total Reviews: {reviews.length}
        </span>
      </div>

      {/* Error Alert */}
      {isError && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Failed to load your submitted reviews.</span>
          </div>
          <button onClick={() => refetch()} className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-100 dark:border-slate-800 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/60 text-amber-500 rounded-full flex items-center justify-center mx-auto">
            <Star className="w-8 h-8 fill-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            You haven&apos;t reviewed any products yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once your orders are delivered, you can write reviews directly from product pages or your order history!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Products</span>
          </Link>
        </div>
      ) : (
        /* Reviews List */
        <div className="space-y-4">
          {reviews.map((item) => {
            const productTitle = item.product?.title || item.product?.name || "Purchased Product";
            const productImage = item.product?.thumbnailImage || item.product?.thumbnail || item.product?.image;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                {/* Product Info & Review Content */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700 flex-shrink-0">
                    {productImage ? (
                      <Image src={productImage} alt={productTitle} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                        {productTitle}
                      </h3>
                      {getStatusBadge(item.status)}
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < item.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 dark:text-slate-700"
                          }`}
                        />
                      ))}
                      <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 ml-1">
                        ({item.rating}/5)
                      </span>
                    </div>

                    {/* Comment */}
                    {item.comment && (
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        &quot;{item.comment}&quot;
                      </p>
                    )}

                    {/* Images */}
                    {item.images && item.images.length > 0 && (
                      <div className="flex gap-2 pt-1">
                        {item.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700"
                          >
                            <Image src={img} alt="Review attachment" fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    <span className="text-[10px] text-slate-400 font-mono block pt-1">
                      Submitted on {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-start">
                  <button
                    onClick={() => handleDelete(item.id, productTitle)}
                    className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400 transition cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
