'use client';

import React from 'react';
import Link from 'next/link';
import Container from '@/components/navbar/Container';
import { useGetCartQuery } from '@/services/cartApi';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import CartEmptyState from '@/components/cart/CartEmptyState';
import CartSkeleton from '@/components/cart/CartSkeleton';
import ClearCartDialog from '@/components/cart/ClearCartDialog';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { ShoppingBag, Home, ChevronRight, Lock } from 'lucide-react';

export default function CartPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const { data: cart, isLoading, isFetching } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const items = cart?.items || [];
  const summary = cart?.summary;

  const totalItems = summary?.totalItems ?? items.length;
  const totalQuantity =
    summary?.totalQuantity ??
    cart?.totalQuantity ??
    items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const subtotal =
    summary?.subtotal ??
    cart?.totalAmount ??
    items.reduce((acc, item) => {
      const price = item.unitPrice ?? item.price ?? item.product?.customerSellPrice ?? item.product?.price ?? 0;
      return acc + price * item.quantity;
    }, 0);

  const discount =
    summary?.discount ??
    items.reduce((acc, item) => {
      const lineDisc = item.lineDiscount ?? (item.unitDiscount ? item.unitDiscount * item.quantity : 0);
      return acc + lineDisc;
    }, 0);

  const grandTotal = summary?.grandTotal ?? Math.max(0, subtotal - discount);

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-12">
        <Container>
          <div className="flex flex-col items-center justify-center text-center p-10 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Login Required
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Please log in to your account to view your shopping cart and manage your items.
            </p>
            <Link
              href="/auth/login"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-md"
            >
              Sign In to Your Account
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
          <CartSkeleton />
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
      <title>Shopping Cart - Enterprise Store</title>

      <Container className="flex flex-col gap-6">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600 flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
          <span className="text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5" /> Shopping Cart
          </span>
        </nav>

        {items.length === 0 ? (
          <CartEmptyState />
        ) : (
          <div className="flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                  Shopping Cart
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                    {totalQuantity} {totalQuantity === 1 ? 'Item' : 'Items'}
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Manage your items, update quantities, or proceed to checkout.
                </p>
              </div>

              <ClearCartDialog itemCount={items.length} />
            </div>

            {/* Main Cart Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Column: Items List */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {isFetching && (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-pulse px-2">
                    Syncing cart data...
                  </div>
                )}
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-1">
                <CartSummary
                  summary={summary}
                  totalItems={totalItems}
                  subtotal={subtotal}
                  discount={discount}
                  grandTotal={grandTotal}
                />
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
