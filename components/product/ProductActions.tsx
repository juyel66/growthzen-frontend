'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { ShoppingCart, Zap, Heart, Share2, Plus, Minus, Check, Loader2 } from 'lucide-react';
import { useAddToCartMutation } from '@/services/cartApi';
import Swal from 'sweetalert2';

interface ProductActionsProps {
  product: Product;
}

export const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const theme = useTheme();
  const router = useRouter();

  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.enableSize && product.availableSizes && product.availableSizes.length > 0
      ? product.availableSizes[0]
      : null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  const showSizes = Boolean(product.enableSize && product.availableSizes && product.availableSizes.length > 0);
  const productSlug = product.slug || product.id;
  const productUrl = `/products/${productSlug}`;

  const handleAddToCart = async () => {
    if (isAdding) return;

    try {
      await addToCart({
        productId: product.id,
        quantity,
      }).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'Added to Cart!',
        text: `${product.title || product.name || 'Product'} (Qty: ${quantity}${selectedSize ? `, Size: ${selectedSize}` : ''}) added to your shopping cart.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (error: any) {
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

  const handleBuyNow = () => {
    router.push(productUrl);
  };

  const handleToggleWishlist = () => {
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    Swal.fire({
      icon: 'success',
      title: nextState ? 'Added to Wishlist' : 'Removed from Wishlist',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
    });
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

      {/* Action Buttons using reusable Button */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={handleAddToCart}
          isLoading={isAdding}
          disabled={isAdding}
          className="flex-1 cursor-pointer font-bold shadow-md hover:shadow-lg transition-all"
        >
          {!isAdding && <ShoppingCart className="w-5 h-5 mr-2" />}
          {isAdding ? 'Adding To Cart...' : 'Add To Cart'}
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={handleBuyNow}
          className="flex-1 cursor-pointer font-bold shadow-sm"
        >
          <Zap className="w-5 h-5 mr-2" /> Buy Now
        </Button>
      </div>

      {/* Secondary Actions: Wishlist & Share */}
      <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="outline"
          size="default"
          onClick={handleToggleWishlist}
          className={`flex-1 cursor-pointer ${
            isWishlisted ? 'text-rose-500 border-rose-200 dark:border-rose-900 bg-rose-50/50' : ''
          }`}
        >
          <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
        </Button>

        <Button
          variant="ghost"
          size="default"
          onClick={handleShare}
          className="cursor-pointer text-slate-600 dark:text-slate-400"
        >
          <Share2 className="w-4 h-4 mr-2" /> Share Product
        </Button>
      </div>
    </div>
  );
};

export default ProductActions;
