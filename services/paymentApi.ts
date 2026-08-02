import { baseApi } from './baseApi';
import { PaymentDetails, PaymentResponse } from '@/types/payment';

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    processPayment: builder.mutation<PaymentResponse, PaymentDetails>({
      query: (body) => ({
        url: '/payments/process',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Payments', 'Orders'],
    }),
    getPaymentStatus: builder.query<PaymentResponse, string>({
      query: (transactionId) => `/payments/status/${transactionId}`,
      providesTags: (result, error, transactionId) => [{ type: 'Payments', id: transactionId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useProcessPaymentMutation,
  useGetPaymentStatusQuery,
} = paymentApi;
