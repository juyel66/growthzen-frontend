'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ProductError: React.FC<ProductErrorProps> = ({
  title = 'Failed to Load Products',
  message = 'An error occurred while communicating with the server. Please try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-3xl my-8 max-w-lg mx-auto">
      <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">{message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry} className="cursor-pointer">
          <RefreshCw className="w-4 h-4 mr-2" /> Try Again
        </Button>
      )}
    </div>
  );
};

export default ProductError;
