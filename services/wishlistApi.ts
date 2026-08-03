import { baseApi } from './baseApi';
import { Wishlist } from '@/types/wishlist';

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<Wishlist, void>({
      query: () => '/wishlist',
      transformResponse: (response: unknown) => {
        if (!response) {
          return { id: '', items: [], totalItems: 0, createdAt: '', updatedAt: '' };
        }
        const res = response as { data?: Wishlist; success?: boolean };
        if (res.data) return res.data;
        return response as Wishlist;
      },
      providesTags: ['Wishlist'],
    }),

    addToWishlist: builder.mutation<Wishlist, { productId: string }>({
      query: (body) => ({
        url: '/wishlist',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => {
        if (!response) return { id: '', items: [], totalItems: 0, createdAt: '', updatedAt: '' };
        const res = response as { data?: Wishlist };
        if (res.data) return res.data;
        return response as Wishlist;
      },
      invalidatesTags: ['Wishlist'],
    }),

    removeWishlistItem: builder.mutation<Wishlist, string>({
      query: (itemId) => ({
        url: `/wishlist/${itemId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: unknown) => {
        if (!response) return { id: '', items: [], totalItems: 0, createdAt: '', updatedAt: '' };
        const res = response as { data?: Wishlist };
        if (res.data) return res.data;
        return response as Wishlist;
      },
      invalidatesTags: ['Wishlist'],
    }),

    clearWishlist: builder.mutation<Wishlist, void>({
      query: () => ({
        url: '/wishlist',
        method: 'DELETE',
      }),
      transformResponse: (response: unknown) => {
        if (!response) return { id: '', items: [], totalItems: 0, createdAt: '', updatedAt: '' };
        const res = response as { data?: Wishlist };
        if (res.data) return res.data;
        return response as Wishlist;
      },
      invalidatesTags: ['Wishlist'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveWishlistItemMutation,
  useClearWishlistMutation,
} = wishlistApi;
