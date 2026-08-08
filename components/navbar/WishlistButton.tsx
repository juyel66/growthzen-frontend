'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useGetWishlistQuery } from '@/services/wishlistApi';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';

export const WishlistButton = () => {
  const theme = useTheme();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Fetch wishlist from RTK Query automatically invalidated on any wishlist action
  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  const count = isAuthenticated ? wishlistData?.items?.length ?? wishlistData?.totalItems ?? 0 : 0;

  return (
    <Link
      href="/wishlist"
      className="relative p-2 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-full transition-all group outline-none flex items-center justify-center cursor-pointer"
      aria-label={`View Wishlist, ${count} items`}
    >
      <Heart
        className="w-5.5 h-5.5 transition-all group-hover:scale-110 text-slate-700 dark:text-slate-200 group-hover:text-rose-500"
        style={{ color: count > 0 ? theme.textColor : undefined }}
      />

      {count > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white bg-rose-500 animate-fade-in shadow-xs"
          style={{
            backgroundColor: theme.primaryColor || undefined,
          }}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
};

export default WishlistButton;

