'use client';

import React from 'react';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import Container from '@/components/navbar/Container';
import { useGetCategoriesQuery } from '@/services/categoryApi';
import { useGetProductsQuery } from '@/services/productApi';
import { Category, SubCategoryInfo } from '@/types/category';
import { Product } from '@/types/product';
import {
  FolderTree,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Layers,
} from 'lucide-react';

export default function CategoriesLandingPage() {
  const {
    data: categoriesData = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useGetCategoriesQuery();

  const { data: productsData = [] } = useGetProductsQuery();

  // Filter active categories
  const activeCategories = React.useMemo(() => {
    if (!Array.isArray(categoriesData)) return [];
    return categoriesData.filter((cat) => cat.status !== 'INACTIVE');
  }, [categoriesData]);

  // Compute products count per category if backend doesn't provide it
  const categoryProductCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    if (!Array.isArray(productsData)) return counts;

    productsData.forEach((product: Product) => {
      const catObj = typeof product.category === 'object' ? product.category : null;
      const catId = product.categoryId || catObj?.id;
      const catName = catObj?.name || (typeof product.category === 'string' ? product.category : null);
      const catSlug = catObj?.slug;

      if (catId) counts[catId] = (counts[catId] || 0) + 1;
      if (catSlug) counts[catSlug] = (counts[catSlug] || 0) + 1;
      if (catName) counts[catName] = (counts[catName] || 0) + 1;
    });

    return counts;
  }, [productsData]);

  const getProductCount = (category: Category): number => {
    if (typeof category.productsCount === 'number') return category.productsCount;
    if (typeof category.productCount === 'number') return category.productCount;
    return (
      categoryProductCounts[category.id] ||
      categoryProductCounts[category.slug] ||
      categoryProductCounts[category.name] ||
      0
    );
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8 font-sans">
      <title>Shop by Category | GrowthZen Trends</title>
      <meta
        name="description"
        content="Explore all product categories at GrowthZen Trends. Browse available products, compare prices, and shop online."
      />
      <link rel="canonical" href="https://growthzentrends.com/categories" />
      <meta property="og:title" content="Shop by Category | GrowthZen Trends" />
      <meta
        property="og:description"
        content="Explore top product categories at GrowthZen Trends. Browse available products, compare prices, and shop online."
      />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />

      <Container className="flex flex-col gap-8">
        {/* Breadcrumb Bar */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-slate-100 font-bold">Categories</span>
        </nav>

        {/* Hero Banner Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 sm:p-12 text-white shadow-xl">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-3 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 w-fit">
                <Sparkles className="w-3.5 h-3.5" /> Product Catalog
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Shop by Category
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Discover our curated collections. Select a category below to explore available products, filter by price, and shop quality items from GrowthZen Trends.
              </p>
            </div>

            <button
              type="button"
              onClick={() => refetchCategories()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Categories</span>
            </button>
          </div>
        </div>

        {/* Content Section: Loading, Error, or Category Grid */}
        {isCategoriesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-64 rounded-3xl bg-slate-200/70 dark:bg-slate-800/60 animate-pulse border border-slate-200/80 dark:border-slate-800"
              />
            ))}
          </div>
        ) : isCategoriesError ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center gap-3">
            <FolderTree className="w-12 h-12 text-rose-500" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Unable to load categories
            </h2>
            <p className="text-xs text-slate-500 max-w-md">
              We encountered an issue fetching categories from the backend server. Please try again.
            </p>
            <button
              type="button"
              onClick={() => refetchCategories()}
              className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
            >
              Retry Loading
            </button>
          </div>
        ) : activeCategories.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center gap-4">
            <FolderTree className="w-12 h-12 text-slate-300 stroke-[1.5]" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              No Categories Available
            </h2>
            <p className="text-xs text-slate-500 max-w-md">
              There are currently no active categories in our store catalog. Check out our full shop catalog instead.
            </p>
            <Link
              href="/shop"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse All Products</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCategories.map((category) => {
              const count = getProductCount(category);
              const subcategories = (category.subCategories || category.subcategories || []) as SubCategoryInfo[];

              return (
                <div
                  key={category.id}
                  className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                >
                  {/* Category Card Header & Image */}
                  <div className="relative w-full h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    {category.image ? (
                      <SafeImage
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500/10 via-slate-100 to-slate-200 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-800 text-emerald-600 dark:text-emerald-400">
                        <FolderTree className="w-12 h-12 stroke-[1.5]" />
                      </div>
                    )}

                    {/* Product Count Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-extrabold text-slate-800 dark:text-slate-100 shadow-xs border border-white/20">
                      {count} {count === 1 ? 'Product' : 'Products'}
                    </div>

                    {category.discountEnabled && (category.discountPercentage || 0) > 0 && (
                      <div className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                        Up to {category.discountPercentage}% OFF
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col gap-4 flex-1 justify-between">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {category.name}
                      </h2>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {category.description || `Explore our collection of quality ${category.name} from GrowthZen Trends.`}
                      </p>

                      {/* Subcategories list chips */}
                      {subcategories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {subcategories.slice(0, 4).map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/categories/${sub.slug}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-[11px] font-medium transition"
                            >
                              <Layers className="w-3 h-3 text-slate-400" />
                              <span>{sub.name}</span>
                            </Link>
                          ))}
                          {subcategories.length > 4 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-850 text-slate-400 text-[11px]">
                              +{subcategories.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Link */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Link
                        href={`/categories/${category.slug}`}
                        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md"
                      >
                        <span>View Products</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
