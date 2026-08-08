"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useGetProductReviewsQuery } from "@/services/reviewApi";
import { useGetOrdersQuery } from "@/services/orderApi";
import { WriteReviewModal } from "@/components/review/WriteReviewModal";
import { OrderItemView } from "@/types/order";

import {
  Star,
  MessageSquare,
  UserCheck,
  PlusCircle,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

interface ProductReviewProps {
  product: Product;
}

export const ProductReview: React.FC<ProductReviewProps> = ({ product }) => {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);

  // 1. Fetch product reviews live from backend API: GET /reviews/product/{productId}
  const { data: reviewData, isLoading } = useGetProductReviewsQuery(product.id, {
    skip: !product.id,
  });

  // 2. Fetch customer's delivered orders to find valid orderItemId for this product
  const { data: ordersData } = useGetOrdersQuery({ status: "DELIVERED" });

  // Find delivered order item matching this product ID
  const eligibleOrderItem = useMemo(() => {
    if (!ordersData?.items || ordersData.items.length === 0) return null;

    for (const order of ordersData.items) {
      if (!order.items || order.items.length === 0) continue;
      const match = order.items.find(
        (item) => item.productId === product.id || item.product?.id === product.id
      );
      if (match && match.id) {
        return match;
      }
    }
    return null;
  }, [ordersData, product.id]);

  const averageRating = reviewData?.averageRating ?? product.averageRating ?? product.ratingsAverage ?? 0;
  const totalReviews = reviewData?.totalReviews ?? product.reviewCount ?? product.ratingsCount ?? 0;
  const breakdown = reviewData?.ratingDistribution || product.ratingBreakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const reviewsList = reviewData?.reviews || product.latestReviews || [];

  const hasReviews = totalReviews > 0 || reviewsList.length > 0;

  return (
    <div className="flex flex-col gap-6 py-8 border-t border-slate-200 dark:border-slate-800 my-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
            <MessageSquare className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Customer Reviews & Ratings
            </h3>
            <p className="text-xs text-slate-500">
              Verified customer feedback and detailed ratings.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl animate-pulse space-y-4">
          <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
          <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
        </div>
      ) : !hasReviews ? (
        /* Empty Reviews State */
        <div className="flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
          <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/60 text-amber-500 rounded-2xl flex items-center justify-center shadow-inner">
            <Sparkles className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-black text-slate-800 dark:text-slate-200">
            No Reviews Yet
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
            Be the first customer to share your thoughts! Leave a review after your order is delivered.
          </p>
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="mt-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
          >
            Leave First Review
          </button>
        </div>
      ) : (
        /* Active Reviews Summary & List */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rating Summary Card */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {averageRating.toFixed(1)}
            </span>

            <div className="flex items-center gap-1 text-amber-400 my-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : i < averageRating
                      ? "fill-amber-400/50 text-amber-400"
                      : "text-slate-300 dark:text-slate-700"
                  }`}
                />
              ))}
            </div>

            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Based on {totalReviews} verified {totalReviews === 1 ? "review" : "reviews"}
            </span>
          </div>

          {/* Rating Breakdown Bars */}
          <div className="flex flex-col justify-center gap-2 p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = breakdown[stars as keyof typeof breakdown] || 0;
              const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="w-12 font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    {stars} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
                  </span>
                  <div className="flex-1 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono font-bold text-slate-500 dark:text-slate-400">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Reviews Cards List */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Approved Reviews ({reviewsList.length})
            </h4>

            <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
              {reviewsList.map((rev) => {
                const reviewerName =
                  rev.reviewerName || (rev as any).user?.name || "Verified Customer";
                const reviewerAvatar = (rev as any).user?.avatar || (rev as any).user?.image;
                const isVerified = (rev as any).isVerifiedPurchase !== false;

                return (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-2.5 shadow-2xs"
                  >
                    {/* Customer Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-extrabold text-xs flex items-center justify-center overflow-hidden border border-amber-200/60">
                          {reviewerAvatar ? (
                            <Image
                              src={reviewerAvatar}
                              alt={reviewerName}
                              width={32}
                              height={32}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            reviewerName.charAt(0).toUpperCase()
                          )}
                        </div>

                        <div>
                          <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                            {reviewerName}
                            {isVerified && (
                              <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                          </span>
                          {isVerified && (
                            <span className="text-[10px] text-emerald-600 font-semibold block">
                              Verified Buyer
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 dark:text-slate-700"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    {rev.comment && (
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        &quot;{rev.comment}&quot;
                      </p>
                    )}

                    {/* Review Image Attachments */}
                    {rev.images && rev.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {rev.images.map((img, i) => (
                          <div
                            key={i}
                            className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xs"
                          >
                            <Image
                              src={img}
                              alt="Customer review attachment"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Submit Review Modal */}
      <WriteReviewModal
        selectedOrderItem={eligibleOrderItem}
        orderItemId={eligibleOrderItem?.id}
        productId={product.id}
        productTitle={product.title}
        productImage={product.thumbnailImage}
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
      />
    </div>
  );
};

export default ProductReview;

