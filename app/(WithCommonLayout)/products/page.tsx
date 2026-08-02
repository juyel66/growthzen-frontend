'use client';

import React, { useState, useMemo } from 'react';
import Container from '@/components/navbar/Container';
import { useGetProductsQuery } from '@/services/productApi';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductGridSkeleton } from '@/components/product/ProductSkeleton';
import ProductError from '@/components/product/ProductError';
import { Search, SlidersHorizontal, ArrowUpDown, Tag } from 'lucide-react';
import { Product } from '@/types/product';

export default function ProductsPage() {
  const { data: productsData, isLoading, isError, refetch } = useGetProductsQuery();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  // Extract unique categories dynamically from products
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

  // Filter and sort products client-side
  const filteredProducts = useMemo(() => {
    if (!productsData || !Array.isArray(productsData)) return [];

    let list = [...productsData];

    // Filter by search query
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter((p) => {
        const title = (p.title || p.name || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const cat = (typeof p.category === 'object' ? p.category?.name : p.category || '').toLowerCase();
        return title.includes(term) || desc.includes(term) || cat.includes(term);
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
    if (sortBy === 'price-low') {
      list.sort((a, b) => (a.finalPrice ?? a.customerSellPrice ?? a.price ?? 0) - (b.finalPrice ?? b.customerSellPrice ?? b.price ?? 0));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.finalPrice ?? b.customerSellPrice ?? b.price ?? 0) - (a.finalPrice ?? a.customerSellPrice ?? a.price ?? 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.averageRating ?? b.ratingsAverage ?? 0) - (a.averageRating ?? a.ratingsAverage ?? 0));
    } else if (sortBy === 'featured') {
      list.sort((a, b) => Number(b.isFeatured ?? 0) - Number(a.isFeatured ?? 0));
    }

    return list;
  }, [productsData, searchTerm, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSortBy('featured');
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
      <Container className="flex flex-col gap-8">
        {/* Header Title Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Tag className="w-4 h-4" /> Enterprise Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore All Products
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
            Browse our wide selection of premium products across multiple categories. Enjoy exclusive prices, verified reviews, and instant delivery.
          </p>
        </div>

        {/* Filter and Search Controls Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by name, description, category..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          {/* Category Dropdown / Pill selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <div className="flex items-center gap-1.5 shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
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
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold px-3 py-2 border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Content Area: Skeleton, Error, or Product Grid */}
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : isError ? (
          <ProductError onRetry={refetch} />
        ) : (
          <ProductGrid products={filteredProducts} onResetFilters={handleResetFilters} />
        )}
      </Container>
    </div>
  );
}
