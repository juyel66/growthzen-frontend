export interface PaymentDetails {
  orderId: string;
  paymentMethod: 'stripe' | 'paypal' | 'cod';
  paymentMethodId?: string; // from payment provider integration (Stripe token / card source)
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  status: 'succeeded' | 'pending' | 'failed';
  amount: number;
  message?: string;
}
