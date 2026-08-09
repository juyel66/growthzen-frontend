'use client';

import React from 'react';
import Container from '@/components/navbar/Container';
import { useGetBestSellersQuery, useGetProductsQuery } from '@/services/productApi';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductGridSkeleton } from '@/components/product/ProductSkeleton';
import ProductError from '@/components/product/ProductError';
import { Flame, Award, RefreshCw } from 'lucide-react';
import { Product } from '@/types/product';

export default function BestSellersPage() {
  const {
    data: bestSellersData,
    isLoading: isBestLoading,
    isError: isBestError,
    refetch: refetchBest,
  } = useGetBestSellersQuery();

  const {
    data: productsFallback,
    isLoading: isFallbackLoading,
    isError: isFallbackError,
    refetch: refetchFallback,
  } = useGetProductsQuery(undefined, {
    skip: !isBestError && Array.isArray(bestSellersData) && bestSellersData.length > 0,
  });

  const isLoading = isBestLoading || (isBestError && isFallbackLoading);
  const isError = isBestError && isFallbackError;

  // Use best-sellers array from endpoint, or fallback to featured/popular products
  const products: Product[] =
    Array.isArray(bestSellersData) && bestSellersData.length > 0
      ? bestSellersData
      : Array.isArray(productsFallback)
      ? [...productsFallback].sort((a, b) => (b.averageRating ?? b.ratingsAverage ?? 0) - (a.averageRating ?? a.ratingsAverage ?? 0))
      : [];

  const handleRetry = () => {
    refetchBest();
    refetchFallback();
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8 font-sans">
      <title>Best Sellers - GrowthZen Trends</title>

      <Container className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900/50 w-fit">
              <Award className="w-4 h-4 text-amber-500" /> Customer Favorites
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Flame className="w-8 h-8 text-rose-500 fill-rose-500 animate-bounce" />
              Best Sellers
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
              Popular products our customers are buying the most.
            </p>
          </div>

          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh List</span>
          </button>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : isError ? (
          <ProductError
            title="Best Sellers Unavailable"
            message="Could not load best selling products at this time."
            onRetry={handleRetry}
          />
        ) : products.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <Award className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Best Sellers Available Yet</h3>
            <p className="text-xs text-slate-400">Check back soon for top rated products and popular items.</p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </Container>
    </div>
  );
}
