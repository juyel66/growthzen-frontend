import { baseApi } from './baseApi';
import { CheckoutRequest, CheckoutResponse, CheckoutResponseData, CheckoutSummaryQuery } from '@/types/checkout';

const generateIdempotencyKey = (): string => {
  return `checkout-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCheckout: builder.query<CheckoutResponseData, CheckoutSummaryQuery | void>({
      query: (params) => ({
        url: '/checkout/summary',
        method: 'GET',
        params: params || undefined,
      }),
      transformResponse: (response: unknown) => {
        if (!response) return {} as CheckoutResponseData;
        const res = response as { data?: CheckoutResponseData };
        if (res.data) return res.data;
        return response as CheckoutResponseData;
      },
      providesTags: ['Checkout'],
    }),

    placeOrder: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (body) => ({
        url: '/checkout',
        method: 'POST',
        body,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      transformResponse: (response: unknown) => {
        if (!response) return { success: false } as CheckoutResponse;
        const res = response as {
          data?: CheckoutResponseData & { orderNumber?: string; id?: string };
          success?: boolean;
          message?: string;
          orderId?: string;
          totalAmount?: number;
        };
        if (res.data) {
          const orderCode = res.data.orderNumber || res.data.orderId || res.orderId || res.data.id || '';
          return {
            success: res.success ?? true,
            orderId: orderCode,
            totalAmount: res.data.totalAmount || res.totalAmount || res.data.grandTotal || 0,
            data: res.data,
            message: res.message,
          };
        }
        return response as CheckoutResponse;
      },
      invalidatesTags: ['Checkout', 'Cart', 'Orders'],
    }),

    // Alias for backward compatibility
    initializeCheckout: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (body) => ({
        url: '/checkout',
        method: 'POST',
        body,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      invalidatesTags: ['Checkout', 'Cart', 'Orders'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCheckoutQuery,
  useGetCheckoutQuery: useGetCheckoutSummaryQuery,
  usePlaceOrderMutation,
  useInitializeCheckoutMutation,
} = checkoutApi;
