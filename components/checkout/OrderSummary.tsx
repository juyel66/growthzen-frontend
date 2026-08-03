'use client';

import React from 'react';
import SafeImage from '@/components/ui/SafeImage';
import Link from 'next/link';
import { CartItem } from '@/types/cart';
import { getProductTitle, getProductMainImage } from '@/types/product';
import { ShoppingBag, Truck, Tag, ShieldCheck } from 'lucide-react';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  couponDiscount: number;
  categoryDiscount?: number;
  tax?: number;
  grandTotal: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  shippingFee,
  couponDiscount,
  categoryDiscount = 0,
  tax = 0,
  grandTotal,
}) => {
  const totalDiscount = couponDiscount + categoryDiscount;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h3>
        <Link
          href="/cart"
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition"
        >
          Edit Cart
        </Link>
      </div>

      {/* Cart Items Preview List */}
      <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
        {items.map((item) => {
          const product = item.product;
          const title = getProductTitle(product);
          const image = getProductMainImage(product);
          const unitPrice = item.unitPrice ?? item.price ?? product?.customerSellPrice ?? product?.price ?? 0;
          const lineTotal = item.lineTotal ?? unitPrice * item.quantity;
          const productSlug = product?.slug || product?.id;

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80"
            >
              <div className="relative w-14 h-14 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shrink-0 overflow-hidden">
                {productSlug ? (
                  <Link href={`/products/${productSlug}`}>
                    <SafeImage
                      src={image}
                      alt={title}
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                  </Link>
                ) : (
                  <SafeImage
                    src={image}
                    alt={title}
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                )}
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 line-clamp-1">
                  {title}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {item.quantity} x ${unitPrice.toFixed(2)}
                </span>
              </div>

              <span className="font-extrabold text-xs text-slate-900 dark:text-white shrink-0">
                ${lineTotal.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Calculations Summary */}
      <div className="flex flex-col gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
        <div className="flex items-center justify-between">
          <span>Items Subtotal</span>
          <span className="font-bold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
        </div>

        {categoryDiscount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span>Category Discount</span>
            <span className="font-bold">-${categoryDiscount.toFixed(2)}</span>
          </div>
        )}

        {couponDiscount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Coupon Savings
            </span>
            <span className="font-bold">-${couponDiscount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> Shipping Fee
          </span>
          <span className="font-bold text-slate-900 dark:text-white">
            {shippingFee === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 uppercase font-extrabold text-[11px]">
                Free
              </span>
            ) : (
              `$${shippingFee.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Estimated Tax</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {tax === 0 ? 'Included' : `$${tax.toFixed(2)}`}
          </span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-extrabold text-slate-900 dark:text-white">Grand Total</span>
          {totalDiscount > 0 && (
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Total Savings: ${totalDiscount.toFixed(2)}
            </span>
          )}
        </div>
        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
          ${grandTotal.toFixed(2)}
        </span>
      </div>

      {/* Trust Seal */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-semibold pt-1">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Official Buyer Protection Guaranteed</span>
      </div>
    </div>
  );
};

export default OrderSummary;
