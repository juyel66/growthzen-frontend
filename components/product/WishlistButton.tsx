'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Loader2 } from 'lucide-react';
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveWishlistItemMutation,
} from '@/services/wishlistApi';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { useProtectedAction } from '@/hooks/useProtectedAction';
import Swal from 'sweetalert2';

interface WishlistButtonProps {
  productId: string;
  productTitle?: string;
  variant?: 'icon' | 'button';
  className?: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  productTitle = 'Product',
  variant = 'icon',
  className = '',
}) => {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { executeProtectedAction, usePendingActionEffect } = useProtectedAction();

  // Fetch wishlist state from RTK Query cache
  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveWishlistItemMutation();

  const isLoading = isAdding || isRemoving;

  // Find if this product is in the user's wishlist
  const wishlistItem = wishlistData?.items?.find(
    (item) => item.product?.id === productId || (item as unknown as { productId?: string }).productId === productId
  );
  const isWishlisted = Boolean(wishlistItem);

  // Restore pending wishlist action post-login
  usePendingActionEffect(productId, async (pendingPayload) => {
    if (pendingPayload.action === 'wishlist') {
      try {
        await addToWishlist({ productId }).unwrap();
        Swal.fire({
          icon: 'success',
          title: 'Added to Wishlist!',
          text: `${productTitle} added to your wishlist.`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
        });
      } catch {
        // Fallback error handling
      }
    }
  });

  const performToggle = async () => {
    if (isLoading) return;

    try {
      if (isWishlisted && wishlistItem) {
        // DELETE /wishlist/{itemId}
        await removeFromWishlist(wishlistItem.id).unwrap();
        Swal.fire({
          icon: 'success',
          title: 'Removed from Wishlist',
          text: `${productTitle} removed from your wishlist.`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        // POST /wishlist
        await addToWishlist({ productId }).unwrap();
        Swal.fire({
          icon: 'success',
          title: 'Added to Wishlist!',
          text: `${productTitle} added to your wishlist.`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (err: unknown) {
      const error = err as { status?: number; data?: { message?: string } };
      const status = error?.status;
      const message =
        error?.data?.message ||
        (status === 401
          ? 'Please log in to manage your wishlist.'
          : 'Failed to update wishlist. Please try again.');

      if (status === 401) {
        Swal.fire({
          icon: 'info',
          title: 'Session Expired',
          text: 'Please log in again to continue.',
          confirmButtonText: 'Log In',
        }).then(() => router.push('/auth/login'));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Wishlist Action Failed',
          text: message,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
      }
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    executeProtectedAction(
      {
        action: 'wishlist',
        productId,
      },
      performToggle
    );
  };

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        className={`h-11 px-5 rounded-2xl border transition-all cursor-pointer font-bold text-xs flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs active:scale-95 disabled:opacity-60 ${
          isWishlisted
            ? 'border-rose-200 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300'
        } ${className}`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
        ) : (
          <Heart
            className={`w-4 h-4 transition-transform group-hover:scale-110 ${
              isWishlisted
                ? 'fill-rose-500 text-rose-500 scale-110 animate-pop'
                : 'text-slate-400 group-hover:text-rose-500'
            }`}
          />
        )}
        <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      className={`w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md flex items-center justify-center transition-all hover:scale-110 cursor-pointer disabled:opacity-60 ${
        isWishlisted ? 'text-rose-500' : 'text-slate-600 dark:text-slate-300 hover:text-rose-500'
      } ${className}`}
      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
      ) : (
        <Heart
          className={`w-4 h-4 transition-all ${
            isWishlisted ? 'fill-rose-500 text-rose-500 scale-110' : ''
          }`}
        />
      )}
    </button>
  );
};

export default WishlistButton;

