'use client';

import React from 'react';
import Link from 'next/link';
import Container from '@/components/navbar/Container';
import { ShieldCheck, Truck, Headphones, Wallet, CheckCircle2, ArrowRight, Building2, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-12 font-sans">
      <title>About Us - GrowthZen Trends</title>

      <Container className="flex flex-col gap-16">
        {/* Hero Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-14 shadow-xl flex flex-col items-center text-center gap-6 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-900/50 mb-2">
            <Building2 className="w-8 h-8" />
          </div>

          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/50">
              <Award className="w-4 h-4" /> Enterprise E-Commerce Platform
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              About GrowthZen Trends
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              GrowthZen Trends is a next-generation e-commerce destination committed to delivering top-quality products, unbeatable pricing, and an exceptional shopping experience for customers and resellers alike.
            </p>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="flex flex-col gap-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              What We Offer
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Discover how GrowthZen Trends empowers everyday shoppers and commercial reseller partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Curated Product Quality</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Every item listed in our catalog undergoes rigorous quality checks to guarantee authenticity, durability, and customer satisfaction.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Role-Based Pricing Architecture</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We support specialized wholesale and reseller price tiers alongside retail customer discounts, helping businesses grow margins seamlessly.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Swift Order Fulfillment</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Our optimized logistics framework delivers orders inside Dhaka and across the country quickly and safely with live parcel tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 shadow-xs space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Why Choose GrowthZen Trends
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Four pillars that define our commitment to service excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Quality Products</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% verified inventory sourced directly from trusted manufacturers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Fast Delivery</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reliable courier dispatch with real-time delivery status updates.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Customer Support</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dedicated support team ready to assist with orders, returns, and inquiries.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Cash on Delivery</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pay safely at your doorstep upon receiving your inspectable parcel.
              </p>
            </div>
          </div>
        </div>

        {/* Call To Action */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to Start Shopping?</h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-md">
              Explore our best-sellers or dive into current special offers today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 font-bold text-xs rounded-xl shadow-md hover:bg-emerald-50 transition cursor-pointer"
            >
              <span>Explore Shop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/offers"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800/60 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl border border-emerald-400/40 transition cursor-pointer"
            >
              <span>View Offers</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
