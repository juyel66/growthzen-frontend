import { baseApi } from './baseApi';
import { Cart, AddCartItemInput, UpdateCartItemInput } from '@/types/cart';

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => '/cart',
      transformResponse: (response: unknown) => {
        if (!response) {
          return {
            id: '',
            items: [],
            totalQuantity: 0,
            totalAmount: 0,
            summary: { totalItems: 0, totalQuantity: 0, subtotal: 0, discount: 0, grandTotal: 0 },
            createdAt: '',
            updatedAt: '',
          };
        }
        const res = response as { data?: Cart };
        if (res.data) return res.data;
        return response as Cart;
      },
      providesTags: ['Cart'],
    }),

    addToCart: builder.mutation<Cart, AddCartItemInput>({
      query: (body) => ({
        url: '/cart',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => {
        if (!response) return response as Cart;
        const res = response as { data?: Cart };
        if (res.data) return res.data;
        return response as Cart;
      },
      invalidatesTags: ['Cart'],
    }),

    updateCartItem: builder.mutation<Cart, { itemId: string; body: UpdateCartItemInput }>({
      query: ({ itemId, body }) => ({
        url: `/cart/${itemId}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: unknown) => {
        if (!response) return response as Cart;
        const res = response as { data?: Cart };
        if (res.data) return res.data;
        return response as Cart;
      },
      invalidatesTags: ['Cart'],
    }),

    removeCartItem: builder.mutation<Cart, string>({
      query: (itemId) => ({
        url: `/cart/${itemId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: unknown) => {
        if (!response) return response as Cart;
        const res = response as { data?: Cart };
        if (res.data) return res.data;
        return response as Cart;
      },
      invalidatesTags: ['Cart'],
    }),

    clearCart: builder.mutation<Cart, void>({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
      transformResponse: (response: unknown) => {
        if (!response) return response as Cart;
        const res = response as { data?: Cart };
        if (res.data) return res.data;
        return response as Cart;
      },
      invalidatesTags: ['Cart'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useUpdateCartItemMutation: useUpdateCartMutation,
  useRemoveCartItemMutation,
  useRemoveCartItemMutation: useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
