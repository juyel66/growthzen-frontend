export type ReviewStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

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
  thumbnailImage?: string;
  thumbnail?: string;
  image?: string;
  price?: number;
  slug?: string;
}

export interface ReviewItem {
  id: string;
  productId: string;
  userId?: string;
  orderItemId?: string;
  orderId?: string;
  rating: number;
  comment?: string;
  images?: string[];
  status?: ReviewStatus;
  isVerifiedPurchase?: boolean;
  reviewerName?: string;
  reviewerEmail?: string;
  createdAt: string;
  updatedAt?: string;
  user?: ReviewUser;
  product?: ReviewProduct;
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
  orderItemId: string;
  productId?: string;
  rating: number;
  comment?: string;
  images?: string[];
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
  images?: string[];
  status?: ReviewStatus;
}
