"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SafeImage } from "@/components/ui/SafeImage";
import { useSubmitPublicReviewMutation } from "@/services/reviewApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/features/auth/authSlice";

import {
  X,
  Star,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import Swal from "sweetalert2";

const publicReviewSchema = z.object({
  reviewerName: z.string().min(2, "Name must be at least 2 characters long"),
  reviewerEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  rating: z.number().min(1, "Please select a rating between 1 and 5 stars").max(5),
  title: z.string().optional(),
  comment: z.string().min(5, "Comment must be at least 5 characters long"),
});

type PublicReviewFormData = z.infer<typeof publicReviewSchema>;

interface WriteReviewModalProps {
  productId?: string;
  productTitle?: string;
  productImage?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  productId,
  productTitle,
  productImage,
  isOpen,
  onClose,
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const currentUser = useAppSelector(selectCurrentUser);

  const [submitPublicReview, { isLoading: isSubmitting }] = useSubmitPublicReviewMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PublicReviewFormData>({
    resolver: zodResolver(publicReviewSchema),
    defaultValues: {
      reviewerName: "",
      reviewerEmail: "",
      rating: 5,
      title: "",
      comment: "",
    },
  });

  const currentRating = watch("rating");

  useEffect(() => {
    if (isOpen) {
      reset({
        reviewerName: currentUser?.name || "",
        reviewerEmail: currentUser?.email || "",
        rating: 5,
        title: "",
        comment: "",
      });
      setHoverRating(0);
    }
  }, [isOpen, currentUser, reset]);

  if (!isOpen) return null;

  const displayTitle = productTitle || "Product";
  const displayImage = productImage;

  const onFormSubmit = async (data: PublicReviewFormData) => {
    try {
      const payload = {
        productId,
        reviewerName: data.reviewerName.trim(),
        reviewerEmail: data.reviewerEmail?.trim() || undefined,
        rating: data.rating,
        title: data.title?.trim() || undefined,
        comment: data.comment.trim(),
      };

      await submitPublicReview(payload).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Review Submitted",
        text: "Thank you! Your review has been submitted and is waiting for approval.",
        confirmButtonColor: "#f59e0b",
      });

      onClose();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: err?.data?.message || err?.message || "Could not submit review. Please try again.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Write a Review
              </h2>
              <p className="text-xs text-slate-500">
                Share your experience to help fellow shoppers.
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

        {/* Product Preview Card */}
        <div className="px-6 pt-4 pb-3 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/60">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700 flex-shrink-0">
            <SafeImage
              src={displayImage}
              alt={displayTitle}
              fill
              className="object-cover"
              fallbackSrc="/placeholder-product.png"
            />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
              {displayTitle}
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">
              Public Customer Review
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          <form id="publicReviewForm" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            {/* Reviewer Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Reviewer Name *
              </label>
              <input
                type="text"
                placeholder="Enter your name..."
                {...register("reviewerName")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              {errors.reviewerName && (
                <p className="text-[11px] font-medium text-rose-500">{errors.reviewerName.message}</p>
              )}
            </div>

            {/* Email (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Email (Optional)</span>
                <span className="text-[10px] text-slate-400">Kept private</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("reviewerEmail")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              {errors.reviewerEmail && (
                <p className="text-[11px] font-medium text-rose-500">{errors.reviewerEmail.message}</p>
              )}
            </div>

            {/* Star Rating Input */}
            <div className="space-y-2 text-center py-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Rating *
              </label>

              <div className="flex items-center justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= (hoverRating || currentRating);
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setValue("rating", star, { shouldValidate: true })}
                      className="p-1.5 transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          isFilled
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 dark:text-slate-700"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block">
                {currentRating === 5 && "★★★★★ Outstanding"}
                {currentRating === 4 && "★★★★☆ Very Good"}
                {currentRating === 3 && "★★★☆☆ Average"}
                {currentRating === 2 && "★★☆☆☆ Below Average"}
                {currentRating === 1 && "★☆☆☆☆ Poor"}
              </span>
              {errors.rating && (
                <p className="text-[11px] font-medium text-rose-500">{errors.rating.message}</p>
              )}
            </div>

            {/* Review Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Review Title
              </label>
              <input
                type="text"
                placeholder="Give your review a short title (e.g. Great quality product!)..."
                {...register("title")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              {errors.title && (
                <p className="text-[11px] font-medium text-rose-500">{errors.title.message}</p>
              )}
            </div>

            {/* Review Comment */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Review Comment *
              </label>
              <textarea
                rows={4}
                placeholder="What did you like or dislike about this product? Mention quality, sizing, material, or delivery experience..."
                {...register("comment")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              {errors.comment && (
                <p className="text-[11px] font-medium text-rose-500">{errors.comment.message}</p>
              )}
            </div>
          </form>
        </div>

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
            form="publicReviewForm"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-extrabold shadow-md transition cursor-pointer"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Submit Review</span>
          </button>
        </div>
      </div>
    </div>
  );
};
