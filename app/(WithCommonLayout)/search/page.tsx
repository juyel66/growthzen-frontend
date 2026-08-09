'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/navbar/Container';
import { useGetProductsQuery } from '@/services/productApi';
import { useGetCategoriesQuery } from '@/services/categoryApi';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductGridSkeleton } from '@/components/product/ProductSkeleton';
import ProductError from '@/components/product/ProductError';
import { Product, getProductDisplayPrice } from '@/types/product';
import { useAppSelector } from '@/redux/hooks';
import { selectIsReseller } from '@/features/auth/authSlice';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FolderTree,
  ShoppingBag,
  Home as HomeIcon,
  X,
} from 'lucide-react';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isReseller = useAppSelector(selectIsReseller);

  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'ALL';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialInStock = searchParams.get('inStock') === 'true';
  const initialPage = Number(searchParams.get('page')) || 1;

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [onlyInStock, setOnlyInStock] = useState(initialInStock);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const itemsPerPage = 12;

  // Sync state when URL searchParams change
  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
    setSelectedCategory(searchParams.get('category') || 'ALL');
    setSortBy(searchParams.get('sort') || 'newest');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setOnlyInStock(searchParams.get('inStock') === 'true');
    setCurrentPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  // Update URL search parameters when filters change
  const updateUrlParams = (newParams: Record<string, string | number | boolean | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === '' || val === false || val === 'ALL' || (key === 'page' && Number(val) === 1)) {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });
    router.push(`/search?${params.toString()}`);
  };

  const {
    data: categoriesData = [],
    isLoading: isCategoriesLoading,
  } = useGetCategoriesQuery();

  const {
    data: productsData = [],
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch,
  } = useGetProductsQuery({
    search: searchTerm || undefined,
  });

  // Extract categories dynamically
  const categoriesList = useMemo(() => {
    if (!Array.isArray(categoriesData)) return [];
    return categoriesData.filter((c) => c.status !== 'INACTIVE');
  }, [categoriesData]);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(productsData)) return [];

    let list = [...productsData];

    // Filter by category
    if (selectedCategory !== 'ALL') {
      list = list.filter((p) => {
        const catObj = typeof p.category === 'object' ? p.category : null;
        const catId = p.categoryId || catObj?.id;
        const catSlug = (catObj?.slug || '').toLowerCase().trim();
        const catName = (catObj?.name || (typeof p.category === 'string' ? p.category : '') || '').toLowerCase().trim();
        const target = selectedCategory.toLowerCase().trim();

        return catId === selectedCategory || catSlug === target || catName === target;
      });
    }

    // Filter by Min / Max price
    const minVal = Number(minPrice);
    const maxVal = Number(maxPrice);
    if (!isNaN(minVal) && minVal > 0) {
      list = list.filter((p) => getProductDisplayPrice(p, isReseller) >= minVal);
    }
    if (!isNaN(maxVal) && maxVal > 0) {
      list = list.filter((p) => getProductDisplayPrice(p, isReseller) <= maxVal);
    }

    // Filter by in-stock availability
    if (onlyInStock) {
      list = list.filter((p) => (p.quantity ?? 0) > 0);
    }

    // Sort order
    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    } else if (sortBy === 'price_asc') {
      list.sort((a, b) => getProductDisplayPrice(a, isReseller) - getProductDisplayPrice(b, isReseller));
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => getProductDisplayPrice(b, isReseller) - getProductDisplayPrice(a, isReseller));
    } else if (sortBy === 'name_asc') {
      list.sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''));
    } else if (sortBy === 'name_desc') {
      list.sort((a, b) => (b.title || b.name || '').localeCompare(a.title || a.name || ''));
    } else if (sortBy === 'featured') {
      list.sort((a, b) => Number(b.isFeatured ?? 0) - Number(a.isFeatured ?? 0));
    }

    return list;
  }, [productsData, selectedCategory, minPrice, maxPrice, onlyInStock, sortBy, isReseller]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSortBy('newest');
    setMinPrice('');
    setMaxPrice('');
    setOnlyInStock(false);
    setCurrentPage(1);
    router.push('/search');
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedCategory !== 'ALL' ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    onlyInStock ||
    sortBy !== 'newest';

  const metaTitle = searchTerm
    ? `Search results for "${searchTerm}" | GrowthZen Trends`
    : `Search Store Catalog | GrowthZen Trends`;

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8 font-sans">
      <title>{metaTitle}</title>
      <meta
        name="description"
        content={`Search and filter GrowthZen Trends store catalog for "${searchTerm || 'products'}". Browse available items and compare prices.`}
      />
      <meta name="robots" content="noindex, follow" />

      <Container className="flex flex-col gap-8">
        {/* Breadcrumb Bar */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-slate-100 font-bold">Search</span>
        </nav>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Search className="w-4 h-4" /> Store Catalog Search
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {searchTerm ? (
                <>
                  Search results for &quot;<span className="text-emerald-600 dark:text-emerald-400">{searchTerm}</span>&quot;
                </>
              ) : (
                'Search Store Catalog'
              )}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-2xl">
              Showing <span className="font-bold text-slate-900 dark:text-white">{totalItems}</span> matching {totalItems === 1 ? 'product' : 'products'} from GrowthZen Trends catalog.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Results</span>
          </button>
        </div>

        {/* Main Filter & Search Control Panel */}
        <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Term Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  updateUrlParams({ q: e.target.value, page: 1 });
                }}
                placeholder="Search by product name, SKU, category..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            {/* Category Dropdown Filter */}
            <div className="md:col-span-4 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  updateUrlParams({ category: e.target.value, page: 1 });
                }}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-bold px-3 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                {categoriesList.map((cat) => (
                  <option key={cat.id} value={cat.slug || cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="md:col-span-3 flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  updateUrlParams({ sort: e.target.value, page: 1 });
                }}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-bold px-3 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
                <option value="featured">Featured First</option>
              </select>
            </div>
          </div>

          {/* Secondary Controls: Price Min/Max, In Stock, Reset */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-slate-700 dark:text-slate-300">Price Range (৳):</span>
              <input
                type="number"
                min={0}
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  updateUrlParams({ minPrice: e.target.value, page: 1 });
                }}
                className="w-20 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none text-xs"
              />
              <span className="text-slate-400">–</span>
              <input
                type="number"
                min={0}
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  updateUrlParams({ maxPrice: e.target.value, page: 1 });
                }}
                className="w-20 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none text-xs"
              />

              <label className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none ml-2">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => {
                    setOnlyInStock(e.target.checked);
                    updateUrlParams({ inStock: e.target.checked, page: 1 });
                  }}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-600 dark:text-slate-300 hover:text-rose-600 font-bold transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Product Grid Content Section */}
        {isProductsLoading ? (
          <ProductGridSkeleton count={8} />
        ) : isProductsError ? (
          <ProductError
            title="Unable to Load Search Results"
            message="We encountered an issue searching products from the backend catalog."
            onRetry={refetch}
          />
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center gap-4">
            <FolderTree className="w-12 h-12 text-slate-300 dark:text-slate-700 stroke-[1.5]" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              No results found for &quot;{searchTerm}&quot;
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
              We couldn&apos;t find any products matching your search criteria. Try checking for spelling errors, clearing filters, or browsing categories.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-200 transition cursor-pointer"
                >
                  Reset Search Filters
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
                  Page <span className="font-bold text-slate-800 dark:text-slate-200">{currentPage}</span> of{' '}
                  <span className="font-bold text-slate-800 dark:text-slate-200">{totalPages}</span> ({totalItems} total search results)
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => {
                      const newPage = Math.max(1, currentPage - 1);
                      setCurrentPage(newPage);
                      updateUrlParams({ page: newPage });
                    }}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 font-bold transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => {
                      const newPage = Math.min(totalPages, currentPage + 1);
                      setCurrentPage(newPage);
                      updateUrlParams({ page: newPage });
                    }}
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

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8 font-sans">
          <Container className="flex flex-col gap-8">
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <ProductGridSkeleton count={8} />
          </Container>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
