'use client';

import React from 'react';
import { Product } from '@/types/product';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductPrice from './ProductPrice';
import ProductActions from './ProductActions';
import ProductAttributes from './ProductAttributes';
import { X } from 'lucide-react';

interface ProductQuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-y-auto p-6 sm:p-8 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gallery */}
          <ProductGallery product={product} />

          {/* Product Summary */}
          <div className="flex flex-col gap-4">
            <ProductInfo product={product} />
            <ProductPrice product={product} size="lg" />
            <ProductAttributes attributes={product.attributes} />
            <ProductActions product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickViewModal;
