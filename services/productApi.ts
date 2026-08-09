import { baseApi } from './baseApi';
import { Product, ProductResponse, QueryParams } from '@/types/product';

export interface ProductIdentifiersResponse {
  productCode?: string;
  sku?: string;
  barcode?: string;
  ean?: string;
  data?: {
    productCode?: string;
    sku?: string;
    barcode?: string;
    ean?: string;
  };
}

export interface SearchSuggestionsResponse {
  products: Product[];
  categories: { id: string; name: string; slug: string }[];
}

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

    getSuggestions: builder.query<SearchSuggestionsResponse, string>({
      async queryFn(q, _api, _extraOptions, baseQuery) {
        const trimmed = (q || '').trim();
        if (!trimmed) {
          return { data: { products: [], categories: [] } };
        }

        // Attempt GET /products/search/suggestions?q=...
        const suggestionRes = await baseQuery({
          url: '/products/search/suggestions',
          method: 'GET',
          params: { q: trimmed },
        });

        if (!suggestionRes.error && suggestionRes.data) {
          const data = suggestionRes.data as any;
          const products = Array.isArray(data?.products)
            ? data.products
            : Array.isArray(data?.data?.products)
            ? data.data.products
            : Array.isArray(data)
            ? data
            : [];
          const categories = Array.isArray(data?.categories)
            ? data.categories
            : Array.isArray(data?.data?.categories)
            ? data.data.categories
            : [];
          return { data: { products, categories } };
        }

        // Fallback: search products & categories in parallel
        const [productsRes, categoriesRes] = await Promise.all([
          baseQuery({
            url: '/products',
            method: 'GET',
            params: { search: trimmed, limit: 5 },
          }),
          baseQuery({
            url: '/categories',
            method: 'GET',
            params: { search: trimmed, limit: 5 },
          }),
        ]);

        const rawProducts = productsRes.data as any;
        const products: Product[] = Array.isArray(rawProducts)
          ? rawProducts
          : Array.isArray(rawProducts?.data)
          ? rawProducts.data
          : Array.isArray(rawProducts?.products)
          ? rawProducts.products
          : [];

        const rawCategories = categoriesRes.data as any;
        const categoriesList: any[] = Array.isArray(rawCategories)
          ? rawCategories
          : Array.isArray(rawCategories?.data)
          ? rawCategories.data
          : Array.isArray(rawCategories?.categories)
          ? rawCategories.categories
          : [];

        const qLower = trimmed.toLowerCase();
        const matchedCategories = categoriesList
          .filter(
            (c) =>
              c &&
              typeof c === 'object' &&
              ((c.name || '').toLowerCase().includes(qLower) ||
                (c.slug || '').toLowerCase().includes(qLower))
          )
          .map((c) => ({ id: c.id, name: c.name, slug: c.slug }));

        return {
          data: {
            products,
            categories: matchedCategories,
          },
        };
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
    generateIdentifiers: builder.query<
      ProductIdentifiersResponse,
      { categoryId?: string; type?: 'sku' | 'barcode' | 'all' } | void
    >({
      query: (params) => ({
        url: '/products/generate-identifiers',
        method: 'GET',
        params: params || undefined,
      }),
      transformResponse: (response: any) => {
        return response?.data ?? response;
      },
    }),
    createProduct: builder.mutation<Product, FormData | Partial<Product>>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation<Product, { id: string; body: FormData | Partial<Product> }>({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
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
    getBestSellers: builder.query<Product[], void>({
      query: () => '/products/best-sellers',
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
    getOffers: builder.query<Product[], void>({
      query: () => '/products/offers',
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
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetSuggestionsQuery,
  useGetProductByIdQuery,
  useGetBestSellersQuery,
  useGetOffersQuery,
  useGenerateIdentifiersQuery,
  useLazyGenerateIdentifiersQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
