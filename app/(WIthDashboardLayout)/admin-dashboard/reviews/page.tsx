"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { ReviewItem, UpdateReviewInput } from "@/types/review";
import {
  useGetAllReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "@/services/reviewApi";

import { ViewReviewModal } from "@/components/admin/review/ViewReviewModal";
import { EditReviewModal } from "@/components/admin/review/EditReviewModal";

import {
  Star,
  Search,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
  Filter,
} from "lucide-react";
import Swal from "sweetalert2";

export default function AdminReviewsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modals state
  const [selectedReviewForView, setSelectedReviewForView] = useState<ReviewItem | null>(null);
  const [selectedReviewForEdit, setSelectedReviewForEdit] = useState<ReviewItem | null>(null);

  // RTK Query hooks
  const { data: reviewsList = [], isLoading, isFetching, isError, refetch } = useGetAllReviewsQuery();
  const [updateReviewMutation, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReviewMutation] = useDeleteReviewMutation();

  // Filter list by status & search term
  const filteredReviews = useMemo(() => {
    let list = [...reviewsList];

    if (statusFilter !== "ALL") {
      list = list.filter((r) => (r.status || "PENDING").toUpperCase() === statusFilter);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter((r) => {
        const prodTitle = (r.product?.title || r.product?.name || "").toLowerCase();
        const custName = (r.reviewerName || r.user?.name || "").toLowerCase();
        const custEmail = (r.reviewerEmail || r.user?.email || "").toLowerCase();
        const comment = (r.comment || "").toLowerCase();
        return (
          prodTitle.includes(q) ||
          custName.includes(q) ||
          custEmail.includes(q) ||
          comment.includes(q)
        );
      });
    }

    return list;
  }, [reviewsList, statusFilter, searchTerm]);

  // Quick Approve Review
  const handleQuickApprove = async (review: ReviewItem) => {
    try {
      await updateReviewMutation({
        id: review.id,
        data: { status: "APPROVED" },
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Review Approved",
        text: "Review is now published and product rating recalculated automatically.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Approval Failed",
        text: err?.data?.message || "Failed to approve review.",
      });
    }
  };

  // Quick Reject Review
  const handleQuickReject = async (review: ReviewItem) => {
    try {
      await updateReviewMutation({
        id: review.id,
        data: { status: "REJECTED" },
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Review Rejected",
        text: "Review marked as rejected.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Rejection Failed",
        text: err?.data?.message || "Failed to reject review.",
      });
    }
  };

  // Edit Modal Submit
  const handleSaveEditSubmit = async (id: string, data: UpdateReviewInput) => {
    try {
      await updateReviewMutation({ id, data }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Review Updated",
        text: "Review details and status updated successfully.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });

      setSelectedReviewForEdit(null);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err?.data?.message || "Failed to update review.",
      });
    }
  };

  // Delete Review
  const handleDeleteReview = async (review: ReviewItem) => {
    const confirm = await Swal.fire({
      title: "Delete Review?",
      text: "Are you sure you want to permanently delete this customer review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete Permanently",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteReviewMutation(review.id).unwrap();
        Swal.fire({
          icon: "success",
          title: "Review Deleted",
          text: "Review permanently removed.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
        });
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: err?.data?.message || "Failed to delete review.",
        });
      }
    }
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || "PENDING").toUpperCase();
    if (s === "APPROVED") {
      return (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-md uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 inline-flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Approved
        </span>
      );
    }
    if (s === "REJECTED") {
      return (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-md uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 inline-flex items-center gap-1">
          <XCircle className="w-3 h-3" /> Rejected
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-md uppercase tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 inline-flex items-center gap-1">
        <Clock className="w-3 h-3" /> Pending
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6 animate-pulse">
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Customer Reviews Audit
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise moderation workflow for customer ratings, approval triggers, & product feedback.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
          <span>Refresh Reviews</span>
        </button>
      </div>

      {/* Error Alert */}
      {isError && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Failed to load reviews from backend API endpoint GET /reviews.</span>
          </div>
          <button onClick={() => refetch()} className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product, customer name/email, or review comment..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                statusFilter === st
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-2xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Rating</th>
                <th className="p-3.5">Review Comment</th>
                <th className="p-3.5 text-center">Images</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right w-[190px] min-w-[190px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((item) => {
                  const prodTitle = item.product?.title || item.product?.name || `Product: ${item.productId}`;
                  const prodImg = item.product?.thumbnailImage || item.product?.thumbnail || item.product?.image;
                  const custName = item.reviewerName || item.user?.name || "Customer";
                  const custEmail = item.reviewerEmail || item.user?.email || "-";
                  const isPending = (item.status || "PENDING").toUpperCase() === "PENDING";
                  const isApproved = (item.status || "PENDING").toUpperCase() === "APPROVED";

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Product Thumbnail & Name */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700 flex-shrink-0">
                            {prodImg ? (
                              <Image src={prodImg} alt={prodTitle} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <ShoppingBag className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <span className="font-extrabold text-slate-900 dark:text-slate-100 max-w-[160px] truncate">
                            {prodTitle}
                          </span>
                        </div>
                      </td>

                      {/* Customer Name & Email */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {custName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 max-w-[130px] truncate">
                            {custEmail}
                          </span>
                        </div>
                      </td>

                      {/* Rating Stars */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-0.5 text-amber-400 font-bold">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < item.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300 dark:text-slate-700"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-slate-700 dark:text-slate-300 ml-1">
                            ({item.rating})
                          </span>
                        </div>
                      </td>

                      {/* Review Comment Snippet */}
                      <td className="p-3.5 max-w-[200px] truncate text-slate-600 dark:text-slate-300 font-medium">
                        {item.comment ? `"${item.comment}"` : <span className="italic text-slate-400">No comment</span>}
                      </td>

                      {/* Images Count */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        {item.images && item.images.length > 0 ? (
                          <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-mono font-bold text-[11px] border border-blue-200">
                            {item.images.length} Photos
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">-</span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="p-3.5 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Date */}
                      <td className="p-3.5 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right whitespace-nowrap w-[190px] min-w-[190px]">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Modal */}
                          <button
                            onClick={() => setSelectedReviewForView(item)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400 transition cursor-pointer"
                            title="View Full Audit"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Approve */}
                          <button
                            disabled={isApproved}
                            onClick={() => handleQuickApprove(item)}
                            className={`p-1.5 rounded-lg transition ${
                              !isApproved
                                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 cursor-pointer"
                                : "bg-slate-100 text-slate-400 dark:bg-slate-800/60 opacity-40 cursor-not-allowed"
                            }`}
                            title={isApproved ? "Already Approved" : "Quick Approve Review"}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Reject */}
                          <button
                            onClick={() => handleQuickReject(item)}
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-400 transition cursor-pointer"
                            title="Reject Review"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Modal */}
                          <button
                            onClick={() => setSelectedReviewForEdit(item)}
                            className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 transition cursor-pointer"
                            title="Edit Review Content & Status"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteReview(item)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400 transition cursor-pointer"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-slate-400">
                    No customer reviews match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      <ViewReviewModal
        review={selectedReviewForView}
        isOpen={Boolean(selectedReviewForView)}
        onClose={() => setSelectedReviewForView(null)}
      />

      {/* Edit Modal */}
      <EditReviewModal
        review={selectedReviewForEdit}
        isOpen={Boolean(selectedReviewForEdit)}
        onClose={() => setSelectedReviewForEdit(null)}
        onSaveReview={handleSaveEditSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
}

