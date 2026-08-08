'use client';

import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { ProductFormValues } from '@/lib/validations/product';
import { Sparkles } from 'lucide-react';

interface FeaturedSwitchProps {
  register: UseFormRegister<ProductFormValues>;
}

export const FeaturedSwitch: React.FC<FeaturedSwitchProps> = ({ register }) => {
  return (
    <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Featured Product
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Highlight on homepage featured showcase
          </span>
        </div>
      </div>

      <label className="relative inline-block w-11 h-6 transition duration-200 ease-in-out cursor-pointer select-none">
        <input
          type="checkbox"
          {...register('isFeatured')}
          className="opacity-0 w-0 h-0 peer"
        />
        <span className="absolute inset-0 rounded-full bg-slate-300 dark:bg-slate-700 peer-checked:bg-amber-500 transition-colors duration-200" />
        <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 transform peer-checked:translate-x-5" />
      </label>
    </div>
  );
};

export default FeaturedSwitch;

