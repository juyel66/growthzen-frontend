'use client';

import React from 'react';
import { useGetCategoriesQuery } from '@/services/categoryApi';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ProductFormValues } from '@/lib/validations/product';
import { Tag, Loader2, AlertCircle } from 'lucide-react';

interface CategorySelectorProps {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  register,
  errors,
  watch,
}) => {
  const { data: categories, isLoading, isError, refetch } = useGetCategoriesQuery();
  const selectedCategoryId = watch('categoryId');

  return (
    <div className="flex flex-col gap-2 p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
        <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        Product Category *
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-2 text-xs text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" /> Loading categories from server...
        </div>
      ) : isError ? (
        <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-600">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> Failed to load categories
          </span>
          <button
            type="button"
            onClick={() => refetch()}
            className="font-bold underline cursor-pointer hover:text-rose-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="relative">
          <select
            {...register('categoryId')}
            className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition cursor-pointer ${
              errors.categoryId
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500'
            }`}
          >
            <option value="">-- Select a Category --</option>
            {Array.isArray(categories) &&
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>
      )}

      {errors.categoryId && (
        <span className="text-xs font-semibold text-rose-500 mt-0.5">
          {errors.categoryId.message}
        </span>
      )}

      {selectedCategoryId && categories && (
        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          Selected Category ID: <code className="bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded font-mono">{selectedCategoryId}</code>
        </span>
      )}
    </div>
  );
};

export default CategorySelector;

