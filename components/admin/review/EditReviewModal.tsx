"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ReviewItem, ReviewStatus, UpdateReviewInput } from "@/types/review";
import { X, Loader2, Star, Edit3, CheckCircle2, XCircle, Clock } from "lucide-react";

const editReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  status: z.enum(["APPROVED", "PENDING", "REJECTED"]),
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
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditReviewFormData>({
    resolver: zodResolver(editReviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
      status: "APPROVED",
    },
  });

  const currentRating = watch("rating");
  const currentStatus = watch("status");

  useEffect(() => {
    if (review) {
      reset({
        rating: review.rating || 5,
        comment: review.comment || "",
        status: (review.status as ReviewStatus) || "APPROVED",
      });
    }
  }, [review, reset, isOpen]);

  if (!isOpen || !review) return null;

  const onFormSubmit = async (data: EditReviewFormData) => {
    await onSaveReview(review.id, data);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Edit Review & Status
              </h2>
              <p className="text-xs text-slate-500">
                Update review content or change approval status.
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
        <form id="editReviewForm" onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
          {/* Status Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Approval Status *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setValue("status", "APPROVED")}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
                  currentStatus === "APPROVED"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve</span>
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
                onClick={() => setValue("status", "REJECTED")}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
                  currentStatus === "REJECTED"
                    ? "bg-rose-600 text-white border-rose-600 shadow-md"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700"
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
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
