import { baseApi } from './baseApi';
import { Category, CategoryQueryParams, CreateCategoryInput, UpdateCategoryInput } from '@/types/category';

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], CategoryQueryParams | void>({
      query: (params) => ({
        url: '/categories',
        method: 'GET',
        params: params || undefined,
      }),
      transformResponse: (response: any) => {
        if (!response) return [];
        if (Array.isArray(response)) return response;
        if (Array.isArray(response.data)) return response.data;
        if (Array.isArray(response.categories)) return response.categories;
        if (response.data && Array.isArray(response.data.categories)) return response.data.categories;
        return [];
      },
      providesTags: ['Categories'],
    }),

    getCategoryById: builder.query<Category, string>({
      query: (id) => `/categories/${id}`,
      transformResponse: (response: any) => {
        if (!response) return response;
        if (response.data) return response.data;
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'Categories', id }],
    }),

    createCategory: builder.mutation<Category, CreateCategoryInput>({
      query: (body) => ({
        url: '/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Categories'],
    }),

    updateCategory: builder.mutation<Category, { id: string; body: UpdateCategoryInput }>({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Categories',
        { type: 'Categories', id },
      ],
    }),

    deleteCategory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
