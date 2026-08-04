"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetReviewFormByOrderItemQuery,
  useCreateReviewMutation,
} from "@/services/reviewApi";
import { uploadMediaFile } from "@/services/uploadService";
import { OrderItemView } from "@/types/order";
import { CreateReviewInput } from "@/types/review";

import {
  X,
  Star,
  UploadCloud,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import Swal from "sweetalert2";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating between 1 and 5 stars").max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters long"),
  images: z.array(z.string()),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface WriteReviewModalProps {
  selectedOrderItem?: OrderItemView | {
    id: string; // orderItemId
    productId?: string;
    productTitle?: string;
    productImage?: string;
    product?: {
      id?: string;
      title?: string;
      name?: string;
      thumbnailImage?: string;
    };
  } | null;
  orderItemId?: string;
  productId?: string;
  productTitle?: string;
  productImage?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  selectedOrderItem,
  orderItemId,
  productId,
  productTitle,
  productImage,
  isOpen,
  onClose,
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);

  // 1. Determine actual orderItemId (NEVER open or submit with undefined)
  const actualOrderItemId = selectedOrderItem?.id || orderItemId || "";

  // 2. Query GET /reviews/form/{orderItemId} using actual orderItemId
  const { data: eligibility, isLoading: isCheckingEligibility } =
    useGetReviewFormByOrderItemQuery(actualOrderItemId, {
      skip: !actualOrderItemId || !isOpen,
    });

  const [createReviewMutation, { isLoading: isSubmitting }] = useCreateReviewMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
      images: [],
    },
  });

  const currentRating = watch("rating");

  // 3. Reset or Prefill form when modal opens or eligibility response loads
  useEffect(() => {
    if (isOpen) {
      if (eligibility?.existingReview) {
        reset({
          rating: eligibility.existingReview.rating || 5,
          comment: eligibility.existingReview.comment || "",
          images: eligibility.existingReview.images || [],
        });
        setImages(eligibility.existingReview.images || []);
      } else {
        reset({
          rating: 5,
          comment: "",
          images: [],
        });
        setImages([]);
      }
    }
  }, [isOpen, eligibility, reset]);

  if (!isOpen) return null;

  // Product title & image resolution
  const title =
    (selectedOrderItem as any)?.productTitle ||
    selectedOrderItem?.product?.title ||
    selectedOrderItem?.product?.name ||
    productTitle ||
    eligibility?.productTitle ||
    "Purchased Product";

  const image =
    (selectedOrderItem as any)?.productImage ||
    selectedOrderItem?.product?.thumbnailImage ||
    productImage ||
    eligibility?.productImage;

  // Eligibility flags
  const isMissingOrderItemId = !actualOrderItemId;
  const isNotEligible = !isMissingOrderItemId && eligibility?.canReview === false;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > 5) {
      Swal.fire({
        icon: "warning",
        title: "Limit Exceeded",
        text: "You can upload a maximum of 5 review photos.",
      });
      return;
    }

    try {
      setIsUploading(true);
      const uploadedUrls: string[] = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;
        const res = await uploadMediaFile(file);
        uploadedUrls.push(res.url);
      }

      const updated = [...images, ...uploadedUrls];
      setImages(updated);
      setValue("images", updated, { shouldValidate: true });

      Swal.fire({
        icon: "success",
        title: "Images Uploaded",
        text: `${uploadedUrls.length} image(s) attached to review.`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err?.message || "Could not upload review images.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    setValue("images", updated, { shouldValidate: true });
  };

  const onFormSubmit = async (data: ReviewFormData) => {
    // Safety check: Never submit if orderItemId is missing
    if (isMissingOrderItemId) {
      Swal.fire({
        icon: "error",
        title: "Missing Order Item",
        text: "Unable to identify purchased item.",
      });
      return;
    }

    const payload: CreateReviewInput = {
      orderItemId: actualOrderItemId,
      productId: selectedOrderItem?.productId || productId || eligibility?.productId,
      rating: data.rating,
      comment: data.comment,
      images: data.images || [],
    };

    // Requirement 8: Console log payload during development before POST request
    console.log("Submitting POST /reviews Payload:", payload);

    try {
      await createReviewMutation(payload).unwrap();

      Swal.fire({
        icon: "success",
        title: "Review Submitted",
        text: "Thank you! Your product review has been submitted for approval.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });

      onClose();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: err?.data?.message || "Could not submit review.",
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
                Write a Product Review
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
            {image ? (
              <Image src={image} alt={title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
              {title}
            </h3>
            {actualOrderItemId ? (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 font-mono">
                <CheckCircle className="w-3 h-3" /> Item ID: {actualOrderItemId}
              </span>
            ) : (
              <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Order Item Required
              </span>
            )}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Requirement 6: If orderItemId is missing */}
          {isMissingOrderItemId ? (
            <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-100">
                Unable to Identify Purchased Item
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                Please write reviews from your delivered order items under your order history.
              </p>
            </div>
          ) : isCheckingEligibility ? (
            <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              <span className="text-xs font-semibold">Verifying purchase & delivery status...</span>
            </div>
          ) : isNotEligible ? (
            /* Requirement 7: If API returns Not Eligible */
            <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100">
                Delivery Required
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold">
                You can review this product only after delivery.
              </p>
            </div>
          ) : (
            /* Eligible Form */
            <form id="reviewForm" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              {/* Star Rating Input */}
              <div className="space-y-2 text-center py-2 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Overall Rating *
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

              {/* Review Comment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Your Detailed Review *
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

              {/* Attach Photos */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Attach Product Photos (Optional)</span>
                  <span className="text-[10px] text-slate-400">{images.length}/5 Photos</span>
                </label>

                {/* Thumbnails grid */}
                <div className="flex flex-wrap gap-2">
                  {images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group"
                    >
                      <Image src={imgUrl} alt="Review attachment" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-rose-400" />
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <label className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex flex-col items-center justify-center gap-1 cursor-pointer">
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4 text-slate-400" />
                          <span className="text-[9px] font-bold text-slate-500">Add Photo</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </form>
          )}
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
            form="reviewForm"
            disabled={isMissingOrderItemId || isNotEligible || isSubmitting || isUploading}
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
