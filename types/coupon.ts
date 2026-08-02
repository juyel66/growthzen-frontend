export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  expiryDate: string;
  isActive: boolean;
}

export interface ApplyCouponResponse {
  valid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  message?: string;
}
