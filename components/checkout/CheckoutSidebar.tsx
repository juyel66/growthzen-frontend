'use client';

import React from 'react';
import { CartItem } from '@/types/cart';
import { Coupon } from '@/types/coupon';
import OrderSummary from './OrderSummary';
import CouponInput from './CouponInput';
import CouponCard from './CouponCard';
import PlaceOrderButton from './PlaceOrderButton';

interface CheckoutSidebarProps {
  items: CartItem[];
  subtotal: number;
  shippingFee: number | null;
  coupon: Coupon | null;
  couponDiscount: number;
  categoryDiscount?: number;
  tax?: number;
  grandTotal: number;
  isLoading: boolean;
  deliveryEnabled?: boolean;
  isFreeDelivery?: boolean;
  isSettingsLoading?: boolean;
  isSettingsError?: boolean;
  onCouponApplied: (coupon: Coupon, discountAmount: number) => void;
  onCouponRemoved: () => void;
}

export const CheckoutSidebar: React.FC<CheckoutSidebarProps> = ({
  items,
  subtotal,
  shippingFee,
  coupon,
  couponDiscount,
  categoryDiscount = 0,
  tax = 0,
  grandTotal,
  isLoading,
  deliveryEnabled = true,
  isFreeDelivery = false,
  isSettingsLoading = false,
  isSettingsError = false,
  onCouponApplied,
  onCouponRemoved,
}) => {
  return (
    <div className="sticky top-6 p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs flex flex-col gap-6">
      {/* 1. Order Items & Totals Breakdown */}
      <OrderSummary
        items={items}
        subtotal={subtotal}
        shippingFee={shippingFee}
        couponDiscount={couponDiscount}
        categoryDiscount={categoryDiscount}
        tax={tax}
        grandTotal={grandTotal}
        deliveryEnabled={deliveryEnabled}
        isFreeDelivery={isFreeDelivery}
        isSettingsLoading={isSettingsLoading}
        isSettingsError={isSettingsError}
      />

      {/* 2. Coupon Section */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
          Have a Promo Code?
        </span>
        {coupon ? (
          <CouponCard
            coupon={coupon}
            discountAmount={couponDiscount}
            onCouponRemoved={onCouponRemoved}
          />
        ) : (
          <CouponInput
            cartSubtotal={subtotal}
            onCouponApplied={onCouponApplied}
          />
        )}
      </div>

      {/* 3. Primary Place Order Submit CTA */}
      <div className="pt-2">
        <PlaceOrderButton
          isLoading={isLoading}
          disabled={items.length === 0 || !deliveryEnabled || isSettingsLoading || isSettingsError}
          isSettingsLoading={isSettingsLoading}
          isSettingsError={isSettingsError}
          grandTotal={grandTotal}
        />
      </div>
    </div>
  );
};

export default CheckoutSidebar;
