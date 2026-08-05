import { baseApi } from './baseApi';
import {
  Coupon,
  CreateCouponInput,
  UpdateCouponInput,
  ApplyCouponInput,
  ApplyCouponResponse,
  RemoveCouponResponse,
} from '@/types/coupon';

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
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Coupons' as const, id })),
              { type: 'Coupons', id: 'LIST' },
            ]
          : [{ type: 'Coupons', id: 'LIST' }],
    }),

    getCouponById: builder.query<Coupon, string>({
      query: (id) => `/coupons/${id}`,
      transformResponse: (response: unknown) => {
        const res = response as { data?: Coupon };
        return res?.data ?? (response as Coupon);
      },
      providesTags: (result, error, id) => [{ type: 'Coupons', id }],
    }),

    createCoupon: builder.mutation<Coupon, CreateCouponInput>({
      query: (body) => ({
        url: '/coupons',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => {
        const res = response as { data?: Coupon };
        return res?.data ?? (response as Coupon);
      },
      invalidatesTags: [
        { type: 'Coupons', id: 'LIST' },
        'Coupons',
        'Checkout',
        'Cart',
        'Dashboard',
        'Orders',
      ],
    }),

    updateCoupon: builder.mutation<Coupon, { id: string; data: UpdateCouponInput }>({
      query: ({ id, data }) => ({
        url: `/coupons/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: unknown) => {
        const res = response as { data?: Coupon };
        return res?.data ?? (response as Coupon);
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Coupons', id },
        { type: 'Coupons', id: 'LIST' },
        'Coupons',
        'Checkout',
        'Cart',
        'Dashboard',
        'Orders',
      ],
    }),

    deleteCoupon: builder.mutation<{ message?: string; success?: boolean }, string>({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Coupons', id: 'LIST' },
        'Coupons',
        'Checkout',
        'Cart',
        'Dashboard',
        'Orders',
      ],
    }),

    applyCoupon: builder.mutation<ApplyCouponResponse, ApplyCouponInput>({
      query: (body) => ({
        url: '/coupons/apply',
        method: 'POST',
        body: { code: body.code.trim() },
      }),
      transformResponse: (response: unknown) => {
        if (!response) return { valid: false, discountAmount: 0 };
        const res = response as {
          data?: ApplyCouponResponse;
          valid?: boolean;
          discountAmount?: number;
          message?: string;
          coupon?: Coupon;
        };
        if (res.data) return res.data;
        return {
          valid: res.valid ?? true,
          discountAmount: res.discountAmount ?? 0,
          message: res.message,
          coupon: res.coupon,
        };
      },
      invalidatesTags: ['Coupons', 'Checkout', 'Cart', 'Dashboard'],
    }),

    removeCoupon: builder.mutation<RemoveCouponResponse, { code?: string } | void>({
      query: (body) => ({
        url: '/coupons/remove',
        method: 'POST',
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
      invalidatesTags: ['Coupons', 'Checkout', 'Cart', 'Dashboard'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCouponsQuery,
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useApplyCouponMutation,
  useRemoveCouponMutation,
} = couponApi;
