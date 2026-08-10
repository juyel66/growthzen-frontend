'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Container from '@/components/navbar/Container';
import {
  ShoppingBag,
  Search,
  ArrowLeft,
  SearchX,
  Compass,
  Home as HomeIcon,
} from 'lucide-react';

export const NotFoundContent: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="w-full min-h-[70vh] bg-slate-50/50 dark:bg-slate-950 py-12 sm:py-20 font-sans flex items-center justify-center">
      {/* Head SEO metadata */}
      <title>404 - Page Not Found | GrowthZen Trends</title>
      <meta name="robots" content="noindex, follow" />
      <meta name="description" content="The page you are looking for is unavailable or may have been moved." />

      <Container className="flex flex-col items-center justify-center text-center">
        <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col items-center gap-6">
          {/* Visual Header / 404 Typography */}
          <div className="relative flex items-center justify-center">
            <div className="text-7xl sm:text-9xl font-black text-slate-200 dark:text-slate-800 select-none tracking-tight">
              404
            </div>
            <div className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-900/50 shadow-md">
              <SearchX className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.75]" />
            </div>
          </div>

          {/* Title & Message */}
          <div className="flex flex-col items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200/60">
              <Compass className="w-3.5 h-3.5" /> 404 Error
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Page Not Found
            </h1>
            <p className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300">
              Sorry, we couldn&apos;t find the page you&apos;re looking for.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              The page may have been moved, deleted, or the URL may be incorrect.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/shop"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Browse Products</span>
            </Link>
          </div>

          {/* Quick Search Form */}
          <div className="w-full pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3">
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Looking for something specific?
            </span>
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, categories..."
                className="w-full pl-10 pr-24 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotFoundContent;
