import { baseApi } from './baseApi';
import { Coupon, ApplyCouponInput, ApplyCouponResponse, RemoveCouponResponse } from '@/types/coupon';

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query<Coupon[], void>({
      query: () => '/coupons',
      transformResponse: (response: unknown) => {
        if (!response) return [];
        const res = response as { data?: Coupon[] };
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(response)) return response;
        return [];
      },
      providesTags: ['Coupons'],
    }),

    applyCoupon: builder.mutation<ApplyCouponResponse, ApplyCouponInput>({
      query: (body) => ({
        url: '/coupons/apply',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => {
        if (!response) return { valid: false, discountAmount: 0 };
        const res = response as { data?: ApplyCouponResponse; valid?: boolean; discountAmount?: number; message?: string; coupon?: Coupon };
        if (res.data) return res.data;
        return {
          valid: res.valid ?? true,
          discountAmount: res.discountAmount ?? 0,
          message: res.message,
          coupon: res.coupon,
        };
      },
      invalidatesTags: ['Coupons', 'Checkout', 'Cart'],
    }),

    removeCoupon: builder.mutation<RemoveCouponResponse, { code?: string } | void>({
      query: (body) => ({
        url: '/coupons/remove',
        method: 'DELETE',
        body: body || {},
      }),
      transformResponse: (response: unknown) => {
        if (!response) return { success: true };
        const res = response as { data?: RemoveCouponResponse; success?: boolean; message?: string };
        if (res.data) return res.data;
        return {
          success: res.success ?? true,
          message: res.message,
        };
      },
      invalidatesTags: ['Coupons', 'Checkout', 'Cart'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCouponsQuery,
  useApplyCouponMutation,
  useRemoveCouponMutation,
} = couponApi;
