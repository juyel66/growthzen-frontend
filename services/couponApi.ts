import { baseApi } from './baseApi';
import { Coupon, ApplyCouponResponse } from '@/types/coupon';

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query<Coupon[], void>({
      query: () => '/coupons',
      providesTags: ['Coupons'],
    }),
    applyCoupon: builder.mutation<ApplyCouponResponse, { code: string; cartTotal: number }>({
      query: (body) => ({
        url: '/coupons/apply',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Coupons', 'Checkout'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCouponsQuery,
  useApplyCouponMutation,
} = couponApi;
