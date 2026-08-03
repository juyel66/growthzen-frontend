import { baseApi } from './baseApi';
import { ShippingMethod, ShippingDataResponse } from '@/types/shipping';

export const shippingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShipping: builder.query<ShippingDataResponse | ShippingMethod[], void>({
      query: () => '/shipping',
      transformResponse: (response: unknown) => {
        if (!response) return [];
        const res = response as { data?: ShippingDataResponse | ShippingMethod[] };
        if (res.data) return res.data;
        return response as ShippingDataResponse | ShippingMethod[];
      },
      providesTags: ['Shipping'],
    }),

    getShippingMethods: builder.query<ShippingMethod[], void>({
      query: () => '/shipping/methods',
      transformResponse: (response: unknown) => {
        if (!response) return [];
        const res = response as { data?: ShippingMethod[] };
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(response)) return response;
        return [];
      },
      providesTags: ['Shipping'],
    }),

    calculateRates: builder.mutation<ShippingMethod[], { destination: string; weight?: number }>({
      query: (body) => ({
        url: '/shipping/calculate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Shipping'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetShippingQuery,
  useGetShippingMethodsQuery,
  useCalculateRatesMutation,
} = shippingApi;
