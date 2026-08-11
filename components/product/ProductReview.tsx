"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/types/product";
import { useGetProductReviewsQuery } from "@/services/reviewApi";
import { WriteReviewModal } from "@/components/review/WriteReviewModal";
import { maskReviewerName } from "@/utils/maskName";
import Image from "next/image";

import {
  Star,
  MessageSquare,
  CheckCircle2,
  PlusCircle,
  Sparkles,
  AlertCircle,
  ChevronDown,
  Loader2,
} from "lucide-react";

import { SafeImage } from "@/components/ui/SafeImage";

interface ProductReviewProps {
  product: Product;
}

type SortOption = "MOST_RECENT" | "HIGHEST_RATED" | "LOWEST_RATED";

const PAGE_SIZE = 5;

export const ProductReview: React.FC<ProductReviewProps> = ({ product }) => {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>("MOST_RECENT");
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Fetch published reviews from API: GET /api/v1/reviews/product/:productId
  const {
    data: reviewData,
    isLoading,
    isError,
  } = useGetProductReviewsQuery(product.id, {
    skip: !product.id,
  });

  // Requirement 1, 6 & 8: Filter raw reviews list to strictly include ONLY approved/published/visible reviews
  const publicReviews = useMemo(() => {
    const raw = reviewData?.reviews || product.latestReviews || [];
    return raw.filter((r: any) => {
      // Check status string if present (Must be PUBLISHED or APPROVED)
      if (r.status) {
        const st = String(r.status).toUpperCase();
        if (st !== "PUBLISHED" && st !== "APPROVED") {
          return false;
        }
      }
      // Check boolean flags if present
      if (
        r.isPublished === false ||
        r.isApproved === false ||
        r.showWithProduct === false ||
        r.visible === false ||
        r.published === false
      ) {
        return false;
      }

      // Multi-product matching check: if review has productIds/products, ensure current product matches
      if (product.id) {
        const pId = String(product.id);
        const matchesSingle = r.productId === pId || r.product?.id === pId;
        const matchesArray = (Array.isArray(r.productIds) && r.productIds.includes(pId)) ||
          (Array.isArray(r.products) && r.products.some((p: any) => String(p.id || p) === pId));

        if (!matchesSingle && !matchesArray && (r.productId || (r.productIds && r.productIds.length > 0))) {
          return false;
        }
      }

      return true;
    });
  }, [reviewData, product.latestReviews, product.id]);

  // Requirement 5 & 11: Calculate aggregate statistics strictly from publicly visible reviews
  const totalReviews = typeof reviewData?.totalReviews === "number" ? reviewData.totalReviews : publicReviews.length;
  const averageRating =
    typeof reviewData?.averageRating === "number" && reviewData.averageRating > 0
      ? reviewData.averageRating
      : publicReviews.length > 0
      ? Math.round(
          (publicReviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / publicReviews.length) * 10
        ) / 10
      : 0;

  const breakdown = useMemo(() => {
    if (reviewData?.ratingDistribution) {
      return reviewData.ratingDistribution;
    }
    const dist: Record<1 | 2 | 3 | 4 | 5, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    publicReviews.forEach((r: any) => {
      const star = Math.min(Math.max(Math.round(r.rating || 5), 1), 5) as 1 | 2 | 3 | 4 | 5;
      dist[star] = (dist[star] || 0) + 1;
    });
    return dist;
  }, [reviewData, publicReviews]);

  const hasReviews = totalReviews > 0;
  const productTitle = product.title || product.name || "Product";
  const productImage =
    product.thumbnailImage ||
    (product.images && product.images[0]) ||
    (product.productImages && product.productImages[0]);

  // Requirement 9: Sort reviews safely on the frontend
  const sortedReviews = useMemo(() => {
    const list = [...publicReviews];
    if (sortBy === "HIGHEST_RATED") {
      return list.sort((a: any, b: any) => b.rating - a.rating);
    }
    if (sortBy === "LOWEST_RATED") {
      return list.sort((a: any, b: any) => a.rating - b.rating);
    }
    // MOST_RECENT
    return list.sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [publicReviews, sortBy]);

  // Requirement 8: Paginated slice
  const displayedReviews = useMemo(() => {
    return sortedReviews.slice(0, visibleCount);
  }, [sortedReviews, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <div className="flex flex-col gap-6 py-8 border-t border-slate-200 dark:border-slate-800 my-6">
      {/* Requirement 14: SEO Schema.org AggregateRating & Review structured data */}
      {hasReviews && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: productTitle,
              image: productImage ? [productImage] : undefined,
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: averageRating,
                reviewCount: totalReviews,
              },
              review: publicReviews.slice(0, 5).map((rev: any) => ({
                "@type": "Review",
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: rev.rating,
                  bestRating: "5",
                },
                author: {
                  "@type": "Person",
                  name: maskReviewerName(rev.reviewerName || rev.user?.name),
                },
                datePublished: rev.createdAt,
                reviewBody: rev.comment || "",
              })),
            }),
          }}
        />
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 shadow-2xs">
            <MessageSquare className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Customer Reviews & Ratings
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Verified customer feedback and detailed ratings.
            </p>
          </div>
        </div>

        {/* Top Write a Review Button */}
        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Requirement 12: Loading State */}
      {isLoading ? (
        <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span className="text-xs font-bold">Loading reviews...</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4 animate-pulse">
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        </div>
      ) : isError ? (
        /* Requirement 12: Friendly Error State */
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 text-slate-600 dark:text-slate-400">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <span className="text-xs font-bold">Unable to load reviews. Please try again.</span>
        </div>
      ) : !hasReviews ? (
        /* Requirement 6: No Review State */
        <div className="flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
          <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/60 text-amber-500 rounded-2xl flex items-center justify-center shadow-inner">
            <Sparkles className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-black text-slate-800 dark:text-slate-200">
            No Reviews Yet
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
            Be the first to share your experience with this product.
          </p>
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="mt-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition cursor-pointer shadow-sm"
          >
            Write a Review
          </button>
        </div>
      ) : (
        /* Requirement 2, 3, 4, 5, 8, 9, 10, 11: Active Published Reviews Section */
        <div className="space-y-8">
          {/* Rating Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800">
            {/* Overall Rating Block */}
            <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                Overall Rating
              </span>
              <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tight flex items-baseline gap-1">
                <span>{averageRating.toFixed(1)}</span>
                <span className="text-lg font-bold text-slate-400 dark:text-slate-500">/ 5</span>
              </div>

              {/* Star Rating */}
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
                Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </span>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="md:col-span-2 flex flex-col justify-center gap-2 p-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = breakdown[stars as keyof typeof breakdown] || 0;
                const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-14 font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                      {stars} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
                    </span>
                    <div className="flex-1 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-mono font-bold text-slate-500 dark:text-slate-400">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* List Header: Sorting Dropdown & Count */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Published Reviews ({sortedReviews.length})
            </h4>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 hidden sm:inline">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 pr-8 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="MOST_RECENT">Most Recent</option>
                  <option value="HIGHEST_RATED">Highest Rated</option>
                  <option value="LOWEST_RATED">Lowest Rated</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Review Cards List */}
          <div className="flex flex-col gap-4">
            {displayedReviews.map((rev: any) => {
              // Requirement 3: Name Privacy Masking (e.g. "Md Juyel Rana" -> "J**** R")
              const rawName = rev.reviewerName || rev.user?.name || "Customer";
              const maskedName = maskReviewerName(rawName);

              // Requirement 4 & 10: Verified Purchase strict check
              const isVerified = rev.isVerifiedPurchase === true;

              const reviewDate = rev.createdAt
                ? new Date(rev.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "";

              return (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-3 shadow-2xs transition hover:border-slate-300 dark:hover:border-slate-700"
                >
                  {/* Card Header: Masked Name & Verified Badge */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-black text-slate-900 dark:text-slate-100 tracking-wide font-mono">
                        {maskedName}
                      </span>

                      {/* Verified Purchase badge */}
                      {isVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Verified Purchase</span>
                        </span>
                      )}
                    </div>

                    {/* Review Date */}
                    {reviewDate && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {reviewDate}
                      </span>
                    )}
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Title */}
                  {rev.title && (
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {rev.title}
                    </h5>
                  )}

                  {/* Review Comment */}
                  {rev.comment && (
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      &quot;{rev.comment}&quot;
                    </p>
                  )}

                  {/* Review Images */}
                  {rev.images && rev.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {rev.images.map((img: string, i: number) => (
                        <div
                          key={i}
                          className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xs bg-slate-100 dark:bg-slate-800"
                        >
                          <SafeImage
                            src={img}
                            alt="Review attachment"
                            fill
                            className="object-cover"
                            fallbackSrc="/placeholder-product.png"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Load More Reviews Button */}
          {visibleCount < sortedReviews.length && (
            <div className="flex justify-center pt-2">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-extrabold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer shadow-2xs"
              >
                Load More Reviews
              </button>
            </div>
          )}
        </div>
      )}

      {/* Write Public Review Modal */}
      <WriteReviewModal
        productId={product.id}
        productTitle={productTitle}
        productImage={productImage}
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
      />
    </div>
  );
};

export default ProductReview;
