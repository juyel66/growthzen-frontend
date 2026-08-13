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
  customerSpecialPrice?: number | null;
  price?: number;
  originalPrice?: number;
  categoryDiscount?: number;
  discountAmount?: number;
  finalPrice?: number;
  displayPrice?: number;
  resellerPrice?: number;
  resellerSellPrice?: number;
  resellerSpecialPrice?: number | null;
  salePrice?: number | null;
  customerSpecialPriceEnabled?: boolean;
  resellerSpecialPriceEnabled?: boolean;
  specialSaleEnabled?: boolean;
  discountEnabled?: boolean;
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

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const backendBase = rawApiUrl.replace(/\/api\/?$/i, '').replace(/\/+$/, '');
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${backendBase}${cleanPath}`;
}

// Helper utility functions for safe fallback values
export function getProductTitle(product: Product | any): string {
  if (!product) return 'Untitled Product';
  return product.title || product.name || 'Untitled Product';
}

export function getProductCategoryName(product: Product | any): string {
  if (!product || !product.category) return 'General';
  if (typeof product.category === 'string') return product.category;
  return product.category.name || 'General';
}

function extractStringUrl(img: any): string | null {
  if (!img) return null;
  if (typeof img === 'string') {
    const trimmed = img.trim();
    if (trimmed && trimmed !== 'undefined' && trimmed !== 'null' && trimmed !== '[object Object]') {
      return trimmed;
    }
    return null;
  }
  if (typeof img === 'object') {
    const candidate =
      img.url ||
      img.path ||
      img.src ||
      img.imageUrl ||
      img.image ||
      img.secure_url ||
      img.fileUrl ||
      img.thumbnail ||
      img.thumbnailImage;
    if (candidate && typeof candidate === 'string') {
      const trimmed = candidate.trim();
      if (trimmed && trimmed !== 'undefined' && trimmed !== 'null' && trimmed !== '[object Object]') {
        return trimmed;
      }
    }
  }
  return null;
}

export function getProductMainImage(itemOrProduct: any, fallback: string = '/placeholder-product.png'): string {
  if (!itemOrProduct) return fallback;

  if (typeof itemOrProduct === 'string') {
    const formatted = formatImageUrl(itemOrProduct, fallback);
    if (formatted !== fallback) return formatted;
  }

  const target = itemOrProduct.product || itemOrProduct;

  const singleCandidates = [
    target.thumbnailImage,
    target.thumbnail,
    target.image,
    target.imageUrl,
    target.featuredImage,
    target.primaryImage,
    target.productImage,
    itemOrProduct.image,
    itemOrProduct.productImage,
    itemOrProduct.thumbnailImage,
  ];

  for (const candidate of singleCandidates) {
    const urlStr = extractStringUrl(candidate);
    if (urlStr) {
      const formatted = formatImageUrl(urlStr, fallback);
      if (formatted !== fallback) return formatted;
    }
  }

  const arrayCandidates = [
    target.productImages,
    target.images,
    itemOrProduct.images,
    itemOrProduct.productImages,
  ];

  for (const arr of arrayCandidates) {
    if (Array.isArray(arr) && arr.length > 0) {
      const primary = arr.find((img) => img && typeof img === 'object' && (img.isPrimary || img.primary || img.isMain));
      if (primary) {
        const urlStr = extractStringUrl(primary);
        if (urlStr) {
          const formatted = formatImageUrl(urlStr, fallback);
          if (formatted !== fallback) return formatted;
        }
      }

      for (const img of arr) {
        const urlStr = extractStringUrl(img);
        if (urlStr) {
          const formatted = formatImageUrl(urlStr, fallback);
          if (formatted !== fallback) return formatted;
        }
      }
    }
  }

  return fallback;
}

export function getProductGalleryImages(product: any, fallback: string = '/placeholder-product.png'): string[] {
  if (!product) return [fallback];
  const list: string[] = [];

  const main = getProductMainImage(product, fallback);
  if (main !== fallback) list.push(main);

  const target = product.product || product;
  const arrayCandidates = [target.productImages, target.images];

  arrayCandidates.forEach((arr) => {
    if (Array.isArray(arr)) {
      arr.forEach((img) => {
        const urlStr = extractStringUrl(img);
        if (urlStr) {
          const formatted = formatImageUrl(urlStr, fallback);
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

export function getProductDisplayPrice(product: Product, isReseller: boolean = false): number {
  if (product.displayPrice !== undefined && product.displayPrice !== null) return Number(product.displayPrice);
  if (product.finalPrice !== undefined && product.finalPrice !== null) return Number(product.finalPrice);

  if (isReseller) {
    if (product.resellerSpecialPrice !== undefined && product.resellerSpecialPrice !== null && Number(product.resellerSpecialPrice) > 0) {
      return Number(product.resellerSpecialPrice);
    }
    if (product.resellerSellPrice !== undefined && product.resellerSellPrice !== null) return Number(product.resellerSellPrice);
    if (product.resellerPrice !== undefined && product.resellerPrice !== null) return Number(product.resellerPrice);
  } else {
    if (product.customerSpecialPrice !== undefined && product.customerSpecialPrice !== null && Number(product.customerSpecialPrice) > 0) {
      return Number(product.customerSpecialPrice);
    }
    if (product.salePrice !== undefined && product.salePrice !== null && Number(product.salePrice) > 0) {
      return Number(product.salePrice);
    }
    if (product.customerSellPrice !== undefined && product.customerSellPrice !== null) return Number(product.customerSellPrice);
    if (product.price !== undefined && product.price !== null) return Number(product.price);
  }
  return 0;
}

export function getProductFinalPrice(product: Product, isReseller: boolean = false): number {
  return getProductDisplayPrice(product, isReseller);
}

export function getProductOriginalPrice(product: Product, isReseller: boolean = false): number {
  if (isReseller) {
    if (product.resellerSellPrice !== undefined && product.resellerSellPrice !== null) return Number(product.resellerSellPrice);
    if (product.resellerPrice !== undefined && product.resellerPrice !== null) return Number(product.resellerPrice);
    if (product.originalPrice !== undefined && product.originalPrice !== null) return Number(product.originalPrice);
    return getProductDisplayPrice(product, isReseller);
  }
  if (product.customerSellPrice !== undefined && product.customerSellPrice !== null) return Number(product.customerSellPrice);
  if (product.originalPrice !== undefined && product.originalPrice !== null) return Number(product.originalPrice);
  if (product.price !== undefined && product.price !== null) return Number(product.price);
  return getProductDisplayPrice(product, isReseller);
}

export function getProductDiscountAmount(product: Product): number {
  if (product.discountEnabled === false) return 0;
  if (product.discountAmount !== undefined && product.discountAmount !== null) return Number(product.discountAmount);
  return 0;
}

