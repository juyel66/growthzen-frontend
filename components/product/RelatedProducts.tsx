'use client';

import React from 'react';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import { Sparkles } from 'lucide-react';

interface RelatedProductsProps {
  currentProductId?: string;
  categoryName?: string;
}

// Sample placeholder dataset for related products section
const MOCK_RELATED_PRODUCTS: Product[] = [
  {
    id: 'rel-1',
    title: 'Minimalist Ergonomic Desk Lamp',
    slug: 'minimalist-desk-lamp',
    description: 'Smart dimmable LED desk lamp with touch controls and warm tone options.',
    category: 'Electronics',
    customerSellPrice: 59.99,
    originalPrice: 79.99,
    discountAmount: 20.0,
    finalPrice: 59.99,
    thumbnailImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop',
    averageRating: 4.8,
    reviewCount: 34,
    isFeatured: true,
    status: 'ACTIVE',
    enableSize: false,
  },
  {
    id: 'rel-2',
    title: 'Premium Wireless Noise-Canceling Headphones',
    slug: 'wireless-headphones',
    description: 'High fidelity audio with active noise cancellation and 40-hour battery life.',
    category: 'Electronics',
    customerSellPrice: 199.00,
    originalPrice: 249.00,
    discountAmount: 50.0,
    finalPrice: 199.00,
    thumbnailImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
    averageRating: 4.9,
    reviewCount: 128,
    isFeatured: true,
    status: 'ACTIVE',
    enableSize: false,
  },
  {
    id: 'rel-3',
    title: 'Breathable Cotton Modern Hoodie',
    slug: 'cotton-modern-hoodie',
    description: '100% organic cotton hoodie crafted for everyday comfort and warmth.',
    category: 'Fashion',
    customerSellPrice: 45.50,
    originalPrice: 45.50,
    discountAmount: 0,
    finalPrice: 45.50,
    thumbnailImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop',
    averageRating: 4.6,
    reviewCount: 42,
    isFeatured: false,
    status: 'ACTIVE',
    enableSize: true,
    availableSizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'rel-4',
    title: 'Smart Fitness Tracker Watch',
    slug: 'smart-fitness-tracker',
    description: 'Track heart rate, sleep quality, steps and sports metrics in real time.',
    category: 'Watches',
    customerSellPrice: 89.00,
    originalPrice: 119.00,
    discountAmount: 30.0,
    finalPrice: 89.00,
    thumbnailImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop',
    averageRating: 4.7,
    reviewCount: 89,
    isFeatured: true,
    status: 'ACTIVE',
    enableSize: false,
  },
];

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  categoryName = 'Similar',
}) => {
  const filteredProducts = MOCK_RELATED_PRODUCTS.filter(
    (p) => p.id !== currentProductId
  ).slice(0, 4);

  return (
    <div className="flex flex-col gap-6 py-8 border-t border-slate-200 dark:border-slate-800 my-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            You Might Also Like
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {categoryName} Recommendations
        </span>
      </div>

      {/* Grid listing for related items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
