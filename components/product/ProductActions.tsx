'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, getProductMainImage, getProductDisplayPrice } from '@/types/product';
import { Button } from '@/components/ui/button';
import WishlistButton from './WishlistButton';
import { ShoppingCart, Zap, Share2, Plus, Minus, Check, Trash2, Loader2 } from 'lucide-react';
import { useAddToCartMutation, useGetCartQuery, useRemoveCartItemMutation } from '@/services/cartApi';
import CartQuantitySelector from '@/components/cart/CartQuantitySelector';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { useProtectedAction, saveBuyNowItem } from '@/hooks/useProtectedAction';
import Swal from 'sweetalert2';

interface ProductActionsProps {
  product: Product;
}

export const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const router = useRouter();
  const { executeProtectedAction, usePendingActionEffect } = useProtectedAction();

  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [removeCartItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: cartData } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const cartItem = cartData?.items?.find(
    (item) => item.productId === product.id || item.product?.id === product.id
  );

  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.enableSize && product.availableSizes && product.availableSizes.length > 0
      ? product.availableSizes[0]
      : null
  );
  const [quantity, setQuantity] = useState<number>(1);

  const showSizes = Boolean(product.enableSize && product.availableSizes && product.availableSizes.length > 0);
  const productSlug = product.slug || product.id;

  // 1. Auto-restore state & continue action upon returning post-login/register
  usePendingActionEffect(product.id, async (pendingPayload) => {
    const qtyToUse = pendingPayload.quantity || quantity;
    if (pendingPayload.quantity) setQuantity(pendingPayload.quantity);
    if (pendingPayload.selectedSize) setSelectedSize(pendingPayload.selectedSize);

    if (pendingPayload.action === 'buy_now') {
      const unitPrice = getProductDisplayPrice(product);
      saveBuyNowItem({
        productId: product.id,
        title: product.title || product.name || 'Product',
        price: unitPrice,
        image: getProductMainImage(product),
        quantity: qtyToUse,
        selectedSize: pendingPayload.selectedSize ?? selectedSize,
        productCode: product.productCode,
        slug: productSlug,
      });
      router.push('/checkout');
    } else if (pendingPayload.action === 'add_to_cart') {
      try {
        await addToCart({
          productId: product.id,
          quantity: qtyToUse,
        }).unwrap();
        Swal.fire({
          icon: 'success',
          title: 'Added to Cart!',
          text: `${product.title || product.name || 'Product'} added to your cart.`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
      } catch {
        // Fallback error toast handled inside handleAddToCart
      }
    }
  });

  const performAddToCart = async () => {
    if (isAdding) return;

    try {
      await addToCart({
        productId: product.id,
        quantity,
      }).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'Added to Cart!',
        text: `${product.title || product.name || 'Product'} (Qty: ${quantity}${selectedSize ? `, Size: ${ selectedSize }` : ''}) added to your shopping cart.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
  } catch (err: unknown) {
    const error = err as { status?: number; data?: { message?: string } };
    const status = error?.status;
    const errorMessage =
      error?.data?.message ||
      (status === 401
        ? 'Please log in to add items to your cart.'
        : status === 400
          ? 'Unable to add product. Please check product availability.'
          : 'Failed to add item to cart. Please try again.');

    Swal.fire({
      icon: 'error',
      title: status === 401 ? 'Authentication Required' : 'Cart Action Failed',
      text: errorMessage,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3500,
    });
  }
};

const handleRemoveFromCart = async () => {
  if (!cartItem || isRemoving) return;

  try {
    await removeCartItem(cartItem.id).unwrap();
    Swal.fire({
      icon: 'success',
      title: 'Removed from Cart',
      text: `${product.title || product.name || 'Product'} removed from your cart.`,
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
      text: error?.data?.message || 'Failed to remove item from cart.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
    });
  }
};

const handleAddToCart = () => {
  executeProtectedAction(
    {
      action: 'add_to_cart',
      productId: product.id,
      quantity,
      selectedSize,
    },
    performAddToCart
  );
};

const handleBuyNow = async () => {
  const unitPrice = getProductDisplayPrice(product);
  saveBuyNowItem({
    productId: product.id,
    title: product.title || product.name || 'Product',
    price: unitPrice,
    image: getProductMainImage(product),
    quantity,
    selectedSize,
    productCode: product.productCode,
    slug: productSlug,
  });

  if (isAuthenticated) {
    try {
      await addToCart({
        productId: product.id,
        quantity,
      }).unwrap();
    } catch {
      // Continue to checkout with buyNowItem if cart endpoint throws
    }
  }
  router.push('/checkout');
};

const handleShare = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href);
    Swal.fire({
      icon: 'success',
      title: 'Link Copied!',
      text: 'Product link copied to clipboard.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
    });
  }
};

return (
  <div className="flex flex-col gap-6 py-4">
    {/* Dynamic Size Selector (Strictly Hidden if enableSize is false or no sizes exist) */}
    {showSizes && product.availableSizes && (
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Select Size
          </span>
          {selectedSize && (
            <span className="text-xs text-emerald-600 font-semibold dark:text-emerald-400">
              Selected: {selectedSize}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2.5">
          {product.availableSizes.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                type="button"
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`h-10 min-w-12 px-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 bg-white dark:bg-slate-900'
                  }`}
                aria-label={`Select size ${size}`}
              >
                {size}
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      </div>
    )}

    {/* Cart Status & Actions */}
    {cartItem ? (
      <div className="flex flex-col gap-4 p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Item is in your cart
          </span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Current Qty: {cartItem.quantity}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Quantity:</span>
            <CartQuantitySelector
              itemId={cartItem.id}
              currentQuantity={cartItem.quantity}
              maxQuantity={product.quantity}
              size="lg"
            />
          </div>

          <button
            type="button"
            onClick={handleRemoveFromCart}
            disabled={isRemoving}
            className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            {isRemoving ? (
              <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>Remove</span>
          </button>
        </div>
      </div>
    ) : (
      <>
        {/* Quantity Counter */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Quantity</span>
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-bold text-sm text-slate-800 dark:text-slate-100">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
          <Button
            variant="primary"
            size="lg"
            onClick={handleAddToCart}
            isLoading={isAdding}
            disabled={isAdding}
            className="w-full sm:w-auto sm:flex-1 h-12 text-sm sm:text-base font-bold justify-center items-center cursor-pointer shadow-md hover:shadow-lg transition-all whitespace-nowrap"
          >
            {!isAdding && <ShoppingCart className="w-5 h-5 mr-2 shrink-0" />}
            <span>{isAdding ? 'Adding To Cart...' : 'Add To Cart'}</span>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={handleBuyNow}
            className="w-full sm:w-auto sm:flex-1 h-12 text-sm sm:text-base font-bold justify-center items-center cursor-pointer shadow-sm whitespace-nowrap"
          >
            <Zap className="w-5 h-5 mr-2 shrink-0" />
            <span>Buy Now</span>
          </Button>
        </div>
      </>
    )}

    {/* Secondary Actions: Wishlist & Share */}
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 w-full">
      <WishlistButton
        productId={product.id}
        productTitle={product.title || product.name}
        variant="button"
        className="flex-1 min-w-[140px]"
      />

      <Button
        variant="ghost"
        size="default"
        onClick={handleShare}
        className="flex-1 min-w-[140px] cursor-pointer text-slate-600 dark:text-slate-400 justify-center items-center"
      >
        <Share2 className="w-4 h-4 mr-2 shrink-0" /> Share Product
      </Button>
    </div>
  </div>
);
};

export default ProductActions;

