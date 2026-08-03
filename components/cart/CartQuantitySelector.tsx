'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Minus, Loader2 } from 'lucide-react';
import { useUpdateCartItemMutation } from '@/services/cartApi';
import Swal from 'sweetalert2';

interface CartQuantitySelectorProps {
  itemId: string;
  currentQuantity: number;
  maxQuantity?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CartQuantitySelector: React.FC<CartQuantitySelectorProps> = ({
  itemId,
  currentQuantity,
  maxQuantity,
  size = 'md',
  className = '',
}) => {
  const [quantityInput, setQuantityInput] = useState<string>(String(currentQuantity));
  const [updateCartItem, { isLoading }] = useUpdateCartItemMutation();

  useEffect(() => {
    setQuantityInput(String(currentQuantity));
  }, [currentQuantity]);

  const handleUpdate = async (newQty: number) => {
    if (newQty < 1 || newQty === currentQuantity || isLoading) return;

    if (typeof maxQuantity === 'number' && newQty > maxQuantity) {
      Swal.fire({
        icon: 'warning',
        title: 'Stock Limit Reached',
        text: `Only ${maxQuantity} items available in stock.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
      });
      setQuantityInput(String(currentQuantity));
      return;
    }

    try {
      await updateCartItem({
        itemId,
        body: { quantity: newQty },
      }).unwrap();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error?.data?.message || 'Could not update item quantity.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
      setQuantityInput(String(currentQuantity));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setQuantityInput(val);
  };

  const handleInputBlur = () => {
    const parsed = parseInt(quantityInput, 10);
    if (isNaN(parsed) || parsed < 1) {
      setQuantityInput(String(currentQuantity));
    } else {
      handleUpdate(parsed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const isDecreaseDisabled = currentQuantity <= 1 || isLoading;
  const isIncreaseDisabled = (typeof maxQuantity === 'number' && currentQuantity >= maxQuantity) || isLoading;

  const heightClasses =
    size === 'sm' ? 'h-8 text-xs' : size === 'lg' ? 'h-11 text-sm' : 'h-9 text-xs';
  const buttonWidth = size === 'sm' ? 'w-7' : size === 'lg' ? 'w-10' : 'w-8';
  const inputWidth = size === 'sm' ? 'w-9' : size === 'lg' ? 'w-12' : 'w-10';

  return (
    <div
      className={`inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5 shadow-2xs ${heightClasses} ${className}`}
    >
      <button
        type="button"
        disabled={isDecreaseDisabled}
        onClick={() => handleUpdate(currentQuantity - 1)}
        className={`${buttonWidth} h-full rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer`}
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <div className={`relative ${inputWidth} flex items-center justify-center`}>
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600 dark:text-emerald-400" />
        ) : (
          <input
            type="text"
            value={quantityInput}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="w-full text-center font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none"
            aria-label="Cart quantity"
          />
        )}
      </div>

      <button
        type="button"
        disabled={isIncreaseDisabled}
        onClick={() => handleUpdate(currentQuantity + 1)}
        className={`${buttonWidth} h-full rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer`}
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default CartQuantitySelector;
