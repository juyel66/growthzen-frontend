'use client';

import React from 'react';
import LegalPageLayout, { PolicySectionItem } from '@/components/legal/LegalPageLayout';
import Link from 'next/link';

const sections: PolicySectionItem[] = [
  { id: 'delivery-areas', title: 'Delivery Coverage Areas' },
  { id: 'standard-delivery', title: 'Standard Delivery Options' },
  { id: 'delivery-times', title: 'Estimated Delivery Times' },
  { id: 'shipping-charges', title: 'Shipping Charges & Zones' },
  { id: 'free-delivery-policy', title: 'Free Delivery System' },
  { id: 'delivery-delays', title: 'Delivery Delays & Carrier Info' },
  { id: 'incorrect-address', title: 'Address Accuracy' },
  { id: 'failed-delivery', title: 'Failed Delivery Attempts' },
  { id: 'reseller-shipping', title: 'Reseller Shipping Guidelines' },
];

export default function ShippingPolicyPage() {
  return (
    <LegalPageLayout
      title="Shipping & Delivery Policy"
      subtitle="Information on shipping zones, delivery timelines, courier services, free delivery offers, and reseller fulfillment."
      canonicalUrl="https://growthzentrends.com/shipping-policy"
      metaDescription="Read the official Shipping & Delivery Policy for GrowthZen Trends. Learn about nationwide delivery zones, shipping charges, free shipping eligibility, and order tracking."
      sections={sections}
    >
      <section id="delivery-areas" className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">1. Delivery Coverage Areas</h2>
        <p>
          <strong>GrowthZen Trends</strong> delivers products nationwide. We partner with established logistics networks and courier partners to ensure safe and prompt shipment to your designated address.
        </p>
      </section>

      <section id="standard-delivery" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">2. Standard Delivery Options</h2>
        <p>
          We offer standard doorstep delivery and local pickup options where applicable. Orders are packaged in secure protective materials to prevent damage during transit.
        </p>
      </section>

      <section id="delivery-times" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">3. Estimated Delivery Times</h2>
        <p>Delivery estimates depend on destination location:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Metropolitan Area:</strong> Typically 1 to 3 business days following order dispatch.</li>
          <li><strong>Suburban & Regional Area:</strong> Typically 3 to 5 business days following order dispatch.</li>
        </ul>
      </section>

      <section id="shipping-charges" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">4. Shipping Charges & Zones</h2>
        <p>
          Shipping charges vary based on delivery destination zones, package weight, and current logistics rates. Exact shipping costs are calculated dynamically during checkout.
        </p>
      </section>

      <section id="free-delivery-policy" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">5. Free Delivery System</h2>
        <p>
          GrowthZen Trends integrates a dynamic Free Delivery management system. Delivery charges may be automatically waived under the following conditions:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>The product or category has active <strong>Free Shipping</strong> enabled by store administration.</li>
          <li>The order qualifies for promotional free shipping campaigns or minimum order spend thresholds.</li>
          <li>Special coupon codes offering free shipping are applied at checkout.</li>
        </ul>
      </section>

      <section id="delivery-delays" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">6. Delivery Delays & Carrier Info</h2>
        <p>
          While we strive for timely fulfillment, external factors such as severe weather, national holidays, courier operational bottlenecks, or remote access issues may cause unexpected delays. Customers can monitor order progress via <Link href="/order/my-orders" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">My Orders Tracking</Link>.
        </p>
      </section>

      <section id="incorrect-address" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">7. Address Accuracy</h2>
        <p>
          Customers are responsible for providing complete shipping addresses including phone numbers and contact details. GrowthZen Trends is not responsible for shipment delays resulting from incorrect address inputs.
        </p>
      </section>

      <section id="failed-delivery" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">8. Failed Delivery Attempts</h2>
        <p>
          Couriers will attempt delivery multiple times. If delivery fails due to customer unavailability or unreachable phone numbers, packages will be returned to our fulfillment warehouse.
        </p>
      </section>

      <section id="reseller-shipping" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">9. Reseller Shipping Guidelines</h2>
        <p>
          For authorized <strong>Reseller Accounts</strong> placing bulk shipments, specialized freight or cargo dispatch can be arranged. Contact your account representative or support for custom logistics requirements.
        </p>
      </section>
    </LegalPageLayout>
  );
}
