'use client';

import React from 'react';
import Link from 'next/link';
import Container from '@/components/navbar/Container';
import {
  Users,
  ShieldCheck,
  TrendingUp,
  FileText,
  Truck,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function ResellerProgramPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8 font-sans">
      <title>Reseller Program | GrowthZen Trends</title>
      <meta
        name="description"
        content="Learn about the GrowthZen Trends Reseller Partner Program. Access role-based reseller pricing, bulk ordering privileges, invoice access, and dedicated customer support."
      />

      <Container className="flex flex-col gap-12">
        {/* Hero Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 sm:p-14 text-white shadow-xl flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 mb-2">
            <Users className="w-8 h-8" />
          </div>

          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-3.5 py-1 rounded-full border border-emerald-500/30">
              <Sparkles className="w-4 h-4" /> GrowthZen Commercial Partner Program
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              GrowthZen Reseller Partner Program
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Empowering merchants, digital sellers, and wholesale business partners with enterprise role-based pricing, streamlined invoice management, and nationwide order fulfillment.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition cursor-pointer"
            >
              <span>Apply for Reseller Membership</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Core Reseller Benefits Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Reseller Account Benefits
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Key advantages designed to help commercial partners scale operations effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Role-Based Pricing Tiers</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Approved reseller accounts unlock specialized wholesale catalog pricing automatically across all eligible product categories upon logging in.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Commercial Invoice Access</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Generate, view, and download itemized PDF invoices and transaction breakdown statements directly from your reseller account portal.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Flexible Logistics Dispatch</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Ship bulk merchant consignments or dispatch customer orders directly to designated destination addresses across Bangladesh.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Step Process */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 shadow-xs space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How the Reseller Program Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Simple 4-step onboarding to access wholesale reseller benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">
                01
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Register Account</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create a standard storefront user account with valid business contact details.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">
                02
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Submit Request</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reach out via our Contact Support page specifying your business or merchant profile.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">
                03
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Account Activation</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Our support administration verifies partner credentials and assigns your Reseller role.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">
                04
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Start Ordering</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log in to enjoy live reseller prices, automated invoice logs, and priority fulfillment.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Contact Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to Become a Reseller?</h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-md">
              Contact our partner onboarding team today to learn more about wholesale account activation.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-emerald-700 font-extrabold text-xs rounded-xl shadow-md hover:bg-emerald-50 transition cursor-pointer"
          >
            <span>Contact Us to Learn More</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </div>
  );
}
