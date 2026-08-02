'use client';

import React, { useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { ProductFormValues } from '@/lib/validations/product';
import { Maximize2, Plus, X, Check } from 'lucide-react';

interface SizeManagerProps {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
}

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];

export const SizeManager: React.FC<SizeManagerProps> = ({
  register,
  errors,
  watch,
  setValue,
}) => {
  const enableSize = watch('enableSize');
  const availableSizes = watch('availableSizes') || [];
  const [customSizeInput, setCustomSizeInput] = useState('');

  const toggleSize = (size: string) => {
    if (availableSizes.includes(size)) {
      setValue(
        'availableSizes',
        availableSizes.filter((s) => s !== size),
        { shouldValidate: true }
      );
    } else {
      setValue('availableSizes', [...availableSizes, size], { shouldValidate: true });
    }
  };

  const handleAddCustomSize = () => {
    const trimmed = customSizeInput.trim();
    if (trimmed && !availableSizes.includes(trimmed)) {
      setValue('availableSizes', [...availableSizes, trimmed], { shouldValidate: true });
      setCustomSizeInput('');
    }
  };

  return (
    <div className="flex flex-col gap-5 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-200">
          <Maximize2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Product Size Configuration
        </div>

        {/* Enable Size Switch */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Enable Size Options
          </span>
          <div className="relative inline-block w-11 h-6 transition duration-200 ease-in-out">
            <input
              type="checkbox"
              {...register('enableSize')}
              className="opacity-0 w-0 h-0 peer"
            />
            <span className="absolute inset-0 rounded-full bg-slate-300 dark:bg-slate-700 peer-checked:bg-emerald-600 transition-colors duration-200 cursor-pointer" />
            <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 transform peer-checked:translate-x-5" />
          </div>
        </label>
      </div>

      {/* Dynamic Size Content (Hidden completely if enableSize is disabled) */}
      {enableSize && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select preset size tags or add custom dimension sizes for clothing, shoes, bedsheets, etc.
          </p>

          {/* Preset Size Badges */}
          <div className="flex flex-wrap gap-2">
            {PRESET_SIZES.map((size) => {
              const isSelected = availableSizes.includes(size);
              return (
                <button
                  type="button"
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400 bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  {size}
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>
              );
            })}
          </div>

          {/* Custom Size Tag Creator */}
          <div className="flex items-center gap-2 max-w-sm pt-2">
            <input
              type="text"
              value={customSizeInput}
              onChange={(e) => setCustomSizeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomSize();
                }
              }}
              placeholder="Add custom size (e.g. 42 EU, 10 UK, 32x34)..."
              className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={handleAddCustomSize}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          {/* Selected Sizes Summary Tags */}
          {availableSizes.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 mr-1">Selected ({availableSizes.length}):</span>
              {availableSizes.map((size) => (
                <span
                  key={size}
                  className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => toggleSize(size)}
                    className="hover:text-rose-500 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {errors.availableSizes && (
            <span className="text-xs font-semibold text-rose-500">
              {errors.availableSizes.message}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SizeManager;
