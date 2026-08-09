'use client';

import React from 'react';
import LegalPageLayout, { PolicySectionItem } from '@/components/legal/LegalPageLayout';
import Link from 'next/link';

const sections: PolicySectionItem[] = [
  { id: 'eligibility', title: 'Return Eligibility' },
  { id: 'damaged-items', title: 'Damaged or Defective Products' },
  { id: 'incorrect-items', title: 'Incorrect Items Delivered' },
  { id: 'return-process', title: 'Return Request Process' },
  { id: 'evidence-requirements', title: 'Required Photos & Evidence' },
  { id: 'refund-processing', title: 'Refund Processing' },
  { id: 'non-returnable', title: 'Non-Returnable Products' },
  { id: 'reseller-orders', title: 'Reseller Order Considerations' },
  { id: 'support-contact', title: 'Support & Contact' },
];

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund & Return Policy"
      subtitle="Guidelines on return eligibility, defective item claims, inspection procedures, and refund timelines for GrowthZen Trends orders."
      canonicalUrl="https://growthzentrends.com/refund-policy"
      metaDescription="Read the official Refund & Return Policy for GrowthZen Trends. Learn about return eligibility, photo verification requirements, refund methods, and reseller guidelines."
      sections={sections}
    >
      <section id="eligibility" className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">1. Return Eligibility</h2>
        <p>
          At <strong>GrowthZen Trends</strong>, customer satisfaction is our priority. Products purchased through our storefront may be eligible for return or exchange if they meet the following conditions:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>The product is damaged, defective, or missing components upon initial delivery.</li>
          <li>The delivered product differs substantially from the ordered item (e.g. wrong size, color, or model).</li>
          <li>The return claim is initiated within the valid support window following delivery.</li>
          <li>The item remains unused, in original packaging, with all labels, tags, and accessories intact.</li>
        </ul>
      </section>

      <section id="damaged-items" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">2. Damaged or Defective Products</h2>
        <p>
          If your shipment arrives with visible transit damage or a manufacturing defect, please notify our customer service team immediately. We will arrange a replacement or issue a full refund upon verification.
        </p>
      </section>

      <section id="incorrect-items" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">3. Incorrect Items Delivered</h2>
        <p>
          In the rare event that you receive an item different from what was stated on your order confirmation or invoice, GrowthZen Trends will cover return shipping and send the correct item at no additional charge.
        </p>
      </section>

      <section id="return-process" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">4. Return Request Process</h2>
        <p>To initiate a return or exchange:</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Log into your account and navigate to <Link href="/order/my-orders" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">My Orders</Link> (or contact support with your Invoice number).</li>
          <li>Submit a support inquiry stating the reason for return and attaching photo/video evidence.</li>
          <li>Our quality team will review the claim and provide return dispatch instructions.</li>
        </ol>
      </section>

      <section id="evidence-requirements" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">5. Required Photos & Evidence</h2>
        <p>
          To protect against fraudulent claims, return requests for damaged or defective items require clear photographs or unboxing video footage showing:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>The outer shipping package with visible shipping label.</li>
          <li>The defect or damage on the product itself.</li>
          <li>Original packaging materials and accessories.</li>
        </ul>
      </section>

      <section id="refund-processing" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">6. Refund Processing</h2>
        <p>
          Once returned items are received and inspected at our warehouse, refunds are processed via the original payment method or store credit:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Cash on Delivery Orders:</strong> Refunded via bank transfer or mobile financial service (bKash/Nagad).</li>
          <li><strong>Online Gateway Orders:</strong> Refunded to the originating card or digital wallet.</li>
          <li>Processing time: Usually 3 to 7 business days following item inspection.</li>
        </ul>
      </section>

      <section id="non-returnable" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">7. Non-Returnable Products</h2>
        <p>Certain items are non-returnable due to hygiene and safety regulations, including:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Personal care and opened beauty products.</li>
          <li>Innerwear and intimates.</li>
          <li>Clearance sale items explicitly marked as non-refundable.</li>
        </ul>
      </section>

      <section id="reseller-orders" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">8. Reseller Order Considerations</h2>
        <p>
          For authorized <strong>Reseller Accounts</strong>, bulk order returns are subjected to reseller agreement terms. Defective items in bulk shipments are handled via itemized replacement or reseller account credit.
        </p>
      </section>

      <section id="support-contact" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">9. Support & Contact</h2>
        <p>
          Have questions regarding an active return? Reach out through our <Link href="/contact" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Contact Support Page</Link> or email support@growthzen.com.
        </p>
      </section>
    </LegalPageLayout>
  );
}
