'use client';

import React from 'react';
import SafeImage from '@/components/ui/SafeImage';
import Link from 'next/link';
import { WishlistItem } from '@/types/wishlist';
import {
  getProductTitle,
  getProductCategoryName,
  getProductMainImage,
} from '@/types/product';
import ProductPrice from '@/components/product/ProductPrice';
import { ShoppingCart, Trash2, ExternalLink, Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useRemoveWishlistItemMutation } from '@/services/wishlistApi';
import { useAddToCartMutation } from '@/services/cartApi';
import Swal from 'sweetalert2';

interface WishlistCardProps {
  item: WishlistItem;
  autoRemoveOnAddToCart?: boolean;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({
  item,
  autoRemoveOnAddToCart = true,
}) => {
  const product = item.product;
  const title = getProductTitle(product);
  const categoryName = getProductCategoryName(product);
  const mainImage = getProductMainImage(product);

  const productSlug = product.slug || product.id;
  const productUrl = `/products/${productSlug}`;

  const isOutOfStock = typeof product.quantity === 'number' && product.quantity <= 0;
  const addedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    : null;

  const [removeItem, { isLoading: isRemoving }] = useRemoveWishlistItemMutation();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const handleRemove = async () => {
    if (isRemoving) return;

    try {
      await removeItem(item.id).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Removed from Wishlist',
        text: `${title} removed from your wishlist.`,
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
        text: error?.data?.message || 'Could not remove item from wishlist.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const handleAddToCart = async () => {
    if (isAdding) return;

    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
      }).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'Added to Cart!',
        text: `${title} has been added to your shopping cart.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
      });

      // Configurable auto-remove from wishlist upon adding to cart
      if (autoRemoveOnAddToCart) {
        try {
          await removeItem(item.id).unwrap();
        } catch {
          // Ignore auto-remove failure if cart addition succeeded
        }
      }
    } catch (err: unknown) {
      const error = err as { status?: number; data?: { message?: string } };
      const status = error?.status;
      const message =
        error?.data?.message ||
        (status === 401
          ? 'Please log in to add items to your cart.'
          : 'Failed to add item to cart. Please try again.');

      Swal.fire({
        icon: 'error',
        title: status === 401 ? 'Authentication Required' : 'Cart Action Failed',
        text: message,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Top Image Container */}
      <div className="relative w-full aspect-square bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <Link href={productUrl} className="block w-full h-full">
          <SafeImage
            src={mainImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-108"
          />
        </Link>

        {/* Remove Action Button */}
        <button
          type="button"
          onClick={handleRemove}
          disabled={isRemoving}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 shadow-md flex items-center justify-center transition-all hover:scale-110 cursor-pointer disabled:opacity-50 z-10"
          title="Remove from Wishlist"
          aria-label="Remove item"
        >
          {isRemoving ? (
            <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>

        {/* Stock Badge Overlay */}
        <div className="absolute top-3 left-3 z-10">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 shadow-2xs">
              <XCircle className="w-3 h-3" /> Out of Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 shadow-2xs">
              <CheckCircle className="w-3 h-3" /> In Stock
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col gap-3.5 flex-1 justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
              {categoryName}
            </span>
            {addedDate && (
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {addedDate}
              </span>
            )}
          </div>

          {/* Product Name Navigation using /products/[slug] */}
          <Link href={productUrl} className="group/title">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base line-clamp-2 leading-snug group-hover/title:text-emerald-600 dark:group-hover/title:text-emerald-400 transition-colors">
              {title}
            </h3>
          </Link>
        </div>

        {/* Price & Actions Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
          <ProductPrice product={product} size="md" />

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding || isOutOfStock}
              className="h-10 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              {isAdding ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ShoppingCart className="w-3.5 h-3.5" />
              )}
              <span>{isAdding ? 'Adding...' : 'Add To Cart'}</span>
            </button>

            <Link href={productUrl} className="w-full">
              <button
                type="button"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Product
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;

