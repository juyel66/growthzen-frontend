'use client';

import React, { useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { ProductFormValues } from '@/lib/validations/product';
import { DollarSign, Percent, Calculator, Tag, Users, UserCheck, Sparkles } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { selectIsReseller } from '@/features/auth/authSlice';

interface PricingSectionProps {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ register, errors, watch }) => {
  const isResellerUser = useAppSelector(selectIsReseller);
  const [previewRole, setPreviewRole] = useState<'CUSTOMER' | 'RESELLER'>(isResellerUser ? 'RESELLER' : 'CUSTOMER');

  const discountEnabled = watch('discountEnabled');

  const rawCostPrice = watch('costPrice');
  const costPrice = (rawCostPrice as any) === '' || rawCostPrice === null || rawCostPrice === undefined ? 0 : Number(rawCostPrice);

  const rawCustomerSellPrice = watch('customerSellPrice');
  const customerSellPrice = (rawCustomerSellPrice as any) === '' || rawCustomerSellPrice === null || rawCustomerSellPrice === undefined ? 0 : Number(rawCustomerSellPrice);

  const enableCustomerSpecialPrice = watch('enableCustomerSpecialPrice');
  const rawCustomerSpecialPrice = watch('customerSpecialPrice');
  const customerSpecialPrice = (rawCustomerSpecialPrice as any) === '' || rawCustomerSpecialPrice === null || rawCustomerSpecialPrice === undefined ? 0 : Number(rawCustomerSpecialPrice);

  const rawResellerPrice = watch('resellerPrice');
  const resellerPrice = (rawResellerPrice as any) === '' || rawResellerPrice === null || rawResellerPrice === undefined ? 0 : Number(rawResellerPrice);

  const enableResellerSpecialPrice = watch('enableResellerSpecialPrice');
  const rawResellerSpecialPrice = watch('resellerSpecialPrice');
  const resellerSpecialPrice = (rawResellerSpecialPrice as any) === '' || rawResellerSpecialPrice === null || rawResellerSpecialPrice === undefined ? 0 : Number(rawResellerSpecialPrice);

  const discountType = watch('discountType');
  const rawDiscountValue = watch('discountValue');
  const discountValue = (rawDiscountValue as any) === '' || rawDiscountValue === null || rawDiscountValue === undefined ? 0 : Number(rawDiscountValue);

  const rawTaxRate = watch('taxRate');
  const taxRate = (rawTaxRate as any) === '' || rawTaxRate === null || rawTaxRate === undefined ? 0 : Number(rawTaxRate);

  // Dynamic Live Preview calculation based on selected preview role & active special prices
  const isResellerPreview = previewRole === 'RESELLER';
  const baseSellPrice = isResellerPreview ? resellerPrice : customerSellPrice;
  const activeSpecialPrice = isResellerPreview
    ? (enableResellerSpecialPrice ? resellerSpecialPrice : 0)
    : (enableCustomerSpecialPrice ? customerSpecialPrice : 0);
  const effectiveBasePrice = activeSpecialPrice > 0 ? activeSpecialPrice : baseSellPrice;

  let calculatedDiscount = 0;
  if (discountEnabled && effectiveBasePrice > 0) {
    if (discountType === 'PERCENTAGE' && discountValue > 0) {
      calculatedDiscount = (effectiveBasePrice * discountValue) / 100;
    } else if (discountType === 'FIXED' && discountValue > 0) {
      calculatedDiscount = discountValue;
    }
  }

  const finalCalculatedPrice = Math.max(0, effectiveBasePrice - calculatedDiscount);
  const taxAmount = (finalCalculatedPrice * taxRate) / 100;
  const totalPriceWithTax = finalCalculatedPrice + taxAmount;

  return (
    <div className="flex flex-col gap-5 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-3">
        <div className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-200">
          <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Pricing, Taxes & Discounts
        </div>

        {/* Live Role-based Preview Badge & Role Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setPreviewRole('CUSTOMER')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                previewRole === 'CUSTOMER'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3 h-3" /> Customer Preview
            </button>
            <button
              type="button"
              onClick={() => setPreviewRole('RESELLER')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                previewRole === 'RESELLER'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Users className="w-3 h-3" /> Reseller Preview
            </button>
          </div>

          {effectiveBasePrice > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <Calculator className="w-3.5 h-3.5" />
              {previewRole} Display Price: ৳{finalCalculatedPrice.toFixed(2)}
              {taxRate > 0 && <span className="text-[11px] font-normal text-emerald-600">(৳{totalPriceWithTax.toFixed(2)} incl. tax)</span>}
            </div>
          )}
        </div>
      </div>

      {/* Primary Sell Prices Grid (3 Main Fields) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Cost Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Cost Price (৳) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
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

        {/* 2. Customer Sell Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Customer Sell Price (৳) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
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

        {/* 3. Reseller Sell Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Reseller Sell Price (৳) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
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
      </div>

      {/* Customer & Reseller Special Pricing Sections with Checkboxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Customer Special Price Box */}
        <div className="flex flex-col gap-3 p-4 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/70 rounded-xl">
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              id="enable-customer-special-price"
              {...register('enableCustomerSpecialPrice')}
              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="enable-customer-special-price" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Enable Customer Special Price
            </label>
          </div>

          {enableCustomerSpecialPrice && (
            <div className="flex flex-col gap-1.5 pl-6 transition-all">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Customer Special Price (৳) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                <input
                  type="number"
                  step="0.01"
                  {...register('customerSpecialPrice')}
                  placeholder="e.g. 1350.00"
                  className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
              {errors.customerSpecialPrice && <span className="text-xs text-rose-500">{errors.customerSpecialPrice.message}</span>}
              <span className="text-[11px] text-slate-400 font-medium">
                Customer product page will display Old Price strikethrough & Special Price.
              </span>
            </div>
          )}
        </div>

        {/* Reseller Special Price Box */}
        <div className="flex flex-col gap-3 p-4 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/70 rounded-xl">
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              id="enable-reseller-special-price"
              {...register('enableResellerSpecialPrice')}
              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="enable-reseller-special-price" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Enable Reseller Special Price
            </label>
          </div>

          {enableResellerSpecialPrice && (
            <div className="flex flex-col gap-1.5 pl-6 transition-all">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Reseller Special Price (৳) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                <input
                  type="number"
                  step="0.01"
                  {...register('resellerSpecialPrice')}
                  placeholder="e.g. 1000.00"
                  className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
              {errors.resellerSpecialPrice && <span className="text-xs text-rose-500">{errors.resellerSpecialPrice.message}</span>}
              <span className="text-[11px] text-slate-400 font-medium">
                Reseller product page will display Old Reseller Price strikethrough & Special Reseller Price.
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        {/* Checkbox: Enable Product Discount */}
        <div className="flex items-center gap-3 py-2 px-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl md:col-span-3">
          <input
            type="checkbox"
            id="enable-product-discount"
            {...register('discountEnabled')}
            className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
          />
          <label htmlFor="enable-product-discount" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none">
            Enable Additional Product Discount
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
            <option value="FIXED">Fixed Amount (৳)</option>
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
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
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
