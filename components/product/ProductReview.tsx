'use client';

import React from 'react';
import { Product } from '@/types/product';
import { Star, MessageSquare, UserCheck } from 'lucide-react';
import Image from 'next/image';

interface ProductReviewProps {
  product: Product;
}

export const ProductReview: React.FC<ProductReviewProps> = ({ product }) => {
  const averageRating = product.averageRating ?? product.ratingsAverage ?? 0;
  const reviewCount = product.reviewCount ?? product.ratingsCount ?? 0;
  const breakdown = product.ratingBreakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const latestReviews = product.latestReviews || [];

  const hasReviews = reviewCount > 0 || latestReviews.length > 0;

  return (
    <div className="flex flex-col gap-6 py-8 border-t border-slate-200 dark:border-slate-800 my-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
          <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Customer Reviews & Ratings
        </div>
      </div>

      {!hasReviews ? (
        /* Empty Reviews State */
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/60 text-amber-500 rounded-full flex items-center justify-center mb-3">
            <Star className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No reviews yet</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Be the first customer to purchase and share your valuable feedback for this product!
          </p>
        </div>
      ) : (
        /* Active Reviews Display */
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
                      ? 'fill-amber-400 text-amber-400'
                      : i < averageRating
                      ? 'fill-amber-400/50 text-amber-400'
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Based on {reviewCount} verified {reviewCount === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          {/* Rating Breakdown Bars */}
          <div className="flex flex-col justify-center gap-2 p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = breakdown[stars as keyof typeof breakdown] || 0;
              const percentage = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="w-12 font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-semibold text-slate-500 dark:text-slate-400">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Recent Reviews List */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Latest Reviews
            </h4>
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
              {latestReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                        {rev.reviewerName ? rev.reviewerName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        {rev.reviewerName || 'Anonymous Customer'}
                        <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  {rev.comment && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                      &quot;{rev.comment}&quot;
                    </p>
                  )}

                  {/* Review Images */}
                  {rev.images && rev.images.length > 0 && (
                    <div className="flex gap-2 pt-1">
                      {rev.images.map((img, i) => (
                        <div
                          key={i}
                          className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800"
                        >
                          <Image
                            src={img}
                            alt="User review attachment"
                            fill
                            sizes="48px"
                            className="object-cover"
                            unoptimized={img.startsWith('http') && !img.includes('cloudinary') && !img.includes('unsplash')}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReview;
