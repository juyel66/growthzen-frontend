import { baseApi } from './baseApi';
import {
  PaymentListResponse,
  PaymentQueryParams,
  PaymentView,
} from '@/types/payment';

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminPayments: builder.query<PaymentListResponse, PaymentQueryParams | void>({
      query: (params) => ({
        url: '/admin/payments',
        method: 'GET',
        params: params || undefined,
      }),
      transformResponse: (response: { data?: PaymentListResponse } | PaymentListResponse) => {
        const data = (response as { data?: PaymentListResponse })?.data ?? (response as PaymentListResponse);
        if (data && Array.isArray(data.items)) {
          return data;
        }
        if (Array.isArray(response)) {
          return {
            items: response as unknown as PaymentView[],
            meta: { page: 1, limit: (response as unknown as PaymentView[]).length, total: (response as unknown as PaymentView[]).length, totalPages: 1 },
          };
        }
        return { items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
      },
      providesTags: ['Payments'],
    }),

    getPaymentById: builder.query<PaymentView, string>({
      query: (paymentId) => `/payments/${paymentId}`,
      transformResponse: (response: { data?: PaymentView } | PaymentView) => {
        return (response as { data?: PaymentView })?.data ?? (response as PaymentView);
      },
      providesTags: (result, error, id) => [{ type: 'Payments', id }],
    }),

    approvePayment: builder.mutation<PaymentView, string>({
      query: (paymentId) => ({
        url: `/admin/payments/${paymentId}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        'Payments',
        { type: 'Payments', id },
        'Orders',
        'Dashboard',
      ],
    }),

    rejectPayment: builder.mutation<PaymentView, { paymentId: string; reason: string }>({
      query: ({ paymentId, reason }) => ({
        url: `/admin/payments/${paymentId}/reject`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: (result, error, { paymentId }) => [
        'Payments',
        { type: 'Payments', id: paymentId },
        'Orders',
        'Dashboard',
      ],
    }),

    refundPayment: builder.mutation<PaymentView, { paymentId: string; reason: string }>({
      query: ({ paymentId, reason }) => ({
        url: `/admin/payments/${paymentId}/refund`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: (result, error, { paymentId }) => [
        'Payments',
        { type: 'Payments', id: paymentId },
        'Orders',
        'Dashboard',
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminPaymentsQuery,
  useGetPaymentByIdQuery,
  useApprovePaymentMutation,
  useRejectPaymentMutation,
  useRefundPaymentMutation,
} = paymentApi;
