export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

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

export type DeliveryArea = 'INSIDE_DHAKA' | 'OUTSIDE_DHAKA';

export interface OrderItemView {
  id: string;
  productId: string;
  productCode?: string;
  quantity: number;
  size?: string | null;
  unitPrice: number;
  totalPrice: number;
  canReview?: boolean;
  reviewed?: boolean;
  reviewId?: string | null;
  product?: {
    id: string;
    title?: string;
    name?: string;
    thumbnailImage?: string;
    images?: string[];
  };
}

export interface OrderPaymentInfo {
  id: string;
  method: PaymentMethod | string;
  status: PaymentStatus | string;
  transactionId?: string | null;
  paidAmount?: number | null;
}

export interface OrderView {
  id: string;
  orderCode: string;
  userId?: string | null;
  userEmail?: string | null;
  orderedByRole?: string | null;
  orderRole?: string | null;
  customerEmail?: string | null;
  customerName: string;
  customerPhone: string;
  guestName?: string | null;
  guestPhone?: string | null;
  guestEmail?: string | null;
  guestAddress?: string | null;
  guestDivision?: string | null;
  guestDistrict?: string | null;
  guestUpazila?: string | null;
  address: string;
  deliveryArea: DeliveryArea | string;
  shippingType?: string | null;
  orderNotes?: string | null;
  paymentMethod: PaymentMethod | string;
  payment?: OrderPaymentInfo | null;
  subtotal: number;
  discountAmount: number;
  deliveryCharge: number;
  payableAmount: number;
  couponCode?: string | null;
  status: OrderStatus;
  items: OrderItemView[];
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string | null;
  cancelledAt?: string | null;
  deliveredAt?: string | null;
  adminNote?: string | null;
  courierServiceCost?: number | null;
  courierCost?: number | null;
  deliveryProfit?: number | null;
  courierProfit?: number | null;
  productCost?: number | null;
  grossSales?: number | null;
  netProfit?: number | null;
  customerPaid?: number | null;
  productSelling?: number | null;
  couponDiscount?: number | null;
  categoryDiscount?: number | null;
  courierChargeCollected?: number | null;
}

export interface OrderListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrderListResponse {
  items: OrderView[];
  meta: OrderListMeta;
}

export type DateRangeFilterOption =
  | 'ALL'
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_30_days'
  | 'this_month'
  | 'last_month'
  | 'this_year'
  | 'custom';

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus | string;
  dateRange?: DateRangeFilterOption | string;
  startDate?: string;
  endDate?: string;
}

export interface OrderSummaryData {
  totalSales?: number | null;
  grossSales?: number | null;
  totalRevenue?: number | null;
  totalProductCost?: number | null;
  productCost?: number | null;
  totalCourierCost?: number | null;
  courierCost?: number | null;
  courierServiceCost?: number | null;
  totalNetProfit?: number | null;
  netProfit?: number | null;
  totalOrders?: number | null;
}

/**
 * Utility helper to determine if payment is collected
 */
export const isPaymentCollected = (order: OrderView | null | undefined): boolean => {
  if (!order) return false;
  if (order.payment?.status === 'PAID') return true;
  return false;
};
