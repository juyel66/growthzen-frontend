'use client';

import React from 'react';
import Container from '@/components/navbar/Container';
import { useGetProductsQuery } from '@/services/productApi';
import ProductGrid from './ProductGrid';
import { ProductGridSkeleton } from './ProductSkeleton';
import ProductError from './ProductError';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

export const FeaturedProductsSection: React.FC = () => {
  const { data: products, isLoading, isError, refetch } = useGetProductsQuery();

  // Take top 8 featured or available products for homepage display
  const featuredProducts = Array.isArray(products) ? products.slice(0, 8) : [];

  return (
    <section className="w-full py-12 bg-slate-50/50 dark:bg-slate-950">
      <Container className="flex flex-col gap-8">
        {/* Section Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 fill-emerald-500" /> Featured Collection
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trending & Best Sellers
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Discover top-rated products curated specifically for you.
            </p>
          </div>

          <Link href="/products">
            <Button variant="outline" size="sm" className="cursor-pointer font-bold">
              View All Catalog <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : isError ? (
          <ProductError onRetry={refetch} />
        ) : (
          <ProductGrid products={featuredProducts} />
        )}
      </Container>
    </section>
  );
};

export default FeaturedProductsSection;

