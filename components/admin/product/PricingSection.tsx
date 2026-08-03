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
  const specialSaleEnabled = watch('specialSaleEnabled');
  const discountEnabled = watch('discountEnabled');

  const rawCustomerSellPrice = watch('customerSellPrice');
  const customerSellPrice = (rawCustomerSellPrice as any) === '' || rawCustomerSellPrice === null || rawCustomerSellPrice === undefined ? 0 : Number(rawCustomerSellPrice);

  const rawSalePrice = watch('salePrice');
  const salePrice = (rawSalePrice as any) === '' || rawSalePrice === null || rawSalePrice === undefined ? 0 : Number(rawSalePrice);

  const discountType = watch('discountType');
  const rawDiscountValue = watch('discountValue');
  const discountValue = (rawDiscountValue as any) === '' || rawDiscountValue === null || rawDiscountValue === undefined ? 0 : Number(rawDiscountValue);

  const rawTaxRate = watch('taxRate');
  const taxRate = (rawTaxRate as any) === '' || rawTaxRate === null || rawTaxRate === undefined ? 0 : Number(rawTaxRate);

  // Live calculation preview
  const baseEffectivePrice = specialSaleEnabled && salePrice > 0 ? salePrice : customerSellPrice;
  let calculatedDiscount = 0;
  if (discountEnabled) {
    if (discountType === 'PERCENTAGE' && discountValue > 0) {
      calculatedDiscount = (baseEffectivePrice * discountValue) / 100;
    } else if (discountType === 'FIXED' && discountValue > 0) {
      calculatedDiscount = discountValue;
    }
  }

  const finalCalculatedPrice = Math.max(0, baseEffectivePrice - calculatedDiscount);
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
        {baseEffectivePrice > 0 && (
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

        {/* Checkbox: Enable Special Sale */}
        <div className="flex items-center gap-3 py-2 px-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl md:col-span-3">
          <input
            type="checkbox"
            id="enable-special-sale"
            {...register('specialSaleEnabled')}
            className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
          />
          <label htmlFor="enable-special-sale" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none">
            Enable Special Sale Price
          </label>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            (When enabled, Special Sale Price overrides Customer Sell Price in product listing preview)
          </span>
        </div>

        {/* Special Sale Price (Conditionally Rendered) */}
        {specialSaleEnabled && (
          <div className="flex flex-col gap-1.5 md:col-span-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Special Sale Price ($)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                step="0.01"
                {...register('salePrice')}
                placeholder="Enter special sale price"
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
            {errors.salePrice && <span className="text-xs text-rose-500">{errors.salePrice.message}</span>}
          </div>
        )}

        {/* Checkbox: Enable Product Discount */}
        <div className="flex items-center gap-3 py-2 px-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl md:col-span-3">
          <input
            type="checkbox"
            id="enable-product-discount"
            {...register('discountEnabled')}
            className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
          />
          <label htmlFor="enable-product-discount" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none">
            Enable Product Discount
          </label>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            (Check to configure Percentage or Fixed Amount discount for this product)
          </span>
        </div>

        {/* Discount Type */}
        <div className={`flex flex-col gap-1.5 transition-opacity ${!discountEnabled ? 'opacity-40' : ''}`}>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Discount Type (Optional)
          </label>
          <select
            {...register('discountType')}
            disabled={!discountEnabled}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer disabled:cursor-not-allowed"
          >
            <option value="">Select Discount Type (Optional)</option>
            <option value="PERCENTAGE">Percentage (%)</option>
            <option value="FIXED">Fixed Amount ($)</option>
          </select>
        </div>

        {/* Discount Value */}
        <div className={`flex flex-col gap-1.5 transition-opacity ${!discountEnabled ? 'opacity-40' : ''}`}>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Discount Value (Optional)
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
              disabled={!discountEnabled}
              placeholder={discountType === 'PERCENTAGE' ? 'e.g. 15' : 'e.g. 10.00 (Optional)'}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition disabled:cursor-not-allowed"
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
