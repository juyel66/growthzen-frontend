'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useGetSuggestionsQuery } from '@/services/productApi';
import SearchDropdown from './SearchDropdown';
import { Product } from '@/types/product';

const RECENT_SEARCHES_KEY = 'growthzen_recent_searches';
const MAX_RECENT_SEARCHES = 5;

interface SearchBoxProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  placeholder = 'Search products, categories, SKU...',
  className = '',
}) => {
  const router = useRouter();
  const theme = useTheme();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  // Save query to recent searches
  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    try {
      const updated = [trimmed, ...recentSearches.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_RECENT_SEARCHES);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore localStorage write errors
    }
  };

  const removeRecentSearch = (term: string) => {
    const updated = recentSearches.filter((item) => item.toLowerCase() !== term.toLowerCase());
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore errors
    }
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // Ignore errors
    }
  };

  // 300ms Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  // Fetch suggestions via RTK Query
  const {
    data: suggestionsData,
    isLoading: isSuggestionsLoading,
    isError: isSuggestionsError,
  } = useGetSuggestionsQuery(debouncedQuery, {
    skip: !debouncedQuery,
  });

  const products = suggestionsData?.products || [];
  const categories = suggestionsData?.categories || [];

  // Click Outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const executeSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    saveRecentSearch(trimmed);
    setIsOpen(false);
    if (inputRef.current) inputRef.current.blur();

    if (onSearch) {
      onSearch(trimmed);
    } else {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleProductSelect = (product: Product) => {
    saveRecentSearch(product.title || product.name || query);
    setIsOpen(false);
    const targetSlug = product.slug || product.id;
    router.push(`/products/${targetSlug}`);
  };

  const handleCategorySelect = (categorySlug: string) => {
    setIsOpen(false);
    router.push(`/categories/${categorySlug}`);
  };

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    setActiveIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const totalItems = query.trim() ? products.length : recentSearches.length;
      if (totalItems > 0) {
        setActiveIndex((prev) => (prev + 1) % totalItems);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const totalItems = query.trim() ? products.length : recentSearches.length;
      if (totalItems > 0) {
        setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
      }
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < products.length && query.trim()) {
        e.preventDefault();
        handleProductSelect(products[activeIndex]);
      } else if (activeIndex >= 0 && activeIndex < recentSearches.length && !query.trim()) {
        e.preventDefault();
        executeSearch(recentSearches[activeIndex]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full rounded-full border bg-slate-50/60 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:shadow-md focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500"
        style={{
          borderColor: theme.borderColor,
        }}
        role="search"
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search products"
          aria-expanded={isOpen}
          aria-controls="search-dropdown-menu"
          className="w-full pl-5 pr-14 py-2.5 text-sm bg-transparent rounded-full outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
        />

        <div className="absolute right-2.5 flex items-center gap-1">
          {isSuggestionsLoading && debouncedQuery ? (
            <Loader2 className="w-4 h-4 text-emerald-500 animate-spin mr-1" />
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search input"
              className="p-1 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 outline-none cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}

          <button
            type="submit"
            aria-label="Search"
            className="p-2 rounded-full transition-all text-white flex items-center justify-center outline-none hover:brightness-95 active:scale-95 cursor-pointer shadow-xs"
            style={{
              backgroundColor: theme.primaryColor,
            }}
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Live Suggestions Dropdown */}
      {isOpen && (
        <SearchDropdown
          query={query}
          isLoading={isSuggestionsLoading && Boolean(debouncedQuery)}
          isError={isSuggestionsError}
          products={products}
          categories={categories}
          recentSearches={recentSearches}
          activeIndex={activeIndex}
          onSelectQuery={(term) => executeSearch(term)}
          onSelectProduct={handleProductSelect}
          onSelectCategory={handleCategorySelect}
          onRemoveRecentSearch={removeRecentSearch}
          onClearRecentSearches={clearAllRecentSearches}
          onExecuteSearch={(term) => executeSearch(term)}
        />
      )}
    </div>
  );
};

export default SearchBox;
