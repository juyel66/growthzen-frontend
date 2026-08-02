'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useGetWishlistQuery } from '@/services/wishlistApi';

export const WishlistButton = () => {
  const theme = useTheme();
  
  // Connect API trigger, skip active fetch for now, fall back to dummy/local count
  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: true, // skipped for now to avoid mock error logs, easily toggle to connect
  });

  const count = wishlistData?.items?.length ?? 3; // Static badge placeholder for demo

  return (
    <Link
      href="/wishlist"
      className="relative p-2 hover:bg-slate-100/80 rounded-full transition-all group outline-none flex items-center justify-center cursor-pointer"
      aria-label={`View Wishlist, ${count} items`}
    >
      <Heart
        className="w-5.5 h-5.5 transition-all group-hover:scale-105"
        style={{ color: theme.textColor }}
      />
      {count > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white animate-fade-in"
          style={{
            backgroundColor: theme.primaryColor,
          }}
        >
          {count}
        </span>
      )}
    </Link>
  );
};
export default WishlistButton;
