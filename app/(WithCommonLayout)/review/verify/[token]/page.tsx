"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/navbar/Container";
import {
  useVerifyReviewTokenQuery,
  useSubmitTokenReviewMutation,
} from "@/services/reviewApi";
import { Star, Loader2, ShoppingBag, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default function SecureReviewVerifyPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState<boolean>(false);

  // 1. Verify token status via GET /api/v1/reviews/verify/:token
  const {
    data: verifyData,
    isLoading: isVerifying,
    isError: isVerifyError,
  } = useVerifyReviewTokenQuery(token, {
    skip: !token,
  });

  const [submitTokenReview, { isLoading: isSubmitting }] = useSubmitTokenReviewMutation();

  const isLinkValid = verifyData?.valid === true && !isVerifyError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Review Required",
        text: "Please write a review comment before submitting.",
      });
      return;
    }

    try {
      await submitTokenReview({
        token,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
      }).unwrap();

      setIsSubmittedSuccessfully(true);

      Swal.fire({
        icon: "success",
        title: "Thank You!",
        text: "Thank you for reviewing your purchase!",
        confirmButtonColor: "#f59e0b",
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: err?.data?.message || err?.message || "Could not submit review. The link may have expired.",
      });
    }
  };

  const productTitle =
    verifyData?.productTitle ||
    verifyData?.productName ||
    verifyData?.product?.title ||
    verifyData?.product?.name ||
    "Purchased Product";

  const productImage =
    verifyData?.productImage ||
    verifyData?.productThumbnail ||
    verifyData?.product?.thumbnailImage ||
    verifyData?.product?.image;

  if (isVerifying) {
    return (
      <div className="w-full min-h-[70vh] bg-slate-50/50 dark:bg-slate-950 flex flex-col items-center justify-center py-16">
        <Container className="flex flex-col items-center justify-center gap-4 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Verifying your review link...
          </p>
        </Container>
      </div>
    );
  }

  // Section 5: Invalid or Expired Token View
  if (!isLinkValid) {
    return (
      <div className="w-full min-h-[75vh] bg-slate-50/50 dark:bg-slate-950 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Review Link Unavailable
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              This review link has expired or has already been used.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-extrabold text-xs hover:bg-slate-800 transition cursor-pointer shadow-md w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>
        </div>
      </div>
    );
  }

  // Section 4: Valid Token Review Submission View
  return (
    <div className="w-full min-h-[80vh] bg-slate-50/50 dark:bg-slate-950 py-12 px-4">
      <Container className="max-w-xl mx-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="inline-flex p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 mb-2">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Rate Your Purchase
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Share your honest feedback on your recent order.
            </p>
          </div>

          {/* Product Preview Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-900 overflow-hidden relative border border-slate-200 dark:border-slate-700 flex-shrink-0">
              {productImage ? (
                <Image src={productImage} alt={productTitle} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Verified Purchase
              </span>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 line-clamp-2">
                {productTitle}
              </h2>
            </div>
          </div>

          {/* Success Message Banner if already submitted */}
          {isSubmittedSuccessfully ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-100">
                Thank you for reviewing your purchase!
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                Your feedback has been recorded and submitted successfully.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700 transition"
              >
                <span>Back to Store</span>
              </Link>
            </div>
          ) : (
            /* Review Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Rating */}
              <div className="space-y-2 text-center py-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Your Rating *
                </label>

                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoverRating || rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1.5 transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            isFilled
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 dark:text-slate-700"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
                  {rating === 5 && "★★★★★ Outstanding"}
                  {rating === 4 && "★★★★☆ Very Good"}
                  {rating === 3 && "★★★☆☆ Average"}
                  {rating === 2 && "★★☆☆☆ Below Average"}
                  {rating === 1 && "★☆☆☆☆ Poor"}
                </span>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Review Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your review in a title..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Comment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Your Review *
                </label>
                <textarea
                  rows={5}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details of your experience with the product, quality, delivery, and overall satisfaction..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Submit Review</span>
              </button>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
