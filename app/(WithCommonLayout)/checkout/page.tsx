'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Container from '@/components/navbar/Container';
import { useGetCartQuery } from '@/services/cartApi';
import { useGetCheckoutQuery } from '@/services/checkoutApi';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import CheckoutSkeleton from '@/components/checkout/CheckoutSkeleton';
import CartEmptyState from '@/components/cart/CartEmptyState';
import { getBuyNowItem } from '@/hooks/useProtectedAction';
import { Home, ChevronRight, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [hasBuyNowItem, setHasBuyNowItem] = useState<boolean>(false);
  const [isClientLoaded, setIsClientLoaded] = useState<boolean>(false);

  useEffect(() => {
    const item = getBuyNowItem();
    if (item) {
      setHasBuyNowItem(true);
    }
    setIsClientLoaded(true);
  }, []);

  const { data: cart, isLoading: isCartLoading } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { isLoading: isCheckoutLoading } = useGetCheckoutQuery(undefined, {
    skip: !isAuthenticated || hasBuyNowItem,
  });

  const items = cart?.items || [];
  const isLoading = isAuthenticated && (isCartLoading || isCheckoutLoading);

  if (!isClientLoaded) {
    return (
      <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
        <Container>
          <CheckoutSkeleton />
        </Container>
      </div>
    );
  }

  // If user is guest AND has no buyNow item, or if logged in with empty cart and no buyNow item
  const hasNoItems = !hasBuyNowItem && items.length === 0;

  if (hasNoItems && isClientLoaded && !isLoading) {
    return (
      <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-12">
        <Container>
          <CartEmptyState />
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

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8">
      <title>Secure Checkout - GrowthZen Trends</title>

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
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Checkout
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


