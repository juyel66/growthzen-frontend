'use client';

import React from 'react';
import Link from 'next/link';
import Container from '@/components/navbar/Container';
import {
  Briefcase,
  Code2,
  Truck,
  Headphones,
  LineChart,
  Boxes,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function CareersPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8 font-sans">
      <title>Careers | GrowthZen Trends</title>
      <meta
        name="description"
        content="Interested in working with GrowthZen Trends? Explore career areas across Technology, E-Commerce Operations, Customer Support, Marketing, and Product Development."
      />

      <Container className="flex flex-col gap-12">
        {/* Hero Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 sm:p-14 text-white shadow-xl flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 mb-2">
            <Briefcase className="w-8 h-8" />
          </div>

          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-3.5 py-1 rounded-full border border-emerald-500/30">
              <Sparkles className="w-4 h-4" /> Work With Us
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Build the Future of E-Commerce
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Interested in joining GrowthZen Trends? We are constantly seeking passionate individuals to collaborate across technology, customer care, supply chain, and digital growth.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition cursor-pointer"
            >
              <span>Get in Touch with Talent Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Operational Areas Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Our Core Career Fields
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Explore key operational departments driving our storefront platform forward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Technology & Engineering</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Building scalable web interfaces, RESTful microservices, API integrations, and secure role-based e-commerce architectures.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Operations & Logistics</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Managing inventory checks, warehouse packaging, partner courier dispatch, and nationwide delivery accuracy.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Customer Support</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Delivering responsive assistance, resolving order inquiries, handling return verifications, and supporting reseller onboarding.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <LineChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Digital Marketing & Growth</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Designing promotional banner campaigns, executing customer retention strategies, and optimizing multi-channel engagement.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 md:col-span-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                <Boxes className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Product & Business Development</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Sourcing authentic inventory from verified manufacturers, building merchant reseller networks, and expanding catalog selection.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Contact Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Interested in Working with Us?</h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-md">
              Send us your profile or inquiry directly through our customer and talent contact team.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-emerald-700 font-extrabold text-xs rounded-xl shadow-md hover:bg-emerald-50 transition cursor-pointer"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </div>
  );
}
