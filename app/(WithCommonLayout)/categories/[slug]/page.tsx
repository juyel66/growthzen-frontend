'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import SafeImage from '@/components/ui/SafeImage';
import Container from '@/components/navbar/Container';
import { useGetCategoriesQuery } from '@/services/categoryApi';
import { useGetProductsQuery } from '@/services/productApi';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductGridSkeleton } from '@/components/product/ProductSkeleton';
import ProductError from '@/components/product/ProductError';
import { Product, getProductDisplayPrice } from '@/types/product';
import { Category, SubCategoryInfo } from '@/types/category';
import { useAppSelector } from '@/redux/hooks';
import { selectIsReseller } from '@/features/auth/authSlice';
import {
  ChevronRight,
  Search,
  ArrowUpDown,
  RefreshCw,
  FolderTree,
  ShoppingBag,
  Home as HomeIcon,
  Tag,
  Percent,
  ChevronLeft,
  Filter,
} from 'lucide-react';

export default function CategoryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = (params?.slug as string) || '';
  const slug = decodeURIComponent(rawSlug).toLowerCase().trim();

  const isReseller = useAppSelector(selectIsReseller);

  const {
    data: categoriesData = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useGetCategoriesQuery();

  const {
    data: productsData = [],
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useGetProductsQuery();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'featured' | 'price-low' | 'price-high' | 'rating'>('newest');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Find category by slug
  const matchedCategory = useMemo<Category | null>(() => {
    if (!slug || !Array.isArray(categoriesData) || categoriesData.length === 0) return null;

    // Direct match by slug or normalized name
    let found = categoriesData.find((cat) => {
      const catSlug = (cat.slug || '').toLowerCase().trim();
      const catNameSlug = (cat.name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      return catSlug === slug || catNameSlug === slug;
    });

    if (found) return found;

    // Search inside subcategories if flat search didn't match top level
    for (const cat of categoriesData) {
      const subs = (cat.subCategories || cat.subcategories || []) as (SubCategoryInfo | Category)[];
      const matchedSub = subs.find((sub) => {
        const subSlug = (sub.slug || '').toLowerCase().trim();
        const subNameSlug = (sub.name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        return subSlug === slug || subNameSlug === slug;
      });

      if (matchedSub) {
        return {
          id: matchedSub.id,
          name: matchedSub.name,
          slug: matchedSub.slug,
          description: ('description' in matchedSub ? (matchedSub as any).description : null) || null,
          image: ('image' in matchedSub ? (matchedSub as any).image : null) || null,
          parentCategory: { id: cat.id, name: cat.name, slug: cat.slug },
          status: 'ACTIVE',
        } as Category;
      }
    }

    return null;
  }, [slug, categoriesData]);

  // Collect category IDs and names for product filtering (including child categories)
  const categoryIdentifiers = useMemo(() => {
    if (!matchedCategory) return { ids: new Set<string>(), names: new Set<string>(), slugs: new Set<string>() };

    const ids = new Set<string>();
    const names = new Set<string>();
    const slugs = new Set<string>();

    ids.add(matchedCategory.id);
    if (matchedCategory.name) names.add(matchedCategory.name.toLowerCase().trim());
    if (matchedCategory.slug) slugs.add(matchedCategory.slug.toLowerCase().trim());

    // Add subcategory identifiers if parent category
    const subs = (matchedCategory.subCategories || matchedCategory.subcategories || []) as (SubCategoryInfo | Category)[];
    subs.forEach((sub) => {
      if (sub.id) ids.add(sub.id);
      if (sub.name) names.add(sub.name.toLowerCase().trim());
      if (sub.slug) slugs.add(sub.slug.toLowerCase().trim());
    });

    // Add child categories from categoriesData
    if (Array.isArray(categoriesData)) {
      categoriesData.forEach((cat) => {
        if (
          cat.parentCategoryId === matchedCategory.id ||
          (typeof cat.parent === 'object' && cat.parent?.id === matchedCategory.id) ||
          (typeof cat.parentCategory === 'object' && cat.parentCategory?.id === matchedCategory.id)
        ) {
          if (cat.id) ids.add(cat.id);
          if (cat.name) names.add(cat.name.toLowerCase().trim());
          if (cat.slug) slugs.add(cat.slug.toLowerCase().trim());
        }
      });
    }

    return { ids, names, slugs };
  }, [matchedCategory, categoriesData]);

  // Filter & sort products for this category
  const filteredProducts = useMemo(() => {
    if (!matchedCategory || !Array.isArray(productsData) || productsData.length === 0) return [];

    let list = productsData.filter((product: Product) => {
      const prodCatObj = typeof product.category === 'object' ? product.category : null;
      const prodCatId = product.categoryId || prodCatObj?.id;
      const prodCatSlug = (prodCatObj?.slug || '').toLowerCase().trim();
      const prodCatName = (prodCatObj?.name || (typeof product.category === 'string' ? product.category : '') || '').toLowerCase().trim();

      const matchesId = prodCatId ? categoryIdentifiers.ids.has(prodCatId) : false;
      const matchesSlug = prodCatSlug ? categoryIdentifiers.slugs.has(prodCatSlug) : false;
      const matchesName = prodCatName ? categoryIdentifiers.names.has(prodCatName) : false;

      return matchesId || matchesSlug || matchesName;
    });

    // In-stock filter
    if (onlyInStock) {
      list = list.filter((p) => (p.quantity ?? 0) > 0);
    }

    // Search within category
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter((p) => {
        const title = (p.title || p.name || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const sku = (p.productCode || p.sku || '').toLowerCase();
        return title.includes(term) || desc.includes(term) || sku.includes(term);
      });
    }

    // Sorting
    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sortBy === 'price-low') {
      list.sort((a, b) => getProductDisplayPrice(a, isReseller) - getProductDisplayPrice(b, isReseller));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => getProductDisplayPrice(b, isReseller) - getProductDisplayPrice(a, isReseller));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.averageRating ?? b.ratingsAverage ?? 0) - (a.averageRating ?? a.ratingsAverage ?? 0));
    } else if (sortBy === 'featured') {
      list.sort((a, b) => Number(b.isFeatured ?? 0) - Number(a.isFeatured ?? 0));
    }

    return list;
  }, [matchedCategory, productsData, categoryIdentifiers, onlyInStock, searchTerm, sortBy, isReseller]);

  // Pagination calculations
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSortBy('newest');
    setOnlyInStock(false);
    setCurrentPage(1);
  };

  const isLoading = isCategoriesLoading || isProductsLoading;
  const isError = isCategoriesError || isProductsError;

  // Handle Loading state
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8 font-sans">
        <Container className="flex flex-col gap-8">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-44 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
          <ProductGridSkeleton count={8} />
        </Container>
      </div>
    );
  }

  // Handle Invalid Category / 404 state
  if (!matchedCategory && !isCategoriesLoading) {
    return (
      <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-16 font-sans flex items-center justify-center">
        <title>Category Not Found | GrowthZen Trends</title>
        <Container>
          <div className="max-w-md mx-auto text-center bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
              <FolderTree className="w-8 h-8 stroke-[1.5]" />
            </div>

            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Category Not Found
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              The category you&apos;re looking for is unavailable or may have been removed from GrowthZen Trends catalog.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
              <Link
                href="/shop"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Browse Shop</span>
              </Link>
              <Link
                href="/"
                className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                <HomeIcon className="w-4 h-4" />
                <span>Go Home</span>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const categoryName = matchedCategory?.name || 'Category';
  const categoryDescription =
    matchedCategory?.description ||
    `Explore comfortable and stylish ${categoryName} from GrowthZen Trends.`;
  const parentCategoryName =
    typeof matchedCategory?.parentCategory === 'object' && matchedCategory?.parentCategory?.name
      ? matchedCategory.parentCategory.name
      : typeof matchedCategory?.parent === 'object' && matchedCategory?.parent?.name
        ? matchedCategory.parent.name
        : null;

  // SEO metadata & JSON-LD
  const metaTitle = matchedCategory?.metaTitle || `${categoryName} | GrowthZen Trends`;
  const metaDescription =
    matchedCategory?.metaDescription ||
    `Explore ${categoryName} at GrowthZen Trends. Browse available products, compare prices, and shop online.`;

  const canonicalUrl = `https://growthzentrends.com/categories/${matchedCategory?.slug || slug}`;

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://growthzentrends.com' },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: 'https://growthzentrends.com/categories' },
      { '@type': 'ListItem', position: 3, name: categoryName, item: canonicalUrl },
    ],
  };

  const jsonLdItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: categoryName,
    description: metaDescription,
    numberOfItems: filteredProducts.length,
    itemListElement: paginatedProducts.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: p.title || p.name,
      url: `https://growthzentrends.com/products/${p.slug || p.id}`,
    })),
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8 font-sans">
      {/* Page Title & Head SEO */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      {matchedCategory?.image && <meta property="og:image" content={matchedCategory.image} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }}
      />

      <Container className="flex flex-col gap-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/categories" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Categories
          </Link>
          {parentCategoryName && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-600 dark:text-slate-400">{parentCategoryName}</span>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-slate-100 font-bold">{categoryName}</span>
        </nav>

        {/* Category Hero Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/60">
                <Tag className="w-3 h-3" /> Category
              </span>

              {matchedCategory?.discountEnabled && (matchedCategory.discountPercentage || 0) > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200">
                  <Percent className="w-3 h-3" /> Up to {matchedCategory.discountPercentage}% OFF
                </span>
              )}

              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {totalItems} {totalItems === 1 ? 'Product Available' : 'Products Available'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {categoryName}
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              {categoryDescription}
            </p>
          </div>

          {/* Category Banner Image if available */}
          {matchedCategory?.image && (
            <div className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shrink-0 shadow-md">
              <SafeImage
                src={matchedCategory.image}
                alt={categoryName}
                fill
                sizes="176px"
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          {/* Search within Category */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={`Search within ${categoryName}...`}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          {/* Stock Toggle & Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => {
                  setOnlyInStock(e.target.checked);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as typeof sortBy);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-bold px-3 py-2 border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                refetchCategories();
                refetchProducts();
              }}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="Refresh products"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body: Error, Empty Category, or Products Grid */}
        {isError ? (
          <ProductError
            title="Unable to Load Category Products"
            message="Could not load products for this category from the backend catalog."
            onRetry={() => {
              refetchCategories();
              refetchProducts();
            }}
          />
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center gap-4">
            <FolderTree className="w-12 h-12 text-slate-300 dark:text-slate-700 stroke-[1.5]" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              No products available in this category yet.
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
              {searchTerm || onlyInStock
                ? 'No items matched your current search or stock filters. Try resetting your search filter.'
                : 'We are updating our catalog for this category. Check back soon or browse all store products.'}
            </p>
            <div className="flex items-center gap-3">
              {(searchTerm || onlyInStock) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-200 transition cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
              <Link
                href="/shop"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Browse All Products</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <ProductGrid products={paginatedProducts} onResetFilters={handleResetFilters} />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                <div>
                  Showing page <span className="font-bold text-slate-800 dark:text-slate-200">{currentPage}</span> of{' '}
                  <span className="font-bold text-slate-800 dark:text-slate-200">{totalPages}</span> ({totalItems} total products in {categoryName})
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 font-bold transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 font-bold transition cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
