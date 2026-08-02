import { baseApi } from './baseApi';
import { Cart, UpdateCartItemInput } from '@/types/cart';

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => '/cart',
      transformResponse: (response: any) => {
        if (!response) return { id: '', items: [], totalQuantity: 0, totalAmount: 0, createdAt: '', updatedAt: '' };
        if (response.data) return response.data;
        return response;
      },
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<Cart, UpdateCartItemInput>({
      query: (body) => ({
        url: '/cart',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => {
        if (!response) return response;
        if (response.data) return response.data;
        return response;
      },
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<Cart, { id: string; body: { quantity: number } }>({
      query: ({ id, body }) => ({
        url: `/cart/items/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation<Cart, string>({
      query: (id) => ({
        url: `/cart/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
