'use client';

import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { ProductFormValues } from '@/lib/validations/product';
import { DollarSign, Percent, Calculator, Tag } from 'lucide-react';

interface PricingSectionProps {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ register, errors, watch }) => {
  const customerSellPrice = Number(watch('customerSellPrice')) || 0;
  const discountType = watch('discountType');
  const discountValue = Number(watch('discountValue')) || 0;
  const taxRate = Number(watch('taxRate')) || 0;

  // Live calculation preview
  let calculatedDiscount = 0;
  if (discountType === 'PERCENTAGE' && discountValue > 0) {
    calculatedDiscount = (customerSellPrice * discountValue) / 100;
  } else if (discountType === 'FIXED' && discountValue > 0) {
    calculatedDiscount = discountValue;
  }

  const finalCalculatedPrice = Math.max(0, customerSellPrice - calculatedDiscount);
  const taxAmount = (finalCalculatedPrice * taxRate) / 100;
  const totalPriceWithTax = finalCalculatedPrice + taxAmount;

  return (
    <div className="flex flex-col gap-5 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-200">
          <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Pricing, Taxes & Discounts
        </div>

        {/* Live Calculation Preview Badge */}
        {customerSellPrice > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <Calculator className="w-3.5 h-3.5" />
            Final Preview: ${finalCalculatedPrice.toFixed(2)}
            {taxRate > 0 && <span className="text-[11px] font-normal text-emerald-600">(${totalPriceWithTax.toFixed(2)} incl. tax)</span>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cost Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Cost Price ($) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
            <input
              type="number"
              step="0.01"
              {...register('costPrice')}
              placeholder="0.00"
              className={`w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition ${
                errors.costPrice ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
              }`}
            />
          </div>
          {errors.costPrice && <span className="text-xs text-rose-500">{errors.costPrice.message}</span>}
        </div>

        {/* Customer Sell Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Customer Sell Price ($) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
            <input
              type="number"
              step="0.01"
              {...register('customerSellPrice')}
              placeholder="0.00"
              className={`w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition ${
                errors.customerSellPrice ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
              }`}
            />
          </div>
          {errors.customerSellPrice && <span className="text-xs text-rose-500">{errors.customerSellPrice.message}</span>}
        </div>

        {/* Reseller Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Reseller Price ($) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
            <input
              type="number"
              step="0.01"
              {...register('resellerPrice')}
              placeholder="0.00"
              className={`w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition ${
                errors.resellerPrice ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
              }`}
            />
          </div>
          {errors.resellerPrice && <span className="text-xs text-rose-500">{errors.resellerPrice.message}</span>}
        </div>

        {/* Sale Price (Optional Override) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Special Sale Price ($) (Optional)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
            <input
              type="number"
              step="0.01"
              {...register('salePrice')}
              placeholder="Leave empty if none"
              className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>
        </div>

        {/* Discount Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Discount Type
          </label>
          <select
            {...register('discountType')}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          >
            <option value="">No Discount</option>
            <option value="PERCENTAGE">Percentage (%)</option>
            <option value="FIXED">Fixed Amount ($)</option>
          </select>
        </div>

        {/* Discount Value */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Discount Value
          </label>
          <div className="relative">
            {discountType === 'PERCENTAGE' ? (
              <Percent className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            ) : (
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
            )}
            <input
              type="number"
              step="0.01"
              {...register('discountValue')}
              disabled={!discountType}
              placeholder={discountType === 'PERCENTAGE' ? 'e.g. 15' : 'e.g. 10.00'}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>
          {errors.discountValue && <span className="text-xs text-rose-500">{errors.discountValue.message}</span>}
        </div>

        {/* Tax Rate */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Tax Rate (%) (Optional)
          </label>
          <div className="relative">
            <Percent className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              step="0.01"
              {...register('taxRate')}
              placeholder="e.g. 5"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>
        </div>

        {/* Coupon Code */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Associated Coupon Code (Optional)
          </label>
          <div className="relative">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              {...register('couponCode')}
              placeholder="e.g. SUMMER2026"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
