'use client';

import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { ProductFormValues } from '@/lib/validations/product';
import { Activity } from 'lucide-react';

interface ProductStatusProps {
  register: UseFormRegister<ProductFormValues>;
}

export const ProductStatus: React.FC<ProductStatusProps> = ({ register }) => {
  return (
    <div className="flex flex-col gap-2 p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
        <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        Product Status
      </div>

      <select
        {...register('status')}
        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer"
      >
        <option value="ACTIVE">ACTIVE (Visible in Storefront)</option>
        <option value="INACTIVE">INACTIVE (Hidden from Customers)</option>
        <option value="DRAFT">DRAFT (Work in Progress)</option>
      </select>
    </div>
  );
};

export default ProductStatus;

