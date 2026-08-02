import { baseApi } from './baseApi';
import { Product, ProductResponse, QueryParams } from '@/types/product';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], QueryParams | void>({
      query: (params) => ({
        url: '/products',
        method: 'GET',
        params: params || undefined,
      }),
      transformResponse: (response: any) => {
        if (!response) return [];
        if (Array.isArray(response)) return response;
        if (Array.isArray(response.data)) return response.data;
        if (Array.isArray(response.products)) return response.products;
        if (response.data && Array.isArray(response.data.products)) return response.data.products;
        return [];
      },
      providesTags: ['Products'],
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: any) => {
        if (!response) return response;
        if (response.data) return response.data;
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation<Product, { id: string; body: Partial<Product> }>({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Products',
        { type: 'Products', id },
      ],
    }),
    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
