'use client';

import React, { use } from 'react';
import Container from '@/components/navbar/Container';
import { useGetProductsQuery, useGetProductByIdQuery } from '@/services/productApi';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductPrice from '@/components/product/ProductPrice';
import ProductAttributes from '@/components/product/ProductAttributes';
import ProductActions from '@/components/product/ProductActions';
import ProductVideo from '@/components/product/ProductVideo';
import ProductReview from '@/components/product/ProductReview';
import RelatedProducts from '@/components/product/RelatedProducts';
import { ProductDetailsSkeleton } from '@/components/product/ProductSkeleton';
import ProductError from '@/components/product/ProductError';
import Link from 'next/link';
import { ChevronRight, Home, ShoppingBag } from 'lucide-react';
import { getProductTitle, getProductCategoryName, Product } from '@/types/product';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  // 1. Fetch products list to find product ID corresponding to the URL slug
  const {
    data: productsList,
    isLoading: isListLoading,
  } = useGetProductsQuery();

  // Find product by slug or ID match
  const matchedProductFromList = Array.isArray(productsList)
    ? productsList.find((p: Product) => p.slug === slug || p.id === slug)
    : undefined;

  const targetProductId = matchedProductFromList?.id || slug;

  // 2. Fetch full product details using GET /products/:id
  const {
    data: productDetails,
    isLoading: isDetailsLoading,
    isError,
    refetch,
  } = useGetProductByIdQuery(targetProductId, {
    skip: !targetProductId,
  });

  const isLoading = isListLoading || isDetailsLoading;
  const product = productDetails || matchedProductFromList;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
        <ProductDetailsSkeleton />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-16">
        <Container>
          <ProductError
            title="Product Not Found"
            message={`We couldn't retrieve product for "${slug}". It may have been moved or removed.`}
            onRetry={refetch}
          />
        </Container>
      </div>
    );
  }

  const title = getProductTitle(product);
  const categoryName = getProductCategoryName(product);

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
      {/* Dynamic Browser Page Title */}
      <title>{`${title} - Enterprise Store`}</title>

      <Container className="flex flex-col gap-8">
        {/* Breadcrumbs Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 flex-wrap">
          <Link href="/" className="hover:text-emerald-600 flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
          <Link href="/products" className="hover:text-emerald-600 flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5" /> Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
          <span className="text-slate-800 dark:text-slate-200 font-semibold">{categoryName}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
          <span className="text-slate-400 truncate max-w-[200px]">{title}</span>
        </nav>

        {/* Product Details Layout */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery Section */}
          <ProductGallery product={product} />

          {/* Info & Actions Section */}
          <div className="flex flex-col gap-6">
            <ProductInfo product={product} />
            <ProductPrice product={product} size="lg" />
            <ProductAttributes attributes={product.attributes} />
            <ProductActions product={product} />
          </div>
        </div>

        {/* Conditional Product Video Section */}
        {product.productVideos && product.productVideos.length > 0 && (
          <ProductVideo videos={product.productVideos} />
        )}

        {/* Reviews Section */}
        <ProductReview product={product} />

        {/* Reusable Related Products Section */}
        <RelatedProducts currentProductId={product.id} categoryName={categoryName} />
      </Container>
    </div>
  );
}
