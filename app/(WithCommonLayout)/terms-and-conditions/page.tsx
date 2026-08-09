'use client';

import React from 'react';
import LegalPageLayout, { PolicySectionItem } from '@/components/legal/LegalPageLayout';
import Link from 'next/link';

const sections: PolicySectionItem[] = [
  { id: 'acceptance', title: 'Acceptance of Terms' },
  { id: 'registration', title: 'Account Registration' },
  { id: 'customer-accounts', title: 'Customer Accounts' },
  { id: 'reseller-accounts', title: 'Reseller Accounts' },
  { id: 'product-info', title: 'Product Information' },
  { id: 'pricing-general', title: 'Pricing Rules' },
  { id: 'customer-pricing', title: 'Customer Pricing' },
  { id: 'reseller-pricing', title: 'Reseller Pricing' },
  { id: 'special-prices', title: 'Special Prices & Discounts' },
  { id: 'orders', title: 'Orders & Placement' },
  { id: 'payment', title: 'Payment Terms' },
  { id: 'shipping-delivery', title: 'Shipping & Delivery' },
  { id: 'free-delivery', title: 'Free Delivery Offers' },
  { id: 'cancellation', title: 'Order Cancellation' },
  { id: 'returns-refunds', title: 'Returns & Refunds' },
  { id: 'availability', title: 'Product Availability' },
  { id: 'intellectual-property', title: 'Intellectual Property' },
  { id: 'prohibited-use', title: 'Prohibited Use' },
  { id: 'limitation-liability', title: 'Limitation of Liability' },
  { id: 'changes', title: 'Changes to Terms' },
  { id: 'contact', title: 'Contact Information' },
];

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      subtitle="The governing terms, role-based pricing policies, order guidelines, and storefront rules for GrowthZen Trends."
      canonicalUrl="https://growthzentrends.com/terms-and-conditions"
      metaDescription="Read the Terms and Conditions for GrowthZen Trends storefront. Covers customer and reseller account privileges, role-based pricing rules, shipping, and return policies."
      sections={sections}
    >
      <section id="acceptance" className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
        <p>
          By accessing, browsing, registering an account, or placing orders on <strong>GrowthZen Trends</strong>, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our storefront services.
        </p>
      </section>

      <section id="registration" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">2. Account Registration</h2>
        <p>
          You must provide accurate, current, and complete registration information. You are responsible for safeguarding your login credentials and for all activities conducted under your account.
        </p>
      </section>

      <section id="customer-accounts" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">3. Customer Accounts</h2>
        <p>
          <strong>Customer Accounts</strong> are designed for retail consumers. Customers purchase items at applicable customer prices, earn customer special price discounts when active, and track personal orders and invoices via their account dashboard.
        </p>
      </section>

      <section id="reseller-accounts" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">4. Reseller Accounts</h2>
        <p>
          <strong>Reseller Accounts</strong> are reserved for verified wholesale business partners. Approved reseller accounts gain access to reseller-specific pricing tiers and wholesale order capabilities. Reseller privilege abuse or unauthorized distribution may result in reseller status revocation.
        </p>
      </section>

      <section id="product-info" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">5. Product Information</h2>
        <p>
          We make every reasonable effort to display accurate product images, titles, SKUs, and specifications. However, actual colors and packaging may vary slightly due to screen resolutions and manufacturer batch updates.
        </p>
      </section>

      <section id="pricing-general" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">6. Pricing Rules</h2>
        <p>
          Prices displayed on the GrowthZen Trends storefront are stated in local currency. Applicable prices depend on your authenticated account role (Guest, Customer, or Reseller). Internal cost prices are strictly confidential and never exposed.
        </p>
      </section>

      <section id="customer-pricing" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">7. Customer Pricing</h2>
        <p>
          Retail customers receive standard customer pricing (`customerSellPrice`/`price`) alongside applicable category or promotional discounts.
        </p>
      </section>

      <section id="reseller-pricing" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">8. Reseller Pricing</h2>
        <p>
          Authenticated reseller accounts receive designated reseller pricing (`resellerSellPrice`/`resellerPrice`). Resellers do not see regular customer pricing as their applicable price.
        </p>
      </section>

      <section id="special-prices" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">9. Special Prices & Discounts</h2>
        <p>
          GrowthZen Trends supports Customer Special Prices, Reseller Special Prices, Category Discounts, and Coupon Codes. When enabled, special pricing supersedes standard list prices during checkout.
        </p>
      </section>

      <section id="orders" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">10. Orders & Placement</h2>
        <p>
          Submitting an order constitutes an offer to purchase products under these terms. GrowthZen Trends reserves the right to accept, reject, or cancel orders due to stock unavailability, pricing errors, or fraud suspicion.
        </p>
      </section>

      <section id="payment" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">11. Payment Terms</h2>
        <p>
          We accept Cash on Delivery (COD) and approved online payment methods. Payment must be cleared prior to dispatch unless COD is selected.
        </p>
      </section>

      <section id="shipping-delivery" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">12. Shipping & Delivery</h2>
        <p>
          Delivery times are estimates. Shipping fees are calculated dynamically based on selected delivery zones and active promotions.
        </p>
      </section>

      <section id="free-delivery" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">13. Free Delivery Offers</h2>
        <p>
          Free delivery may be granted dynamically for specific products, categories, active marketing campaigns, or order threshold amounts configured by store administration.
        </p>
      </section>

      <section id="cancellation" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">14. Order Cancellation</h2>
        <p>
          Orders may be canceled prior to dispatch by contacting support. Once an order is handed over to logistics partners, standard return policies apply.
        </p>
      </section>

      <section id="returns-refunds" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">15. Returns & Refunds</h2>
        <p>
          Returns and exchanges are processed in accordance with our <Link href="/refund-policy" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Refund & Return Policy</Link>. Defective or damaged items must be reported promptly.
        </p>
      </section>

      <section id="availability" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">16. Product Availability</h2>
        <p>
          Product availability is displayed in real-time. If an item becomes out of stock after order submission, our team will notify you to arrange a replacement or refund.
        </p>
      </section>

      <section id="intellectual-property" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">17. Intellectual Property</h2>
        <p>
          All logos, trademarks, page designs, software code, and content on GrowthZen Trends are the property of GrowthZen Trends and protected by intellectual property laws.
        </p>
      </section>

      <section id="prohibited-use" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">18. Prohibited Use</h2>
        <p>
          You agree not to exploit the platform for unlawful activities, attempt unauthorized database access, scrape storefront data without permission, or impersonate other users.
        </p>
      </section>

      <section id="limitation-liability" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">19. Limitation of Liability</h2>
        <p>
          GrowthZen Trends shall not be liable for indirect, incidental, or consequential damages resulting from platform downtime, delivery carrier delays, or misuse of purchased items.
        </p>
      </section>

      <section id="changes" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">20. Changes to Terms</h2>
        <p>
          We reserve the right to revise these Terms & Conditions at any time. Continued storefront usage signifies acceptance of updated terms.
        </p>
      </section>

      <section id="contact" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">21. Contact Information</h2>
        <p>
          Questions regarding these terms should be directed to our support team through the <Link href="/contact" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Contact Page</Link>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
