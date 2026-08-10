import { baseApi } from './baseApi';
import {
  Settings,
  DeliverySettings,
  BannerItem,
  CreateBannerInput,
  UpdateBannerInput,
  CategoryDiscountItem,
  UpdateCategoryDiscountInput,
} from '@/types/settings';

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ----------------------------------------------------
    // SYSTEM SETTINGS ENDPOINTS
    // ----------------------------------------------------
    getSettings: builder.query<Settings, void>({
      query: () => '/settings',
      transformResponse: (response: any) => {
        if (!response) return {};
        if (response.data) return response.data;
        return response;
      },
      providesTags: ['Settings'],
    }),

    patchSettings: builder.mutation<Settings, Record<string, any>>({
      query: (body) => ({
        url: '/settings',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Settings'],
      // Optimistic update for system settings
      async onQueryStarted(patchData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          settingsApi.util.updateQueryData('getSettings', undefined, (draft) => {
            Object.assign(draft, patchData);
          })
        );
        try {
          const { data } = await queryFulfilled;
          const serverData = (data as any)?.data || data;
          if (serverData && typeof serverData === 'object') {
            dispatch(
              settingsApi.util.updateQueryData('getSettings', undefined, (draft) => {
                Object.assign(draft, serverData);
              })
            );
          }
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Legacy update fallback (PUT /settings)
    updateSettings: builder.mutation<Settings, Partial<Settings>>({
      query: (body) => ({
        url: '/settings',
        method: 'PUT',
        body,
      }),
      transformResponse: (response: any) => {
        if (!response) return {};
        if (response.data) return response.data;
        return response;
      },
      invalidatesTags: ['Settings'],
    }),

    // ----------------------------------------------------
    // CENTRALIZED DELIVERY SETTINGS ENDPOINTS
    // ----------------------------------------------------
    getDeliverySettings: builder.query<any, void>({
      query: () => '/settings/delivery',
      transformResponse: (response: any) => {
        if (!response) return {};
        if (response.data) return response.data;
        return response;
      },
      providesTags: ['Settings'],
    }),

    updateDeliverySettings: builder.mutation<any, Record<string, any>>({
      query: (body) => ({
        url: '/settings/delivery',
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: any) => {
        if (!response) return {};
        if (response.data) return response.data;
        return response;
      },
      invalidatesTags: ['Settings'],
    }),

    // ----------------------------------------------------
    // HOMEPAGE BANNERS ENDPOINTS
    // ----------------------------------------------------
    getBanners: builder.query<BannerItem[], void>({
      query: () => '/settings/banners',
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.banners)) return response.banners;
        if (response && Array.isArray(response.data)) return response.data;
        if (response && Array.isArray(response.items)) return response.items;
        return [];
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Banners' as const, id })),
            { type: 'Banners', id: 'LIST' },
          ]
          : [{ type: 'Banners', id: 'LIST' }],
    }),

    getBannerById: builder.query<BannerItem, string>({
      query: (id) => `/settings/banners/${id}`,
      transformResponse: (response: any) => {
        if (response && response.data) return response.data;
        if (response && response.banner) return response.banner;
        return response;
      },
      providesTags: (_result, _error, id) => [{ type: 'Banners', id }],
    }),

    createBanner: builder.mutation<BannerItem, CreateBannerInput>({
      query: (body) => ({
        url: '/settings/banners',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Banners', id: 'LIST' }],
    }),

    updateBanner: builder.mutation<BannerItem, { id: string; data: UpdateBannerInput }>({
      query: ({ id, data }) => ({
        url: `/settings/banners/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Banners', id },
        { type: 'Banners', id: 'LIST' },
      ],
      // Optimistic update for individual banner update
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          settingsApi.util.updateQueryData('getBanners', undefined, (draft) => {
            const index = draft.findIndex((b) => b.id === id);
            if (index !== -1) {
              draft[index] = { ...draft[index], ...data };
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

    deleteBanner: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/settings/banners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Banners', id: 'LIST' }],
      // Optimistic update for soft delete
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          settingsApi.util.updateQueryData('getBanners', undefined, (draft) => {
            const index = draft.findIndex((b) => b.id === id);
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

    // ----------------------------------------------------
    // CATEGORY DISCOUNTS ENDPOINTS
    // ----------------------------------------------------
    getCategoryDiscounts: builder.query<CategoryDiscountItem[], void>({
      query: () => '/settings/category-discounts',
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.discounts)) return response.discounts;
        if (response && Array.isArray(response.data)) return response.data;
        if (response && Array.isArray(response.items)) return response.items;
        return [];
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ categoryId }) => ({ type: 'CategoryDiscounts' as const, id: categoryId })),
            { type: 'CategoryDiscounts', id: 'LIST' },
          ]
          : [{ type: 'CategoryDiscounts', id: 'LIST' }],
    }),

    updateCategoryDiscount: builder.mutation<
      CategoryDiscountItem,
      { categoryId: string; data: UpdateCategoryDiscountInput }
    >({
      query: ({ categoryId, data }) => ({
        url: `/settings/category-discounts/${categoryId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { categoryId }) => [
        { type: 'CategoryDiscounts', id: categoryId },
        { type: 'CategoryDiscounts', id: 'LIST' },
      ],
      // Optimistic update for Category Discount row update
      async onQueryStarted({ categoryId, data }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          settingsApi.util.updateQueryData('getCategoryDiscounts', undefined, (draft) => {
            const item = draft.find((d) => d.categoryId === categoryId);
            if (item) {
              item.discountPercentage = data.discountPercentage;
              item.isDiscountEnabled = data.isDiscountEnabled;
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

  }),
  overrideExisting: false,
});

export const {
  useGetSettingsQuery,
  usePatchSettingsMutation,
  useUpdateSettingsMutation,
  useGetDeliverySettingsQuery,
  useUpdateDeliverySettingsMutation,
  useGetBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useGetCategoryDiscountsQuery,
  useUpdateCategoryDiscountMutation,
} = settingsApi;
