'use client';

import React from 'react';
import Container from '@/components/navbar/Container';
import { useGetOffersQuery, useGetProductsQuery } from '@/services/productApi';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductGridSkeleton } from '@/components/product/ProductSkeleton';
import ProductError from '@/components/product/ProductError';
import { Tag, Sparkles, RefreshCw } from 'lucide-react';
import { Product, getProductDisplayPrice, getProductOriginalPrice } from '@/types/product';
import { useAppSelector } from '@/redux/hooks';
import { selectIsReseller } from '@/features/auth/authSlice';

export default function OffersPage() {
  const isReseller = useAppSelector(selectIsReseller);

  const {
    data: offersData,
    isLoading: isOffersLoading,
    isError: isOffersError,
    refetch: refetchOffers,
  } = useGetOffersQuery();

  const {
    data: productsFallback,
    isLoading: isFallbackLoading,
    isError: isFallbackError,
    refetch: refetchFallback,
  } = useGetProductsQuery(undefined, {
    skip: !isOffersError && Array.isArray(offersData) && offersData.length > 0,
  });

  const isLoading = isOffersLoading || (isOffersError && isFallbackLoading);
  const isError = isOffersError && isFallbackError;

  // Filter products that have discounts or special pricing active for the current role
  const products: Product[] = React.useMemo(() => {
    let list: Product[] = [];
    if (Array.isArray(offersData) && offersData.length > 0) {
      list = offersData;
    } else if (Array.isArray(productsFallback)) {
      list = productsFallback.filter((p) => {
        const displayPrice = getProductDisplayPrice(p, isReseller);
        const originalPrice = getProductOriginalPrice(p, isReseller);
        return (
          originalPrice > displayPrice ||
          p.customerSpecialPriceEnabled ||
          p.resellerSpecialPriceEnabled ||
          p.specialSaleEnabled ||
          p.discountEnabled
        );
      });
    }
    return list;
  }, [offersData, productsFallback, isReseller]);

  const handleRetry = () => {
    refetchOffers();
    refetchFallback();
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8 font-sans">
      <title>Offers & Deals - GrowthZen Trends</title>

      <Container className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900/50 w-fit">
              <Tag className="w-4 h-4 text-rose-500" /> Exclusive Savings
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-amber-500 fill-amber-400" />
              OFFERS & DEALS
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
              Save more on selected products.
            </p>
          </div>

          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Deals</span>
          </button>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : isError ? (
          <ProductError
            title="Deals Currently Unavailable"
            message="Could not retrieve current promotional deals."
            onRetry={handleRetry}
          />
        ) : products.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <Tag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No offers available right now.</h3>
            <p className="text-xs text-slate-400">Check back soon for new discounts and special promotions.</p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </Container>
    </div>
  );
}
