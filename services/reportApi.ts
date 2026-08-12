import { baseApi } from './baseApi';
import {
  ApiResponse,
  CouponReportResponseData,
  CustomerReportResponseData,
  OrderReportResponseData,
  PaymentReportResponseData,
  ProductReportResponseData,
  ReportQueryParams,
  RevenueReportResponseData,
  SalesReportResponseData,
  ShippingReportResponseData,
} from '@/types/report';

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalesReport: builder.query<
      ApiResponse<SalesReportResponseData>,
      ReportQueryParams | void
    >({
      query: (params) => ({
        url: '/reports/sales',
        method: 'GET',
        params: params || undefined,
      }),
      providesTags: ['Reports'],
    }),

    getRevenueReport: builder.query<
      ApiResponse<RevenueReportResponseData>,
      ReportQueryParams | void
    >({
      query: (params) => ({
        url: '/reports/revenue',
        method: 'GET',
        params: params || undefined,
      }),
      providesTags: ['Reports'],
    }),

    getOrderReport: builder.query<
      ApiResponse<OrderReportResponseData>,
      ReportQueryParams | void
    >({
      query: (params) => ({
        url: '/reports/orders',
        method: 'GET',
        params: params || undefined,
      }),
      providesTags: ['Reports'],
    }),

    getProductReport: builder.query<
      ApiResponse<ProductReportResponseData>,
      ReportQueryParams | void
    >({
      query: (params) => ({
        url: '/reports/products',
        method: 'GET',
        params: params || undefined,
      }),
      providesTags: ['Reports'],
    }),

    getCustomerReport: builder.query<
      ApiResponse<CustomerReportResponseData>,
      ReportQueryParams | void
    >({
      query: (params) => ({
        url: '/reports/customers',
        method: 'GET',
        params: params || undefined,
      }),
      providesTags: ['Reports'],
    }),

    getPaymentReport: builder.query<
      ApiResponse<PaymentReportResponseData>,
      ReportQueryParams | void
    >({
      query: (params) => ({
        url: '/reports/payments',
        method: 'GET',
        params: params || undefined,
      }),
      providesTags: ['Reports'],
    }),

    getShippingReport: builder.query<
      ApiResponse<ShippingReportResponseData>,
      ReportQueryParams | void
    >({
      query: (params) => ({
        url: '/reports/shipping',
        method: 'GET',
        params: params || undefined,
      }),
      providesTags: ['Reports'],
    }),

    getCouponReport: builder.query<
      ApiResponse<CouponReportResponseData>,
      ReportQueryParams | void
    >({
      query: (params) => ({
        url: '/reports/coupons',
        method: 'GET',
        params: params || undefined,
      }),
      providesTags: ['Reports'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSalesReportQuery,
  useGetRevenueReportQuery,
  useGetOrderReportQuery,
  useGetProductReportQuery,
  useGetCustomerReportQuery,
  useGetPaymentReportQuery,
  useGetShippingReportQuery,
  useGetCouponReportQuery,
} = reportApi;
