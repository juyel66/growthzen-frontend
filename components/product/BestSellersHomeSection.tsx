'use client';

import React from 'react';
import Container from '@/components/navbar/Container';
import { useGetBestSellersQuery, useGetProductsQuery } from '@/services/productApi';
import ProductGrid from './ProductGrid';
import { ProductGridSkeleton } from './ProductSkeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Flame, ArrowRight } from 'lucide-react';
import { Product } from '@/types/product';

export const BestSellersHomeSection: React.FC = () => {
  const { data: bestSellersData, isLoading: isBestLoading } = useGetBestSellersQuery();
  const { data: productsFallback, isLoading: isFallbackLoading } = useGetProductsQuery(undefined, {
    skip: Array.isArray(bestSellersData) && bestSellersData.length > 0,
  });

  const isLoading = isBestLoading || (isFallbackLoading && (!bestSellersData || bestSellersData.length === 0));
  const products: Product[] = Array.isArray(bestSellersData) && bestSellersData.length > 0
    ? bestSellersData.slice(0, 4)
    : Array.isArray(productsFallback)
    ? [...productsFallback].sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0)).slice(0, 4)
    : [];

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="w-full py-12 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" /> Customer Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Best Sellers
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Popular products our customers are buying the most.
            </p>
          </div>

          <Link href="/best-sellers">
            <Button variant="outline" size="sm" className="cursor-pointer font-bold">
              View All Best Sellers <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {isLoading ? <ProductGridSkeleton count={4} /> : <ProductGrid products={products} />}
      </Container>
    </section>
  );
};

export default BestSellersHomeSection;
