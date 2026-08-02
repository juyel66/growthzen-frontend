import { CartItem } from './cart';
import { ShippingAddress } from './shipping';

export interface CheckoutDetails {
  cartId: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  billingAddressSameAsShipping: boolean;
  billingAddress?: ShippingAddress;
  shippingMethodId: string;
  paymentMethod: 'stripe' | 'paypal' | 'cod';
  couponCode?: string;
}

export interface CheckoutResponse {
  success: boolean;
  orderId: string;
  paymentClientSecret?: string; // Stripe client secret or PayPal order ID
  totalAmount: number;
}
