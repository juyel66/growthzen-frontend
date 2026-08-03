export type CouponScope = 'category' | 'global';

export interface Coupon {
  id: string;
  code: string;
  name?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  expiryDate: string;
  scope?: CouponScope;
  categoryName?: string;
  isActive: boolean;
}

export interface ApplyCouponInput {
  code: string;
  cartTotal?: number;
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
