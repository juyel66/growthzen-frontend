import { baseApi } from './baseApi';
import { ShippingMethod } from '@/types/shipping';

export const shippingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShippingMethods: builder.query<ShippingMethod[], void>({
      query: () => '/shipping/methods',
      providesTags: ['Shipping'],
    }),
    calculateRates: builder.mutation<ShippingMethod[], { destination: string; weight: number }>({
      query: (body) => ({
        url: '/shipping/calculate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Shipping'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetShippingMethodsQuery,
  useCalculateRatesMutation,
} = shippingApi;
