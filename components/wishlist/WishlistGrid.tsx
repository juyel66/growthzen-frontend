'use client';

import React from 'react';
import { WishlistItem } from '@/types/wishlist';
import WishlistCard from './WishlistCard';

interface WishlistGridProps {
  items: WishlistItem[];
  autoRemoveOnAddToCart?: boolean;
  className?: string;
}

export const WishlistGrid: React.FC<WishlistGridProps> = ({
  items,
  autoRemoveOnAddToCart = true,
  className = '',
}) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}
    >
      {items.map((item) => (
        <WishlistCard
          key={item.id}
          item={item}
          autoRemoveOnAddToCart={autoRemoveOnAddToCart}
        />
      ))}
    </div>
  );
};

export default WishlistGrid;
