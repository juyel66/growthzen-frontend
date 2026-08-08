import { baseApi } from './baseApi';
import {
  ReviewItem,
  ProductReviewsResponse,
  ReviewEligibilityResponse,
  CreateReviewInput,
  UpdateReviewInput,
} from '@/types/review';

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get reviews for a specific product (Public/Customer)
    getProductReviews: builder.query<ProductReviewsResponse, string>({
      query: (productId) => `/reviews/product/${productId}`,
      transformResponse: (response: any): ProductReviewsResponse => {
        if (response && typeof response === 'object') {
          const reviewsList = Array.isArray(response.reviews)
            ? response.reviews
            : Array.isArray(response.data)
              ? response.data
              : Array.isArray(response)
                ? response
                : [];

          const totalReviews =
            typeof response.totalReviews === 'number'
              ? response.totalReviews
              : typeof response.total === 'number'
                ? response.total
                : reviewsList.length;

          const averageRating =
            typeof response.averageRating === 'number'
              ? response.averageRating
              : typeof response.ratingsAverage === 'number'
                ? response.ratingsAverage
                : reviewsList.length > 0
                  ? reviewsList.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / reviewsList.length
                  : 0;

          const dist = response.ratingDistribution || response.breakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          const ratingDistribution = {
            5: dist[5] || 0,
            4: dist[4] || 0,
            3: dist[3] || 0,
            2: dist[2] || 0,
            1: dist[1] || 0,
          };

          return {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews,
            ratingDistribution,
            reviews: reviewsList,
          };
        }

        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          reviews: [],
        };
      },
      providesTags: (_result, _error, productId) => [
        { type: 'Reviews', id: `PRODUCT_${productId}` },
        { type: 'Reviews', id: 'LIST' },
      ],
    }),

    // 2. Get review eligibility / form pre-fill for an order item
    getReviewFormByOrderItem: builder.query<ReviewEligibilityResponse, string>({
      query: (orderItemId) => `/reviews/form/${orderItemId}`,
      transformResponse: (response: any): ReviewEligibilityResponse => {
        if (response && typeof response === 'object') {
          return {
            canReview: response.canReview !== false && response.eligible !== false,
            message: response.message || response.error,
            productId: response.productId || response.product?.id,
            orderItemId: response.orderItemId || response.item?.id,
            productTitle: response.productTitle || response.product?.title || response.product?.name,
            productImage: response.productImage || response.product?.thumbnailImage || response.product?.image,
            existingReview: response.existingReview || response.review || null,
          };
        }
        return {
          canReview: false,
          message: 'Unable to check review eligibility.',
        };
      },
      providesTags: (_result, _error, orderItemId) => [
        { type: 'Reviews', id: `FORM_${orderItemId}` },
      ],
    }),

    // 3. Get customer's own reviews
    getMyReviews: builder.query<ReviewItem[], void>({
      query: () => '/reviews/my',
      transformResponse: (response: any): ReviewItem[] => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.reviews)) return response.reviews;
        if (response && Array.isArray(response.data)) return response.data;
        if (response && Array.isArray(response.items)) return response.items;
        return [];
      },
      providesTags: [{ type: 'Reviews', id: 'MY_REVIEWS' }],
    }),

    // 4. Get all reviews (Admin panel)
    getAllReviews: builder.query<ReviewItem[], { status?: string; search?: string } | void>({
      query: (params) => ({
        url: '/reviews',
        params: params || undefined,
      }),
      transformResponse: (response: any): ReviewItem[] => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.reviews)) return response.reviews;
        if (response && Array.isArray(response.data)) return response.data;
        if (response && Array.isArray(response.items)) return response.items;
        return [];
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Reviews' as const, id })),
            { type: 'Reviews', id: 'LIST' },
          ]
          : [{ type: 'Reviews', id: 'LIST' }],
    }),

    // 5. Submit a new review
    createReview: builder.mutation<ReviewItem, CreateReviewInput>({
      query: (body) => ({
        url: '/reviews',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Reviews', 'Products'],
    }),

    // 6. Update review (Admin status change or customer edit)
    updateReview: builder.mutation<ReviewItem, { id: string; data: UpdateReviewInput }>({
      query: ({ id, data }) => ({
        url: `/reviews/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Reviews', id },
        'Reviews',
        'Products',
      ],
      // Optimistic cache update for list view
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          reviewApi.util.updateQueryData('getAllReviews', undefined, (draft) => {
            const item = draft.find((r) => r.id === id);
            if (item) {
              if (data.rating !== undefined) item.rating = data.rating;
              if (data.comment !== undefined) item.comment = data.comment;
              if (data.status !== undefined) item.status = data.status;
              if (data.images !== undefined) item.images = data.images;
              item.updatedAt = new Date().toISOString();
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // 7. Delete review
    deleteReview: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reviews', 'Products'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          reviewApi.util.updateQueryData('getAllReviews', undefined, (draft) => {
            const index = draft.findIndex((r) => r.id === id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductReviewsQuery,
  useGetReviewFormByOrderItemQuery,
  useGetMyReviewsQuery,
  useGetAllReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
