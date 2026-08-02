import { baseApi } from './baseApi';
import { CheckoutDetails, CheckoutResponse } from '@/types/checkout';

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    initializeCheckout: builder.mutation<CheckoutResponse, CheckoutDetails>({
      query: (details) => ({
        url: '/checkout/initialize',
        method: 'POST',
        body: details,
      }),
      invalidatesTags: ['Checkout', 'Cart'],
    }),
    validateCoupon: builder.query<{ valid: boolean; discount: number }, { code: string; orderAmount: number }>({
      query: ({ code, orderAmount }) => `/checkout/validate-coupon?code=${code}&amount=${orderAmount}`,
      providesTags: ['Checkout'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useInitializeCheckoutMutation,
  useValidateCouponQuery,
} = checkoutApi;
