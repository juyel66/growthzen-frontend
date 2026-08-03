'use client';

import React from 'react';
import Link from 'next/link';
import Container from '@/components/navbar/Container';
import { useGetWishlistQuery } from '@/services/wishlistApi';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import WishlistGrid from '@/components/wishlist/WishlistGrid';
import WishlistEmptyState from '@/components/wishlist/WishlistEmptyState';
import WishlistSkeleton from '@/components/wishlist/WishlistSkeleton';
import ClearWishlistDialog from '@/components/wishlist/ClearWishlistDialog';
import { Heart, Home, ChevronRight, LogIn } from 'lucide-react';

export default function WishlistPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const {
    data: wishlistData,
    isLoading,
    isError,
    refetch,
  } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  const items = wishlistData?.items || [];
  const count = items.length;

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[70vh] bg-slate-50/50 dark:bg-slate-950 py-16 flex items-center justify-center">
        <Container>
          <div className="flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-900/60 flex items-center justify-center mb-5">
              <Heart className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              Sign In to View Wishlist
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6 leading-relaxed">
              Log in to access your saved items, synchronize your wishlist across devices, and manage your favorite products.
            </p>
            <Link href="/auth/login" className="w-full">
              <button
                type="button"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <LogIn className="w-4 h-4" /> Log In to Your Account
              </button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
        <Container>
          <WishlistSkeleton />
        </Container>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-[60vh] bg-slate-50/50 dark:bg-slate-950 py-16 flex items-center justify-center">
        <Container>
          <div className="flex flex-col items-center text-center p-10 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-3xl max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-rose-800 dark:text-rose-200 mb-2">
              Failed to Load Wishlist
            </h3>
            <p className="text-xs text-rose-600 dark:text-rose-400 mb-4">
              We couldn't retrieve your wishlist. Please try again or check your connection.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Retry Loading
            </button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
      <title>My Wishlist - Enterprise Store</title>

      <Container className="flex flex-col gap-6">
        {/* Breadcrumb Header */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600 flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
          <span className="text-slate-800 dark:text-slate-200 font-semibold">My Wishlist</span>
        </nav>

        {/* Page Top Title & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900/60 flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  My Saved Wishlist
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-extrabold text-xs">
                  {count} {count === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Save items here to purchase later or move to your shopping cart anytime.
              </p>
            </div>
          </div>

          {count > 0 && <ClearWishlistDialog itemCount={count} />}
        </div>

        {/* Wishlist Main Content */}
        {count === 0 ? (
          <WishlistEmptyState />
        ) : (
          <WishlistGrid items={items} />
        )}
      </Container>
    </div>
  );
}
