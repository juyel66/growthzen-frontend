'use client';

import React from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { useClearCartMutation } from '@/services/cartApi';
import Swal from 'sweetalert2';

interface ClearCartDialogProps {
  itemCount: number;
}

export const ClearCartDialog: React.FC<ClearCartDialogProps> = ({ itemCount }) => {
  const [clearCart, { isLoading }] = useClearCartMutation();

  const handleClearCart = () => {
    if (itemCount === 0 || isLoading) return;

    Swal.fire({
      icon: 'warning',
      title: 'Clear Entire Shopping Cart?',
      text: `Are you sure you want to remove all ${itemCount} items from your shopping cart?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Clear Cart',
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
          await clearCart().unwrap();
          Swal.fire({
            icon: 'success',
            title: 'Cart Cleared',
            text: 'Your shopping cart has been cleared successfully.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2500,
          });
        } catch (err: unknown) {
          const error = err as { data?: { message?: string } };
          Swal.fire({
            icon: 'error',
            title: 'Failed to Clear Cart',
            text: error?.data?.message || 'An error occurred while clearing your cart.',
          });
        }
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClearCart}
      disabled={itemCount === 0 || isLoading}
      className="px-4 py-2.5 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
      <span>Clear Cart</span>
    </button>
  );
};

export default ClearCartDialog;

