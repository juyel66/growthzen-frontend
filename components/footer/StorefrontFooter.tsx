'use client';

import React from 'react';
import Link from 'next/link';
import Container from '@/components/navbar/Container';
import { useGetSettingsQuery } from '@/services/settingsApi';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated, selectIsReseller, selectCurrentUser } from '@/features/auth/authSlice';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const StorefrontFooter: React.FC = () => {
  const { data: settings } = useGetSettingsQuery();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isReseller = useAppSelector(selectIsReseller);
  const currentUser = useAppSelector(selectCurrentUser);

  const general = settings?.general;
  const payment = settings?.payment;

  const storeName = general?.storeName || general?.siteName || 'GrowthZen Trends';
  const supportPhone = general?.supportPhone || '+880 1700-000000';
  const supportEmail = general?.supportEmail || general?.storeEmail || 'support@growthzen.com';
  const businessAddress = general?.businessAddress || 'Dhaka, Bangladesh';

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-900 text-slate-300 font-sans border-t border-slate-800 pt-12 pb-6">
      <Container className="flex flex-col gap-12">
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Reliable Shipping</h4>
              <p className="text-xs text-slate-400">Fast nationwide order delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Role-Based Pricing</h4>
              <p className="text-xs text-slate-400">Verified customer & reseller rates</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Easy Returns</h4>
              <p className="text-xs text-slate-400">Hassle-free defective replacements</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cash & Online Pay</h4>
              <p className="text-xs text-slate-400">COD & secure checkout methods</p>
            </div>
          </div>
        </div>

        {/* 4-Column Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Brand & Contact Info */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-black text-white tracking-tight">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-sm">
                GZ
              </span>
              <span>{storeName}</span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed">
              Quality products, competitive prices, and a convenient shopping experience for retail customers and wholesale resellers.
            </p>

            <div className="flex flex-col gap-2.5 pt-2 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{supportPhone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{supportEmail}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{businessAddress}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sat – Thu: 9:00 AM – 8:00 PM</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white border-l-2 border-emerald-500 pl-3">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Shop Catalog
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> All Categories
                </Link>
              </li>
              <li>
                <Link href="/best-sellers" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Special Offers
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer & Account Services */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white border-l-2 border-emerald-500 pl-3">
              Customer Services
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs font-medium">
              {isAuthenticated ? (
                <>
                  {isReseller ? (
                    <li>
                      <Link href="/account/reseller-dashboard" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-400 font-bold">
                        <Sparkles className="w-3 h-3" /> Reseller Dashboard
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link href="/account/profile" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                        <ChevronRight className="w-3 h-3 text-slate-500" /> My Profile
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link href="/order/my-orders" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-slate-500" /> My Orders
                    </Link>
                  </li>
                  <li>
                    <Link href="/invoice/my-invoices" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-slate-500" /> My Invoices
                    </Link>
                  </li>
                  <li>
                    <Link href="/wishlist" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-slate-500" /> Saved Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link href="/cart" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-slate-500" /> Shopping Cart
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/auth/login" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-slate-500" /> Customer Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/register" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-slate-500" /> Register Account
                    </Link>
                  </li>
                  <li>
                    <Link href="/order/my-orders" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-slate-500" /> Order Tracking
                    </Link>
                  </li>
                  <li>
                    <Link href="/wishlist" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-slate-500" /> My Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-slate-500" /> Help & Support
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Column 4: Legal & Policies */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white border-l-2 border-emerald-500 pl-3">
              Legal & Terms
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs font-medium">
              <li>
                <Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Accepted Payment Methods & Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-300">Accepted Payment Methods:</span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-[11px] font-bold text-emerald-400 border border-slate-700">
                Cash on Delivery
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-[11px] font-bold text-slate-300 border border-slate-700">
                bKash / Nagad
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-[11px] font-bold text-slate-300 border border-slate-700">
                Visa / MasterCard
              </span>
            </div>
          </div>

          <p className="text-center md:text-right">
            &copy; {currentYear} {storeName}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default StorefrontFooter;
