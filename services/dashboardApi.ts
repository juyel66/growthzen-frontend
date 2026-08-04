import { baseApi } from './baseApi';
import {
  DashboardCharts,
  DashboardCustomerAnalytics,
  DashboardOrderAnalytics,
  DashboardOverview,
  DashboardPaymentAnalytics,
  DashboardQueryParams,
  DashboardRecent,
  DashboardRevenueAnalytics,
} from '@/types/dashboard';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<DashboardOverview, DashboardQueryParams | void>({
      query: (params) => ({
        url: '/dashboard',
        method: 'GET',
        params: params || undefined,
      }),
      transformResponse: (response: { data?: DashboardOverview } | DashboardOverview) => {
        return (response as { data?: DashboardOverview })?.data ?? (response as DashboardOverview);
      },
      providesTags: ['Dashboard'],
    }),

    getDashboardRevenue: builder.query<DashboardRevenueAnalytics, DashboardQueryParams | void>({
      query: (params) => ({
        url: '/dashboard/revenue',
        method: 'GET',
        params: params || undefined,
      }),
      transformResponse: (response: { data?: DashboardRevenueAnalytics } | DashboardRevenueAnalytics) => {
        return (response as { data?: DashboardRevenueAnalytics })?.data ?? (response as DashboardRevenueAnalytics);
      },
      providesTags: ['Dashboard'],
    }),

    getDashboardOrders: builder.query<DashboardOrderAnalytics, void>({
      query: () => ({
        url: '/dashboard/orders',
        method: 'GET',
      }),
      transformResponse: (response: { data?: DashboardOrderAnalytics } | DashboardOrderAnalytics) => {
        return (response as { data?: DashboardOrderAnalytics })?.data ?? (response as DashboardOrderAnalytics);
      },
      providesTags: ['Dashboard'],
    }),

    getDashboardCustomers: builder.query<DashboardCustomerAnalytics, void>({
      query: () => ({
        url: '/dashboard/customers',
        method: 'GET',
      }),
      transformResponse: (response: { data?: DashboardCustomerAnalytics } | DashboardCustomerAnalytics) => {
        return (response as { data?: DashboardCustomerAnalytics })?.data ?? (response as DashboardCustomerAnalytics);
      },
      providesTags: ['Dashboard'],
    }),

    getDashboardPayments: builder.query<DashboardPaymentAnalytics, void>({
      query: () => ({
        url: '/dashboard/payments',
        method: 'GET',
      }),
      transformResponse: (response: { data?: DashboardPaymentAnalytics } | DashboardPaymentAnalytics) => {
        return (response as { data?: DashboardPaymentAnalytics })?.data ?? (response as DashboardPaymentAnalytics);
      },
      providesTags: ['Dashboard'],
    }),

    getDashboardCharts: builder.query<DashboardCharts, DashboardQueryParams | void>({
      query: (params) => ({
        url: '/dashboard/charts',
        method: 'GET',
        params: params || undefined,
      }),
      transformResponse: (response: { data?: DashboardCharts } | DashboardCharts) => {
        return (response as { data?: DashboardCharts })?.data ?? (response as DashboardCharts);
      },
      providesTags: ['Dashboard'],
    }),

    getDashboardRecent: builder.query<DashboardRecent, DashboardQueryParams | void>({
      query: (params) => ({
        url: '/dashboard/recent',
        method: 'GET',
        params: params || undefined,
      }),
      transformResponse: (response: { data?: DashboardRecent } | DashboardRecent) => {
        return (response as { data?: DashboardRecent })?.data ?? (response as DashboardRecent);
      },
      providesTags: ['Dashboard'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetDashboardOverviewQuery,
  useGetDashboardRevenueQuery,
  useGetDashboardOrdersQuery,
  useGetDashboardCustomersQuery,
  useGetDashboardPaymentsQuery,
  useGetDashboardChartsQuery,
  useGetDashboardRecentQuery,
} = dashboardApi;
