'use client';

import React from 'react';
import LegalPageLayout, { PolicySectionItem } from '@/components/legal/LegalPageLayout';
import Link from 'next/link';

const sections: PolicySectionItem[] = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'information-collected', title: 'Information We Collect' },
  { id: 'account-information', title: 'Account Information' },
  { id: 'order-information', title: 'Order & Transaction Information' },
  { id: 'shipping-information', title: 'Shipping Information' },
  { id: 'payment-information', title: 'Payment Information' },
  { id: 'how-we-use', title: 'How We Use Information' },
  { id: 'cookies', title: 'Cookies & Similar Technologies' },
  { id: 'data-sharing', title: 'Data Sharing' },
  { id: 'service-providers', title: 'Service Providers' },
  { id: 'data-security', title: 'Data Security' },
  { id: 'data-retention', title: 'Data Retention' },
  { id: 'user-rights', title: 'User Rights' },
  { id: 'children-privacy', title: 'Children\'s Privacy' },
  { id: 'policy-changes', title: 'Changes to This Policy' },
  { id: 'contact-info', title: 'Contact Information' },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="Learn how GrowthZen Trends collects, uses, and safeguards your personal data when you browse our storefront or place orders."
      canonicalUrl="https://growthzentrends.com/privacy-policy"
      metaDescription="Read the official Privacy Policy for GrowthZen Trends. Learn about how we handle user accounts, order transactions, shipping details, and data security."
      sections={sections}
    >
      <section id="introduction" className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">1. Introduction</h2>
        <p>
          Welcome to <strong>GrowthZen Trends</strong>. We are committed to maintaining the trust and confidence of our storefront visitors, registered retail customers, and wholesale resellers. This Privacy Policy outlines the types of information we may collect when you visit our website, register an account, browse product categories, or complete a transaction.
        </p>
        <p>
          By accessing or using GrowthZen Trends services, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with our practices, please discontinue using our storefront.
        </p>
      </section>

      <section id="information-collected" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">2. Information We Collect</h2>
        <p>
          We collect personal information necessary to operate an efficient ecommerce platform, fulfill orders, calculate role-based pricing, and provide responsive customer care.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Directly Provided Information:</strong> Full name, email address, phone number, shipping address, billing address, and account credentials.</li>
          <li><strong>Automated Data:</strong> IP address, browser type, device details, page view history, and shopping cart interactions.</li>
        </ul>
      </section>

      <section id="account-information" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">3. Account Information</h2>
        <p>
          When you register for a <strong>Customer</strong> or <strong>Reseller</strong> account on GrowthZen Trends, we store your profile data securely to verify access privileges and role-specific benefits.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Customer Accounts:</strong> Standard account profiles used to track order history, generate invoices, manage saved items in your Wishlist, and access customer promotional discounts.</li>
          <li><strong>Reseller Accounts:</strong> Accounts subjected to business classification, granting authorized access to special reseller pricing tiers and bulk order management features.</li>
        </ul>
      </section>

      <section id="order-information" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">4. Order & Transaction Information</h2>
        <p>
          When you place an order on GrowthZen Trends, we store transaction details including item SKUs, quantities, subtotal, applicable taxes, shipping fees, applied coupon codes, and final invoice calculations. This information is retained to produce verifiable invoices and support order tracking.
        </p>
      </section>

      <section id="shipping-information" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">5. Shipping Information</h2>
        <p>
          To complete order delivery, we collect recipient names, delivery addresses, primary phone numbers, and special delivery notes. This data is shared with designated logistics and courier partners strictly for order transport purposes.
        </p>
      </section>

      <section id="payment-information" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">6. Payment Information</h2>
        <p>
          GrowthZen Trends supports Cash on Delivery (COD), Mobile Financial Services (mFS), and card processing gateways. We do not store sensitive payment credentials or payment card PINs directly on our servers. Online payment transactions are handled through encrypted payment gateway integration.
        </p>
      </section>

      <section id="how-we-use" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">7. How We Use Information</h2>
        <p>We use the collected information for business purposes including:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Processing, confirming, and delivering your orders.</li>
          <li>Generating PDF invoices and transaction records.</li>
          <li>Enforcing role-based customer and reseller pricing structures.</li>
          <li>Providing order status updates and customer support responses.</li>
          <li>Detecting and preventing fraudulent transactions or account misuse.</li>
        </ul>
      </section>

      <section id="cookies" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">8. Cookies & Similar Technologies</h2>
        <p>
          GrowthZen Trends uses session storage and browser cookies to maintain user authentication states, persist items inside your shopping cart, remember user theme preferences, and analyze storefront performance. You may disable cookies in your browser settings, though certain interactive shopping features may function with reduced functionality.
        </p>
      </section>

      <section id="data-sharing" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">9. Data Sharing</h2>
        <p>
          We do not sell, rent, or trade your personal information to third-party marketers. We may share information only under necessary circumstances:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>With authorized delivery couriers to transport physical packages.</li>
          <li>With payment processors to complete electronic payments.</li>
          <li>When required by law, legal order, or governmental regulation.</li>
        </ul>
      </section>

      <section id="service-providers" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">10. Service Providers</h2>
        <p>
          We may engage trusted third-party service providers (such as hosting infrastructure, email dispatch services, and analytics partners) to support platform operations. These service providers process data under obligation of confidentiality.
        </p>
      </section>

      <section id="data-security" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">11. Data Security</h2>
        <p>
          We implement technical safeguards including SSL encryption, secure API authentication tokens, hashed passwords, and database access controls to protect user data from unauthorized access, loss, or disclosure.
        </p>
      </section>

      <section id="data-retention" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">12. Data Retention</h2>
        <p>
          We retain account and transaction records for as long as your account remains active or as required by applicable tax, commercial, and financial record-keeping standards.
        </p>
      </section>

      <section id="user-rights" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">13. User Rights</h2>
        <p>
          Registered users may access, view, and update profile details from their account dashboard. You may also request account deactivation or inquire about your stored transaction history by contacting our support team.
        </p>
      </section>

      <section id="children-privacy" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">14. Children&apos;s Privacy</h2>
        <p>
          GrowthZen Trends storefront is intended for general audiences and adult consumers. We do not knowingly collect personal information from individuals under the age of 18 without parental consent.
        </p>
      </section>

      <section id="policy-changes" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">15. Changes to This Policy</h2>
        <p>
          We reserve the right to modify this Privacy Policy as our platform features and legal requirements evolve. Any updates will be published on this page with an updated &quot;Last Updated&quot; date.
        </p>
      </section>

      <section id="contact-info" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">16. Contact Information</h2>
        <p>
          For privacy inquiries or data requests, please contact our support team via our <Link href="/contact" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Contact Support Page</Link> or email us at support@growthzen.com.
        </p>
      </section>
    </LegalPageLayout>
  );
}
