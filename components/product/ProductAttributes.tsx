'use client';

import React from 'react';
import { ProductAttribute } from '@/types/product';
import { Layers } from 'lucide-react';

interface ProductAttributesProps {
  attributes?: ProductAttribute[];
}

export const ProductAttributes: React.FC<ProductAttributesProps> = ({ attributes }) => {
  if (!attributes || !Array.isArray(attributes) || attributes.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 py-4 border-t border-b border-slate-200 dark:border-slate-800 my-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
        <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        Product Specifications
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {attributes.map((attr, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80"
          >
            <span className="font-medium text-slate-500 dark:text-slate-400 capitalize">
              {attr.name}
            </span>
            <div className="flex flex-wrap justify-end gap-1.5">
              {Array.isArray(attr.values) && attr.values.length > 0 ? (
                attr.values.map((val, vIdx) => (
                  <span
                    key={vIdx}
                    className="font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-xs shadow-2xs"
                  >
                    {val}
                  </span>
                ))
              ) : (
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  N/A
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductAttributes;

