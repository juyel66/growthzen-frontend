'use client';

import React, { useState, useMemo } from 'react';
import Container from '@/components/navbar/Container';
import { useGetProductsQuery } from '@/services/productApi';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductGridSkeleton } from '@/components/product/ProductSkeleton';
import ProductError from '@/components/product/ProductError';
import { Search, SlidersHorizontal, ArrowUpDown, ShoppingBag, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, getProductDisplayPrice } from '@/types/product';
import { useAppSelector } from '@/redux/hooks';
import { selectIsReseller } from '@/features/auth/authSlice';

export default function ShopPage() {
  const isReseller = useAppSelector(selectIsReseller);
  const { data: productsData, isLoading, isError, refetch } = useGetProductsQuery();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'featured' | 'price-low' | 'price-high' | 'rating'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Extract categories dynamically
  const categories = useMemo(() => {
    if (!productsData || !Array.isArray(productsData)) return ['ALL'];
    const set = new Set<string>();
    set.add('ALL');
    productsData.forEach((p: Product) => {
      const cat = typeof p.category === 'object' ? p.category?.name : p.category;
      if (cat) set.add(cat);
    });
    return Array.from(set);
  }, [productsData]);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    if (!productsData || !Array.isArray(productsData)) return [];

    let list = [...productsData];

    // Filter by search query
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter((p) => {
        const title = (p.title || p.name || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const sku = (p.productCode || p.sku || '').toLowerCase();
        const cat = (typeof p.category === 'object' ? p.category?.name : p.category || '').toLowerCase();
        return title.includes(term) || desc.includes(term) || sku.includes(term) || cat.includes(term);
      });
    }

    // Filter by category
    if (selectedCategory !== 'ALL') {
      list = list.filter((p) => {
        const catName = typeof p.category === 'object' ? p.category?.name : p.category;
        return catName === selectedCategory;
      });
    }

    // Sort order
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
  }, [productsData, searchTerm, selectedCategory, sortBy, isReseller]);

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
    setCurrentPage(1);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8 font-sans">
      <title>Shop All Products - GrowthZen Store</title>

      <Container className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <ShoppingBag className="w-4 h-4" /> Store Catalog
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Shop All Products
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
              Browse our complete catalog of high-quality products. Filter by category, search by keywords, or sort by price and popularity.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Catalog</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by product name, SKU, category..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          {/* Categories Horizontal Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <div className="flex items-center gap-1.5 shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-100 dark:border-slate-800">
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
        </div>

        {/* Content Section: Loading, Error, or Product Grid */}
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : isError ? (
          <ProductError title="Unable to Load Products" message="Could not fetch products from the backend catalog." onRetry={refetch} />
        ) : (
          <>
            <ProductGrid products={paginatedProducts} onResetFilters={handleResetFilters} />

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                <div>
                  Showing page <span className="font-bold text-slate-800 dark:text-slate-200">{currentPage}</span> of{' '}
                  <span className="font-bold text-slate-800 dark:text-slate-200">{totalPages}</span> ({totalItems} total products)
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
