'use client';

import React from 'react';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import EmptyProduct from './EmptyProduct';

interface ProductGridProps {
  products: Product[];
  onResetFilters?: () => void;
  className?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onResetFilters,
  className = '',
}) => {
  if (!products || products.length === 0) {
    return <EmptyProduct onReset={onResetFilters} />;
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 w-full ${className}`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;

