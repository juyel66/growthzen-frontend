export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentMethod =
  | 'COD'
  | 'BKASH'
  | 'NAGAD'
  | 'SSLCOMMERZ'
  | 'STRIPE'
  | 'PAYPAL';

export interface PaymentView {
  id: string;
  orderId: string;
  orderNumber: string;
  method: PaymentMethod | string;
  status: PaymentStatus | string;
  senderNumber?: string | null;
  transactionId?: string | null;
  paidAmount?: number | null;
  paymentScreenshot?: string | null;
  rejectionReason?: string | null;
  refundReason?: string | null;
  totalAmount: number;
  verifiedAt?: string | Date | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaymentListResponse {
  items: PaymentView[];
  meta: PaymentListMeta;
}

export interface PaymentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  method?: PaymentMethod | string;
  status?: PaymentStatus | string;
}
