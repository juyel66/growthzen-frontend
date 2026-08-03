import { Category } from './category';

export interface ProductAttribute {
  name: string;
  values: string[];
}

export interface ProductCategoryDetails {
  id: string;
  name: string;
  slug: string;
  discountPercentage?: number;
  discountEnabled?: boolean;
}

export interface LatestReviewView {
  id: string;
  reviewerName: string | null;
  rating: number;
  comment: string | null;
  images: string[];
  createdAt: string;
}

export interface Product {
  id: string;
  title?: string;
  name?: string;
  shortDescription?: string;
  description?: string;
  slug?: string;
  productCode?: string;
  barcode?: string | null;
  categoryId?: string | null;
  category?: string | Category | ProductCategoryDetails;
  categoryDetails?: ProductCategoryDetails | null;
  costPrice?: number;
  customerSellPrice?: number;
  price?: number;
  originalPrice?: number;
  categoryDiscount?: number;
  discountAmount?: number;
  finalPrice?: number;
  resellerPrice?: number;
  salePrice?: number | null;
  discountType?: string | null;
  discountValue?: number | null;
  taxRate?: number | null;
  couponCode?: string | null;
  attributes?: ProductAttribute[];
  enableSize?: boolean;
  availableSizes?: string[];
  thumbnailImage?: string;
  images?: string[];
  productImages?: string[];
  productVideos?: string[];
  status?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  averageRating?: number;
  ratingsAverage?: number;
  reviewCount?: number;
  ratingsCount?: number;
  ratingBreakdown?: Record<1 | 2 | 3 | 4 | 5, number>;
  latestReviews?: LatestReviewView[];
  sku?: string;
  quantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
}

/**
 * Resolves image path strings into absolute URLs.
 * Handles relative backend upload paths (/uploads/...), Cloudinary URLs, data URIs, and blob URLs.
 */
export function formatImageUrl(url: string | null | undefined, fallback: string = '/placeholder-product.png'): string {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();

  if (
    !trimmed ||
    trimmed === 'undefined' ||
    trimmed === 'null' ||
    trimmed === '[object Object]'
  ) {
    return fallback;
  }

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const backendBase = rawApiUrl.replace(/\/api\/?$/i, '').replace(/\/+$/, '');
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${backendBase}${cleanPath}`;
}

// Helper utility functions for safe fallback values
export function getProductTitle(product: Product): string {
  return product.title || product.name || 'Untitled Product';
}

export function getProductCategoryName(product: Product): string {
  if (!product.category) return 'General';
  if (typeof product.category === 'string') return product.category;
  return product.category.name || 'General';
}

export function getProductMainImage(product: Product, fallback: string = '/placeholder-product.png'): string {
  if (!product) return fallback;
  if (product.thumbnailImage && typeof product.thumbnailImage === 'string' && product.thumbnailImage.trim()) {
    const formatted = formatImageUrl(product.thumbnailImage, fallback);
    if (formatted !== fallback) return formatted;
  }
  if (Array.isArray(product.productImages) && product.productImages.length > 0) {
    const valid = product.productImages.find((img) => img && typeof img === 'string' && img.trim() && img !== 'undefined' && img !== 'null');
    if (valid) {
      const formatted = formatImageUrl(valid, fallback);
      if (formatted !== fallback) return formatted;
    }
  }
  if (Array.isArray(product.images) && product.images.length > 0) {
    const valid = product.images.find((img) => img && typeof img === 'string' && img.trim() && img !== 'undefined' && img !== 'null');
    if (valid) {
      const formatted = formatImageUrl(valid, fallback);
      if (formatted !== fallback) return formatted;
    }
  }
  return fallback;
}

export function getProductGalleryImages(product: Product, fallback: string = '/placeholder-product.png'): string[] {
  if (!product) return [fallback];
  const list: string[] = [];

  if (product.thumbnailImage && typeof product.thumbnailImage === 'string' && product.thumbnailImage.trim()) {
    const formatted = formatImageUrl(product.thumbnailImage, fallback);
    if (formatted !== fallback) list.push(formatted);
  }

  const arrays = [product.productImages, product.images];
  arrays.forEach((arr) => {
    if (Array.isArray(arr)) {
      arr.forEach((img) => {
        if (img && typeof img === 'string' && img.trim() && img !== 'undefined' && img !== 'null') {
          const formatted = formatImageUrl(img, fallback);
          if (formatted !== fallback && !list.includes(formatted)) {
            list.push(formatted);
          }
        }
      });
    }
  });

  if (list.length === 0) list.push(fallback);
  return list;
}

export function getProductFinalPrice(product: Product): number {
  if (product.finalPrice !== undefined && product.finalPrice !== null) return Number(product.finalPrice);
  if (product.customerSellPrice !== undefined && product.customerSellPrice !== null) return Number(product.customerSellPrice);
  if (product.salePrice !== undefined && product.salePrice !== null) return Number(product.salePrice);
  if (product.price !== undefined && product.price !== null) return Number(product.price);
  return 0;
}

export function getProductOriginalPrice(product: Product): number {
  if (product.originalPrice !== undefined && product.originalPrice !== null) return Number(product.originalPrice);
  if (product.customerSellPrice !== undefined && product.customerSellPrice !== null) return Number(product.customerSellPrice);
  if (product.price !== undefined && product.price !== null) return Number(product.price);
  return getProductFinalPrice(product);
}

export function getProductDiscountAmount(product: Product): number {
  if (product.discountAmount !== undefined && product.discountAmount !== null) return Number(product.discountAmount);
  return 0;
}

