'use client';

import React from 'react';
import SafeImage from '@/components/ui/SafeImage';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types/cart';
import {
  getProductTitle,
  getProductCategoryName,
  getProductMainImage,
  getProductDisplayPrice,
} from '@/types/product';
import CartQuantitySelector from './CartQuantitySelector';
import { Trash2, Heart, Loader2 } from 'lucide-react';
import { useRemoveCartItemMutation } from '@/services/cartApi';
import { useAddToWishlistMutation } from '@/services/wishlistApi';
import Swal from 'sweetalert2';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const product = item.product;
  const title = getProductTitle(product);
  const categoryName = getProductCategoryName(product);
  const mainImage = getProductMainImage(product);

  const productSlug = product?.slug || product?.id;
  const productUrl = `/products/${productSlug}`;

  const unitPrice = item.unitPrice ?? item.price ?? (product ? getProductDisplayPrice(product) : 0);
  const unitDiscount = item.unitDiscount ?? 0;
  const lineTotal = item.lineTotal ?? item.lineSubtotal ?? unitPrice * item.quantity;

  const [removeCartItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();
  const [addToWishlist, { isLoading: isWishlisting }] = useAddToWishlistMutation();

  const handleRemove = async () => {
    if (isRemoving) return;

    try {
      await removeCartItem(item.id).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Removed from Cart',
        text: `${title} removed from your cart.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      Swal.fire({
        icon: 'error',
        title: 'Remove Failed',
        text: error?.data?.message || 'Could not remove item from cart.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const handleMoveToWishlist = async () => {
    if (isWishlisting || isRemoving || !product?.id) return;

    try {
      await addToWishlist({ productId: product.id }).unwrap();
      await removeCartItem(item.id).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'Moved to Wishlist',
        text: `${title} moved to your saved wishlist.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
      });
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      Swal.fire({
        icon: 'error',
        title: 'Move Failed',
        text: error?.data?.message || 'Could not move item to wishlist.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs hover:shadow-sm transition-all">
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Link
          href={productUrl}
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shrink-0 overflow-hidden group"
        >
          <SafeImage
            src={mainImage}
            alt={title}
            fill
            sizes="100px"
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            {categoryName}
          </span>
          <Link href={productUrl}>
            <h3 className="font-bold text-slate-900 dark:text-white text-base hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-1">
              {title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Unit: ৳{unitPrice.toFixed(2)}</span>
            {unitDiscount > 0 && (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                (Saved ৳{unitDiscount.toFixed(2)})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Actions & Pricing */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
        {/* Quantity Selector */}
        <CartQuantitySelector
          itemId={item.id}
          currentQuantity={item.quantity}
          maxQuantity={product?.quantity}
        />

        {/* Line Total */}
        <div className="flex flex-col items-end min-w-24 text-right">
          <span className="text-xs text-slate-400 font-medium">Subtotal</span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            ৳{lineTotal.toFixed(2)}
          </span>
        </div>

        {/* Actions Menu */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleMoveToWishlist}
            disabled={isWishlisting || isRemoving}
            className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-40"
            title="Move to Wishlist"
            aria-label="Move to Wishlist"
          >
            {isWishlisting ? (
              <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
            ) : (
              <Heart className="w-4.5 h-4.5" />
            )}
          </button>

          <button
            type="button"
            onClick={handleRemove}
            disabled={isRemoving}
            className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-40"
            title="Remove from Cart"
            aria-label="Remove item"
          >
            {isRemoving ? (
              <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

