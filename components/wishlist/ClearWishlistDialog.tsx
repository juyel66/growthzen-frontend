'use client';

import React from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { useClearWishlistMutation } from '@/services/wishlistApi';
import Swal from 'sweetalert2';

interface ClearWishlistDialogProps {
  itemCount: number;
}

export const ClearWishlistDialog: React.FC<ClearWishlistDialogProps> = ({ itemCount }) => {
  const [clearWishlist, { isLoading }] = useClearWishlistMutation();

  const handleClearWishlist = () => {
    if (itemCount === 0 || isLoading) return;

    Swal.fire({
      icon: 'warning',
      title: 'Clear Entire Wishlist?',
      text: `Are you sure you want to remove all ${itemCount} items from your wishlist? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Clear All',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#e11d48', // rose-600
      cancelButtonColor: '#64748b', // slate-500
      customClass: {
        popup: 'rounded-3xl',
        confirmButton: 'rounded-xl font-bold px-5 py-2.5',
        cancelButton: 'rounded-xl font-bold px-5 py-2.5',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await clearWishlist().unwrap();
          Swal.fire({
            icon: 'success',
            title: 'Wishlist Cleared',
            text: 'Your wishlist has been cleared successfully.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2500,
          });
        } catch (err: unknown) {
          const error = err as { data?: { message?: string } };
          Swal.fire({
            icon: 'error',
            title: 'Failed to Clear Wishlist',
            text: error?.data?.message || 'An error occurred while clearing your wishlist.',
          });
        }
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClearWishlist}
      disabled={itemCount === 0 || isLoading}
      className="px-4 py-2.5 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
      <span>Clear Wishlist</span>
    </button>
  );
};

export default ClearWishlistDialog;
