export type ReviewStatus = 'PENDING' | 'PUBLISHED' | 'HIDDEN' | 'APPROVED' | 'REJECTED';

export interface ReviewUser {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  image?: string;
}

export interface ReviewProduct {
  id?: string;
  title?: string;
  name?: string;
  productCode?: string;
  sku?: string;
  code?: string;
  thumbnailImage?: string;
  thumbnail?: string;
  image?: string;
  images?: string[];
  productImages?: string[];
  price?: number;
  slug?: string;
  status?: string;
}

export interface ReviewItem {
  id: string;
  productId?: string | null;
  productIds?: string[];
  userId?: string;
  orderItemId?: string;
  orderId?: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  status?: ReviewStatus;
  source?: 'PUBLIC' | 'VERIFIED' | string;
  isVerifiedPurchase?: boolean;
  reviewerName?: string;
  reviewerEmail?: string;
  createdAt: string;
  updatedAt?: string;
  user?: ReviewUser;
  product?: ReviewProduct | null;
  products?: ReviewProduct[];
}

export interface ProductRatingDistribution {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface ProductReviewsResponse {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: ProductRatingDistribution;
  reviews: ReviewItem[];
}

export interface ReviewEligibilityResponse {
  canReview: boolean;
  message?: string;
  productId?: string;
  orderItemId?: string;
  productTitle?: string;
  productImage?: string;
  existingReview?: ReviewItem | null;
}

export interface CreateReviewInput {
  orderItemId?: string;
  productId?: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
}

export interface PublicReviewInput {
  productId?: string;
  reviewerName: string;
  reviewerEmail?: string;
  rating: number;
  title?: string;
  comment: string;
}

export interface VerifyReviewTokenResponse {
  valid: boolean;
  message?: string;
  productId?: string;
  productTitle?: string;
  productName?: string;
  productImage?: string;
  productThumbnail?: string;
  product?: ReviewProduct;
  existingReview?: ReviewItem | null;
}

export interface SubmitTokenReviewInput {
  token: string;
  rating: number;
  title?: string;
  comment: string;
}

export interface UpdateReviewInput {
  rating?: number;
  title?: string;
  comment?: string;
  images?: string[];
  status?: ReviewStatus;
  productId?: string | null;
  productIds?: string[];
}

export interface GetAllReviewsParams {
  status?: string;
  search?: string;
  source?: string;
  isVerifiedPurchase?: boolean;
}

