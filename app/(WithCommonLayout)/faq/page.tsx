'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Container from '@/components/navbar/Container';
import {
  ChevronRight,
  Search,
  HelpCircle,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  Users,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode;
  category: 'ordering' | 'payment' | 'delivery' | 'returns' | 'reseller';
}

const faqData: FAQItem[] = [
  // Ordering & Account
  {
    id: 'how-to-order',
    category: 'ordering',
    question: 'How do I place an order on GrowthZen Trends?',
    answer:
      'Placing an order is simple! Browse our catalog or search for your desired product, select quantity and options, click "Add to Cart", and proceed to Checkout. Enter your delivery address, select a payment option (Cash on Delivery or Online Pay), and confirm your order.',
  },
  {
    id: 'account-required',
    category: 'ordering',
    question: 'Do I need an account to place an order?',
    answer:
      'You can register for a customer account or proceed with guest checkout. However, creating an account allows you to track live order updates, view saved invoices, save wishlist items, and access special customer discounts.',
  },
  {
    id: 'order-status',
    category: 'ordering',
    question: 'How can I check the status of my order?',
    answer: (
      <span>
        Log into your account and navigate to{' '}
        <Link href="/order/my-orders" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
          My Orders
        </Link>
        . You can view the live processing, dispatch, and delivery status of all current and past orders.
      </span>
    ),
  },

  // Payment & Pricing
  {
    id: 'payment-methods',
    category: 'payment',
    question: 'What payment methods are available?',
    answer:
      'We accept Cash on Delivery (COD), Mobile Financial Services (bKash, Nagad, Rocket), as well as major Debit and Credit cards (Visa, MasterCard) through our secure checkout gateway.',
  },
  {
    id: 'cod-available',
    category: 'payment',
    question: 'Is Cash on Delivery (COD) available nationwide?',
    answer:
      'Yes! Cash on Delivery is available for customers inside Dhaka as well as all major suburban and regional districts across Bangladesh. You can inspect the package upon arrival and pay cash directly to the delivery courier.',
  },
  {
    id: 'reseller-pricing-faq',
    category: 'payment',
    question: 'How does role-based / reseller pricing work?',
    answer: (
      <span>
        GrowthZen Trends features an enterprise role-based pricing system. Verified{' '}
        <Link href="/reseller-program" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
          Reseller Accounts
        </Link>{' '}
        automatically see wholesale discounted pricing across eligible product categories when logged in.
      </span>
    ),
  },

  // Delivery & Shipping
  {
    id: 'delivery-charge-calc',
    category: 'delivery',
    question: 'How is the delivery charge calculated?',
    answer: (
      <span>
        Delivery charges are calculated dynamically based on store delivery settings and destination zones (Inside Dhaka vs Outside Dhaka). Free Delivery may apply if your order qualifies for active store promotions or free shipping thresholds. For full details, view our{' '}
        <Link href="/shipping-policy" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
          Shipping Policy
        </Link>
        .
      </span>
    ),
  },
  {
    id: 'delivery-timeline',
    category: 'delivery',
    question: 'How long does delivery take?',
    answer:
      'Deliveries inside Dhaka typically take 1 to 3 business days. Deliveries outside Dhaka take approximately 3 to 5 business days, depending on location and courier dispatch schedules.',
  },

  // Returns & Refunds
  {
    id: 'return-request',
    category: 'returns',
    question: 'How can I request a return or replacement?',
    answer: (
      <span>
        If you receive a defective, damaged, or incorrect product, initiate a return request from{' '}
        <Link href="/order/my-orders" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
          My Orders
        </Link>{' '}
        or reach out via our{' '}
        <Link href="/contact" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
          Contact Support Page
        </Link>{' '}
        with clear photos of the damaged item. Check our{' '}
        <Link href="/refund-policy" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
          Refund Policy
        </Link>{' '}
        for details.
      </span>
    ),
  },

  // Reseller Program
  {
    id: 'reseller-join',
    category: 'reseller',
    question: 'How can I become a GrowthZen Trends reseller partner?',
    answer: (
      <span>
        Visit our{' '}
        <Link href="/reseller-program" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
          Reseller Program Page
        </Link>{' '}
        to learn about reseller account qualification, wholesale pricing benefits, and step-by-step account activation.
      </span>
    ),
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'how-to-order': true,
    'payment-methods': true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFAQs = faqData.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (typeof item.answer === 'string' &&
        item.answer.toLowerCase().includes(searchQuery.toLowerCase().trim()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8 font-sans">
      <title>Frequently Asked Questions | GrowthZen Trends</title>
      <meta
        name="description"
        content="Find answers to common questions about ordering, payment methods, delivery charges, return policies, and the reseller program at GrowthZen Trends."
      />

      <Container className="flex flex-col gap-8">
        {/* Breadcrumb Bar */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-slate-100 font-bold">Frequently Asked Questions</span>
        </nav>

        {/* Hero Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 sm:p-12 text-white shadow-xl flex flex-col items-center text-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <HelpCircle className="w-7 h-7" />
          </div>

          <div className="space-y-3 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Have questions about ordering, payments, delivery, or reseller membership? We have compiled instant answers for you below.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full max-w-xl mt-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search answers (e.g. delivery charge, COD, return)..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: 'All FAQs', icon: HelpCircle },
            { id: 'ordering', label: 'Ordering & Account', icon: ShoppingBag },
            { id: 'payment', label: 'Payment & Pricing', icon: CreditCard },
            { id: 'delivery', label: 'Delivery & Shipping', icon: Truck },
            { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
            { id: 'reseller', label: 'Reseller Program', icon: Users },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4 max-w-4xl mx-auto w-full">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => {
              const isOpen = Boolean(openItems[faq.id]);
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-emerald-500' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="p-5 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <HelpCircle className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold">No questions matching your search criteria.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>

        {/* Still Have Questions Contact Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold">Still Have Questions?</h3>
              <p className="text-xs sm:text-sm text-emerald-100">
                Our support team is ready to help you with order inquiries, product details, or reseller access.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="px-6 py-3 bg-white text-emerald-700 font-extrabold text-xs rounded-xl shadow-md hover:bg-emerald-50 transition cursor-pointer whitespace-nowrap"
          >
            Contact Customer Support
          </Link>
        </div>
      </Container>
    </div>
  );
}
