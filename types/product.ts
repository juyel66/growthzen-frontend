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

// Helper utility functions for safe fallback values
export function getProductTitle(product: Product): string {
  return product.title || product.name || 'Untitled Product';
}

export function getProductCategoryName(product: Product): string {
  if (!product.category) return 'General';
  if (typeof product.category === 'string') return product.category;
  return product.category.name || 'General';
}

export function getProductMainImage(product: Product): string {
  if (product.thumbnailImage) return product.thumbnailImage;
  if (product.images && product.images.length > 0) return product.images[0];
  if (product.productImages && product.productImages.length > 0) return product.productImages[0];
  return '/placeholder-product.png';
}

export function getProductGalleryImages(product: Product): string[] {
  const list: string[] = [];
  if (product.thumbnailImage) list.push(product.thumbnailImage);
  if (product.productImages && Array.isArray(product.productImages)) {
    product.productImages.forEach((img) => {
      if (img && !list.includes(img)) list.push(img);
    });
  }
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((img) => {
      if (img && !list.includes(img)) list.push(img);
    });
  }
  if (list.length === 0) list.push('/placeholder-product.png');
  return list;
}

export function getProductFinalPrice(product: Product): number {
  if (product.finalPrice !== undefined) return product.finalPrice;
  if (product.customerSellPrice !== undefined) return product.customerSellPrice;
  if (product.salePrice !== undefined && product.salePrice !== null) return product.salePrice;
  if (product.price !== undefined) return product.price;
  return 0;
}

export function getProductOriginalPrice(product: Product): number | null {
  if (product.originalPrice !== undefined && product.originalPrice > 0) return product.originalPrice;
  if (product.price !== undefined && product.price > getProductFinalPrice(product)) return product.price;
  return null;
}

export function getProductDiscountAmount(product: Product): number {
  if (product.discountAmount !== undefined && product.discountAmount > 0) return product.discountAmount;
  const orig = getProductOriginalPrice(product);
  const final = getProductFinalPrice(product);
  if (orig && orig > final) return orig - final;
  return 0;
}

