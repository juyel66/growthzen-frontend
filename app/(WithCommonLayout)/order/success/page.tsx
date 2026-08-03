'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Container from '@/components/navbar/Container';
import { CheckCircle2, ShoppingBag, Truck, Package, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default function OrderSuccessPage({ searchParams }: PageProps) {
  const resolvedParams = use(searchParams);
  const orderId = resolvedParams.orderId || 'ORD-' + Math.floor(100000 + Math.random() * 900000);

  const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
    'en-US',
    { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }
  );

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-12">
      <title>Order Placed Successfully - Enterprise Store</title>

      <Container>
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-6">
          {/* Main Success Card */}
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xs flex flex-col items-center gap-6">
            {/* Animated Check Icon */}
            <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
              <CheckCircle2 className="w-12 h-12 stroke-[2.25] animate-fade-in" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Order Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Thank You for Your Order!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">
                We have received your order and are preparing it for delivery. A confirmation message has been sent to your registered email.
              </p>
            </div>

            {/* Order Details Badge Card */}
            <div className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-emerald-600 shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    Order Number
                  </span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    #{orderId}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-200/80 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-4">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-emerald-600 shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    Estimated Delivery
                  </span>
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-600" />
                    {estimatedDelivery}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
              <Link href="/products" className="flex-1">
                <button
                  type="button"
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Authentic Products • 100% Satisfaction Guaranteed</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
