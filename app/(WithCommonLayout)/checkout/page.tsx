'use client';

import React from 'react';
import Link from 'next/link';
import Container from '@/components/navbar/Container';
import { useGetCartQuery } from '@/services/cartApi';
import { useGetCheckoutQuery } from '@/services/checkoutApi';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import CheckoutSkeleton from '@/components/checkout/CheckoutSkeleton';
import CartEmptyState from '@/components/cart/CartEmptyState';
import { Home, ChevronRight, CreditCard, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const { data: cart, isLoading: isCartLoading } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { isLoading: isCheckoutLoading } = useGetCheckoutQuery(undefined, {
    skip: !isAuthenticated,
  });

  const items = cart?.items || [];
  const isLoading = isCartLoading || isCheckoutLoading;

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
              Please sign in to your account to complete your checkout and place your order.
            </p>
            <Link
              href="/auth/login"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-md"
            >
              Sign In to Checkout
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
          <CheckoutSkeleton />
        </Container>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-12">
        <Container>
          <CartEmptyState />
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
      <title>Secure Checkout - Enterprise Store</title>

      <Container className="flex flex-col gap-6">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600 flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
          <Link href="/cart" className="hover:text-emerald-600">
            Shopping Cart
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
          <span className="text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5" /> Checkout
          </span>
        </nav>

        {/* Page Title Header */}
        <div className="flex flex-col gap-1 pb-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Checkout Order
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Complete your customer details, shipping address, and delivery options to place your order.
          </p>
        </div>

        {/* Enterprise Checkout Form */}
        <CheckoutForm />
      </Container>
    </div>
  );
}
