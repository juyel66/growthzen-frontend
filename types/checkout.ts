import { CartItem } from './cart';
import { ShippingAddress, ShippingZone } from './shipping';
import { Coupon } from './coupon';

export type DeliveryArea = 'INSIDE_DHAKA' | 'OUTSIDE_DHAKA';

export type PaymentMethod = 'COD' | 'BKASH' | 'NAGAD';

export interface CheckoutRequest {
  customerName: string;
  customerPhone: string;
  address: string;
  deliveryArea: DeliveryArea;
  paymentMethod: PaymentMethod;
  shippingMethodId?: string;
  couponCode?: string;
}

export interface CheckoutSummaryQuery {
  deliveryArea?: DeliveryArea;
  shippingMethodId?: string;
}

export interface CheckoutCustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface CheckoutDetails {
  customerInfo: CheckoutCustomerInfo;
  shippingAddress: ShippingAddress;
  shippingZone: ShippingZone;
  shippingFee: number;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  note?: string;
  cartId?: string;
  items?: CartItem[];
}

export interface CheckoutResponseData {
  id?: string;
  orderId?: string;
  orderNumber?: string;
  totalAmount?: number;
  grandTotal?: number;
  subtotal?: number;
  discount?: number;
  shippingFee?: number;
  shippingCharge?: number;
  tax?: number;
  paymentMethod?: string;
  status?: string;
  items?: CartItem[];
  appliedCoupon?: Coupon | null;
  createdAt?: string;
}

export interface CheckoutResponse {
  success: boolean;
  message?: string;
  orderId?: string;
  data?: CheckoutResponseData;
  totalAmount?: number;
}
