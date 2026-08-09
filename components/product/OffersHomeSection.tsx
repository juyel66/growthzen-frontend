'use client';

import React from 'react';
import Container from '@/components/navbar/Container';
import { useGetOffersQuery, useGetProductsQuery } from '@/services/productApi';
import ProductGrid from './ProductGrid';
import { ProductGridSkeleton } from './ProductSkeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tag, ArrowRight } from 'lucide-react';
import { Product, getProductDisplayPrice, getProductOriginalPrice } from '@/types/product';
import { useAppSelector } from '@/redux/hooks';
import { selectIsReseller } from '@/features/auth/authSlice';

export const OffersHomeSection: React.FC = () => {
  const isReseller = useAppSelector(selectIsReseller);
  const { data: offersData, isLoading: isOffersLoading } = useGetOffersQuery();
  const { data: productsFallback, isLoading: isFallbackLoading } = useGetProductsQuery(undefined, {
    skip: Array.isArray(offersData) && offersData.length > 0,
  });

  const isLoading = isOffersLoading || (isFallbackLoading && (!offersData || offersData.length === 0));

  const products: Product[] = React.useMemo(() => {
    if (Array.isArray(offersData) && offersData.length > 0) {
      return offersData.slice(0, 4);
    }
    if (Array.isArray(productsFallback)) {
      return productsFallback
        .filter((p) => {
          const displayPrice = getProductDisplayPrice(p, isReseller);
          const originalPrice = getProductOriginalPrice(p, isReseller);
          return originalPrice > displayPrice || p.discountEnabled || p.specialSaleEnabled;
        })
        .slice(0, 4);
    }
    return [];
  }, [offersData, productsFallback, isReseller]);

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="w-full py-12 bg-slate-50/50 dark:bg-slate-950">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-rose-500" /> Exclusive Discounts
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Offers & Deals
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Save more on selected products.
            </p>
          </div>

          <Link href="/offers">
            <Button variant="outline" size="sm" className="cursor-pointer font-bold">
              View All Offers <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {isLoading ? <ProductGridSkeleton count={4} /> : <ProductGrid products={products} />}
      </Container>
    </section>
  );
};

export default OffersHomeSection;
