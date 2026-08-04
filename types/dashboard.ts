export type DashboardRangeKey =
  | 'TODAY'
  | 'YESTERDAY'
  | 'LAST_7_DAYS'
  | 'LAST_30_DAYS'
  | 'MONTHLY'
  | 'YEARLY'
  | 'CUSTOM';

export interface DashboardRangeWindow {
  range: DashboardRangeKey;
  from: string;
  to: string;
  label: string;
}

export interface DashboardRevenueAnalytics {
  range?: DashboardRangeWindow;
  totalRevenue: number;
  todayRevenue: number;
  yesterdayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  selectedRevenue: number;
}

export interface DashboardOrderStatusStat {
  status: string;
  totalOrders: number;
}

export interface DashboardOrderMonthStat {
  month: string;
  totalOrders: number;
}

export interface DashboardOrderPaymentMethodStat {
  method: string;
  totalOrders: number;
}

export interface DashboardOrderShippingMethodStat {
  shippingMethod: string;
  totalOrders: number;
}

export interface DashboardOrderAnalytics {
  range?: DashboardRangeWindow;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  packedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  returnedOrders: number;
  ordersByStatus: DashboardOrderStatusStat[];
  ordersByMonth: DashboardOrderMonthStat[];
  ordersByPaymentMethod: DashboardOrderPaymentMethodStat[];
  ordersByShippingMethod: DashboardOrderShippingMethodStat[];
}

export interface DashboardProductSummary {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  featuredProducts: number;
}

export interface DashboardCustomerGrowthChartPoint {
  label: string;
  totalCustomers: number;
}

export interface DashboardCustomerAnalytics {
  range?: DashboardRangeWindow;
  totalCustomers: number;
  todayCustomers: number;
  weeklyCustomers: number;
  monthlyCustomers: number;
  yearlyCustomers: number;
  growthChart: DashboardCustomerGrowthChartPoint[];
}

export interface DashboardPaymentStatusStat {
  status: string;
  totalPayments: number;
}

export interface DashboardPaymentMethodStat {
  method: string;
  totalPayments: number;
}

export interface DashboardPaymentAnalytics {
  range?: DashboardRangeWindow;
  totalPayments: number;
  pendingPayments: number;
  paidPayments: number;
  failedPayments: number;
  cancelledPayments: number;
  refundedPayments: number;
  paymentsByStatus: DashboardPaymentStatusStat[];
  paymentsByMethod: DashboardPaymentMethodStat[];
}

export interface DashboardCouponSummary {
  totalCoupons: number;
}

export interface DashboardShippingSummary {
  totalShippingMethods: number;
  activeShippingMethods: number;
  inactiveShippingMethods: number;
}

export interface DashboardOverview {
  generatedAt: string;
  revenue: DashboardRevenueAnalytics;
  orders: DashboardOrderAnalytics;
  products: DashboardProductSummary;
  customers: DashboardCustomerAnalytics;
  payments: DashboardPaymentAnalytics;
  coupons: DashboardCouponSummary;
  shipping: DashboardShippingSummary;
}

export interface DashboardRevenueChartPoint {
  label: string;
  revenue: number;
}

export interface DashboardOrdersChartPoint {
  label: string;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  packedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  returnedOrders: number;
}

export interface DashboardPaymentChartPoint {
  label: string;
  totalPayments: number;
  pendingPayments: number;
  paidPayments: number;
  failedPayments: number;
  cancelledPayments: number;
  refundedPayments: number;
}

export interface DashboardCharts {
  range?: DashboardRangeWindow;
  revenueChart: DashboardRevenueChartPoint[];
  ordersChart: DashboardOrdersChartPoint[];
  paymentChart: DashboardPaymentChartPoint[];
  customerGrowthChart: DashboardCustomerGrowthChartPoint[];
}

export interface DashboardRecentOrderItem {
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  paymentMethod: string | null;
  paymentStatus: string | null;
  orderStatus: string;
  createdAt: string;
}

export interface DashboardRecentCustomerItem {
  name: string;
  email: string;
  registrationDate: string;
}

export interface DashboardTopSellingProductItem {
  productId: string;
  productName: string;
  slug: string;
  thumbnailImage: string;
  soldQuantity: number;
  revenue: number;
}

export interface DashboardRecentPaymentItem {
  customer: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  date: string;
}

export interface DashboardRecent {
  recentOrders: DashboardRecentOrderItem[];
  recentCustomers: DashboardRecentCustomerItem[];
  topSellingProducts: DashboardTopSellingProductItem[];
  recentPayments: DashboardRecentPaymentItem[];
}

export interface DashboardQueryParams {
  range?: DashboardRangeKey;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'totalAmount' | 'soldQuantity' | 'revenue';
  sortOrder?: 'asc' | 'desc';
}
