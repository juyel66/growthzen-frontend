'use client';

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProductFormValues } from '@/lib/validations/product';
import { FileText, Barcode, AlignLeft } from 'lucide-react';

interface ProductBasicInfoProps {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

export const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({ register, errors }) => {
  return (
    <div className="flex flex-col gap-5 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
      <div className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3">
        <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        Product General Information
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Product Title *
          </label>
          <input
            type="text"
            {...register('title')}
            placeholder="e.g. Premium Noise-Canceling Wireless Headphones"
            className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
              errors.title
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500'
            }`}
          />
          {errors.title && (
            <span className="text-xs font-semibold text-rose-500">{errors.title.message}</span>
          )}
        </div>

        {/* Product Code / SKU */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Product Code (SKU) *
          </label>
          <div className="relative">
            <Barcode className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              {...register('productCode')}
              placeholder="e.g. AUD-HEAD-001"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                errors.productCode
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500'
              }`}
            />
          </div>
          {errors.productCode && (
            <span className="text-xs font-semibold text-rose-500">{errors.productCode.message}</span>
          )}
        </div>

        {/* Barcode */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Barcode / EAN (Optional)
          </label>
          <input
            type="text"
            {...register('barcode')}
            placeholder="e.g. 8901234567890"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
        </div>

        {/* Short Description */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Short Description *
          </label>
          <textarea
            rows={2}
            {...register('shortDescription')}
            placeholder="Brief summary of key selling points (10 - 500 characters)"
            className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
              errors.shortDescription
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500'
            }`}
          />
          {errors.shortDescription && (
            <span className="text-xs font-semibold text-rose-500">{errors.shortDescription.message}</span>
          )}
        </div>

        {/* Full Description */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <AlignLeft className="w-3.5 h-3.5" /> Full Detailed Description *
          </label>
          <textarea
            rows={5}
            {...register('description')}
            placeholder="Comprehensive description of product features, build, usage instructions, and terms..."
            className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
              errors.description
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500'
            }`}
          />
          {errors.description && (
            <span className="text-xs font-semibold text-rose-500">{errors.description.message}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductBasicInfo;
