'use client';

import React from 'react';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import { Product, getProductTitle, getProductCategoryName, getProductMainImage } from '@/types/product';
import ProductPrice from '@/components/product/ProductPrice';
import {
  Search,
  History,
  TrendingUp,
  FolderTree,
  Tag,
  ArrowRight,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export interface SearchDropdownProps {
  query: string;
  isLoading: boolean;
  isError: boolean;
  products: Product[];
  categories: { id: string; name: string; slug: string }[];
  recentSearches: string[];
  popularSearches?: string[];
  activeIndex: number;
  onSelectQuery: (q: string) => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categorySlug: string) => void;
  onRemoveRecentSearch: (q: string) => void;
  onClearRecentSearches: () => void;
  onExecuteSearch: (q: string) => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  query,
  isLoading,
  isError,
  products,
  categories,
  recentSearches,
  popularSearches = ['T-Shirts', 'Polo Shirts', 'Men\'s Clothing', 'Electronics', 'Fashion'],
  activeIndex,
  onSelectQuery,
  onSelectProduct,
  onSelectCategory,
  onRemoveRecentSearch,
  onClearRecentSearches,
  onExecuteSearch,
}) => {
  const isQueryEmpty = !query.trim();

  return (
    <div
      role="listbox"
      id="search-dropdown-menu"
      className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden text-slate-800 dark:text-slate-100 max-h-[80vh] flex flex-col transition-all duration-200"
    >
      {/* 1. Empty Input View: Popular Searches & Recent Searches */}
      {isQueryEmpty ? (
        <div className="p-5 flex flex-col gap-5 overflow-y-auto">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-slate-400" /> Recent Searches
                </span>
                <button
                  type="button"
                  onClick={onClearRecentSearches}
                  className="text-[11px] font-bold text-slate-400 hover:text-rose-500 transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, idx) => {
                  const isHighlighted = activeIndex === idx;
                  return (
                    <div
                      key={term}
                      onClick={() => onSelectQuery(term)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                        isHighlighted
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Search className="w-3 h-3 opacity-60" />
                      <span>{term}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveRecentSearch(term);
                        }}
                        className="hover:text-rose-500 p-0.5 rounded-full"
                        title="Remove search"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Popular Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  type="button"
                  key={term}
                  onClick={() => onSelectQuery(term)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-bold transition-all border border-transparent hover:border-emerald-200 cursor-pointer"
                >
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 2. Non-Empty Input View: Live Suggestions */
        <div className="flex flex-col overflow-y-auto max-h-[460px]">
          {/* Loading Indicator */}
          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2.5">
              <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
              <span>Searching for &quot;{query}&quot;...</span>
            </div>
          ) : isError ? (
            <div className="p-6 text-center text-xs text-rose-500 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Unable to load search results. Please try again.</span>
            </div>
          ) : products.length === 0 && categories.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
              <Search className="w-8 h-8 text-slate-300 stroke-[1.5]" />
              <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                No results found for &quot;{query}&quot;
              </span>
              <span>Try checking for spelling errors or search for another term.</span>
            </div>
          ) : (
            <div className="p-4 flex flex-col gap-4 divide-y divide-slate-100 dark:divide-slate-800">
              {/* Product Suggestions Section */}
              {products.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-2">
                    Products ({products.length})
                  </span>
                  <div className="flex flex-col gap-1">
                    {products.slice(0, 5).map((product, idx) => {
                      const title = getProductTitle(product);
                      const categoryName = getProductCategoryName(product);
                      const image = getProductMainImage(product);
                      const isHighlighted = activeIndex === idx;

                      return (
                        <div
                          key={product.id}
                          onClick={() => onSelectProduct(product)}
                          className={`group p-2.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                            isHighlighted
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200/80 dark:border-slate-700">
                              <SafeImage
                                src={image}
                                alt={title}
                                fill
                                sizes="48px"
                                className="object-contain p-1"
                              />
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[10px]">
                                {categoryName}
                              </span>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {title}
                              </h4>
                              {product.quantity !== undefined && (
                                <span className={`text-[10px] font-semibold ${product.quantity > 0 ? 'text-slate-400' : 'text-rose-500'}`}>
                                  {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Effective Role Price */}
                          <div className="shrink-0 text-right">
                            <ProductPrice product={product} size="sm" showRoleLabel={false} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Category Suggestions Section */}
              {categories.length > 0 && (
                <div className="pt-3 flex flex-col gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1.5">
                    <FolderTree className="w-3.5 h-3.5" /> Matching Categories
                  </span>
                  <div className="flex flex-wrap gap-2 px-2">
                    {categories.map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.slug)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Tag className="w-3 h-3 text-slate-400 group-hover:text-white" />
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer CTA: Search all results */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onExecuteSearch(query)}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Search all results for &quot;{query}&quot;</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
