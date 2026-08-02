'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Product,
  getProductTitle,
  getProductCategoryName,
  getProductMainImage,
} from '@/types/product';
import ProductPrice from './ProductPrice';
import ProductQuickViewModal from './ProductQuickViewModal';
import { Star, Heart, Eye, ShoppingCart, Sparkles, Loader2 } from 'lucide-react';
import { useAddToCartMutation } from '@/services/cartApi';
import Swal from 'sweetalert2';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const title = getProductTitle(product);
  const categoryName = getProductCategoryName(product);
  const mainImage = getProductMainImage(product);
  const averageRating = product.averageRating ?? product.ratingsAverage ?? 0;
  const reviewCount = product.reviewCount ?? product.ratingsCount ?? 0;

  // SEO-friendly slug navigation path
  const productSlug = product.slug || product.id;
  const productUrl = `/products/${productSlug}`;

  const handleCardClick = (e: React.MouseEvent) => {
    // Navigate to product details unless clicking an interactive button
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    router.push(productUrl);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    Swal.fire({
      icon: 'success',
      title: nextState ? 'Added to Wishlist' : 'Removed from Wishlist',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding) return;

    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
      }).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'Added to Cart!',
        text: `${title} added to your shopping cart.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
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

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(productUrl);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 cursor-pointer ${className}`}
      >
        {/* Top Image Container */}
        <div className="relative w-full aspect-square bg-slate-50 dark:bg-slate-950 overflow-hidden">
          <Link href={productUrl} className="block w-full h-full">
            <Image
              src={mainImage}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-108"
              unoptimized={mainImage.startsWith('http') && !mainImage.includes('cloudinary') && !mainImage.includes('unsplash')}
            />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {product.isFeatured && (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                <Sparkles className="w-3 h-3 fill-slate-950" /> Featured
              </span>
            )}
          </div>

          {/* Top-Right Action Floating Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            {/* Wishlist Button */}
            <button
              type="button"
              onClick={handleWishlistClick}
              className={`w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                isWishlisted ? 'text-rose-500' : 'text-slate-600 dark:text-slate-300 hover:text-rose-500'
              }`}
              title="Add to Wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Quick View Button */}
            <button
              type="button"
              onClick={handleQuickViewClick}
              className="w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 shadow-md flex items-center justify-center transition-transform hover:scale-110 hover:text-emerald-600 cursor-pointer"
              title="Quick View"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Body Content */}
        <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
          <div className="flex flex-col gap-1.5">
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
                {categoryName}
              </span>
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="text-slate-700 dark:text-slate-300 text-xs">
                  {averageRating > 0 ? averageRating.toFixed(1) : 'New'}
                </span>
                {reviewCount > 0 && (
                  <span className="text-slate-400 text-[11px]">({reviewCount})</span>
                )}
              </div>
            </div>

            {/* Product Title */}
            <Link href={productUrl} className="group/title">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base line-clamp-2 leading-snug group-hover/title:text-emerald-600 dark:group-hover/title:text-emerald-400 transition-colors">
                {title}
              </h3>
            </Link>
          </div>

          {/* Price & Action Buttons */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
            <ProductPrice product={product} size="md" />

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="h-9 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                {isAdding ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ShoppingCart className="w-3.5 h-3.5" />
                )}
                {isAdding ? 'Adding...' : 'Add To Cart'}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};

export default ProductCard;
