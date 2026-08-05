export type CouponDiscountType = 'PERCENTAGE' | 'FIXED' | 'percentage' | 'fixed';
export type CouponScopeType =
  | 'ENTIRE_ORDER'
  | 'SPECIFIC_PRODUCT'
  | 'SPECIFIC_CATEGORY'
  | 'category'
  | 'global';

export type CouponStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'LIMIT REACHED';

export interface Coupon {
  id: string;
  code: string;
  name?: string;
  description?: string | null;
  discountType: CouponDiscountType;
  discountValue: number;
  scope?: CouponScopeType;
  productIds?: string[];
  categories?: string[];
  categoryName?: string;
  startsAt?: string;
  expiresAt?: string;
  expiryDate?: string;
  maximumUsage?: number | null;
  perUserUsageLimit?: number | null;
  minimumOrderAmount?: number | null;
  minOrderValue?: number;
  maximumDiscount?: number | null;
  maxDiscount?: number;
  discountAmount?: number;
  isActive: boolean;
  status?: CouponStatus;
  usageCount?: number;
  _count?: { usages: number };
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface CreateCouponInput {
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  scope: 'ENTIRE_ORDER' | 'SPECIFIC_PRODUCT' | 'SPECIFIC_CATEGORY';
  productIds?: string[];
  categories?: string[];
  startsAt: string;
  expiresAt: string;
  maximumUsage?: number | null;
  perUserUsageLimit?: number | null;
  minimumOrderAmount?: number | null;
  maximumDiscount?: number | null;
  isActive?: boolean;
}

export type UpdateCouponInput = Partial<CreateCouponInput>;

export interface ApplyCouponInput {
  code: string;
}

export interface ApplyCouponResponse {
  success?: boolean;
  valid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  message?: string;
}

export interface RemoveCouponResponse {
  success: boolean;
  message?: string;
}

export const getCouponStatus = (coupon: Coupon): CouponStatus => {
  if (coupon.status) return coupon.status;
  if (!coupon.isActive) return 'INACTIVE';
  const now = new Date();
  const expiresAt = coupon.expiresAt || coupon.expiryDate;
  if (expiresAt && new Date(expiresAt) < now) return 'EXPIRED';
  const startsAt = coupon.startsAt;
  if (startsAt && new Date(startsAt) > now) return 'INACTIVE';
  const usageCount = coupon.usageCount ?? coupon._count?.usages ?? 0;
  if (
    coupon.maximumUsage !== undefined &&
    coupon.maximumUsage !== null &&
    usageCount >= coupon.maximumUsage
  ) {
    return 'LIMIT REACHED';
  }
  return 'ACTIVE';
};
