'use client';

import React from 'react';
import { ShoppingBag, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyProductProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export const EmptyProduct: React.FC<EmptyProductProps> = ({
  title = 'No Products Found',
  description = 'We couldn\'t find any products matching your criteria. Try adjusting your filters or search terms.',
  onReset,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl my-8 shadow-sm max-w-lg mx-auto">
      <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {onReset && (
        <Button variant="outline" onClick={onReset} className="cursor-pointer">
          <RefreshCw className="w-4 h-4 mr-2" /> Reset Filters
        </Button>
      )}
    </div>
  );
};

export default EmptyProduct;

