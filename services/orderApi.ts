import { baseApi } from './baseApi';
import { cartApi } from './cartApi';
import {
  OrderListResponse,
  OrderQueryParams,
  OrderSummaryData,
  OrderView,
  OrderStatus,
} from '@/types/order';

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrderListResponse, OrderQueryParams | void>({
      query: (params) => ({
        url: '/orders',
        method: 'GET',
        params: params || undefined,
      }),
      transformResponse: (response: { data?: OrderListResponse } | OrderListResponse) => {
        const data = (response as { data?: OrderListResponse })?.data ?? (response as OrderListResponse);
        if (data && Array.isArray(data.items)) {
          return data;
        }
        if (Array.isArray(response)) {
          return {
            items: response as unknown as OrderView[],
            meta: { page: 1, limit: (response as unknown as OrderView[]).length, total: (response as unknown as OrderView[]).length, totalPages: 1 },
          };
        }
        return { items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
      },
      providesTags: ['Orders'],
    }),

    getOrderById: builder.query<OrderView, string>({
      query: (id) => `/orders/${id}`,
      transformResponse: (response: { data?: OrderView } | OrderView) => {
        return (response as { data?: OrderView })?.data ?? (response as OrderView);
      },
      providesTags: (result, error, id) => [{ type: 'Orders', id }],
    }),

    trackOrder: builder.query<OrderView, { orderCode: string; phone?: string }>({
      query: ({ orderCode, phone }) => ({
        url: `/orders/track/${orderCode}`,
        method: 'GET',
        params: phone ? { phone } : undefined,
      }),
      transformResponse: (response: { data?: OrderView } | OrderView) => {
        return (response as { data?: OrderView })?.data ?? (response as OrderView);
      },
      providesTags: (result, error, { orderCode }) => [{ type: 'Orders', id: orderCode }],
    }),

    createOrder: builder.mutation<OrderView, Partial<OrderView>>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Orders', 'Cart', 'Checkout'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.invalidateTags(['Cart', 'Checkout', 'Orders']));
          dispatch(
            cartApi.util.updateQueryData('getCart', undefined, () => ({
              id: '',
              items: [],
              totalQuantity: 0,
              totalAmount: 0,
              summary: { totalItems: 0, totalQuantity: 0, subtotal: 0, discount: 0, grandTotal: 0 },
              createdAt: '',
              updatedAt: '',
            }))
          );

          if (typeof window !== 'undefined') {
            try {
              sessionStorage.removeItem('growthzen_buy_now_item');
              sessionStorage.removeItem('growthzen_pending_action');
              sessionStorage.removeItem('buy_now_item');

              localStorage.removeItem('growthzen_guest_cart');
              localStorage.removeItem('growthzen_cart');
              localStorage.removeItem('guest_cart');
              localStorage.removeItem('cart');
            } catch {
              // ignore
            }
          }
        } catch {
          // Never clear cart on failure
        }
      },
    }),

    updateOrderStatus: builder.mutation<
      OrderView,
      {
        id: string;
        status: OrderStatus | string;
        adminNote?: string | null;
        courierServiceCost?: number | null;
        courierCost?: number | null;
      }
    >({
      query: ({ id, status, adminNote, courierServiceCost, courierCost }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: {
          status,
          adminNote,
          courierServiceCost: courierServiceCost ?? courierCost,
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        'Orders',
        { type: 'Orders', id },
        'Dashboard',
      ],
    }),

    cancelOrder: builder.mutation<OrderView, string>({
      query: (orderId) => ({
        url: `/orders/${orderId}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, orderId) => [
        'Orders',
        { type: 'Orders', id: orderId },
        'Dashboard',
      ],
    }),

    getOrderSummary: builder.query<OrderSummaryData, OrderQueryParams | void>({
      query: (params) => ({
        url: '/orders/summary',
        method: 'GET',
        params: params || undefined,
      }),
      transformResponse: (response: { data?: OrderSummaryData } | OrderSummaryData) => {
        return (response as { data?: OrderSummaryData })?.data ?? (response as OrderSummaryData);
      },
      providesTags: ['Orders'],
    }),

    getMyOrders: builder.query<OrderListResponse, OrderQueryParams | void>({
      query: (params) => ({
        url: '/orders/my-orders',
        method: 'GET',
        params: params || undefined,
      }),
      transformResponse: (response: unknown) => {
        if (!response) return { items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
        const raw = (response as { data?: any })?.data ?? response;
        if (raw && Array.isArray(raw.items)) {
          return raw as OrderListResponse;
        }
        if (Array.isArray(raw)) {
          const list = raw as OrderView[];
          return {
            items: list,
            meta: { page: 1, limit: list.length || 10, total: list.length, totalPages: 1 },
          };
        }
        return { items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
      },
      providesTags: ['Orders'],
    }),

    getOrderInvoice: builder.query<any, string>({
      query: (id) => `/orders/${id}/invoice`,
      transformResponse: (response: any) => {
        return response?.data ?? response;
      },
      providesTags: (result, error, id) => [{ type: 'Orders', id }],
    }),
    getMyOrderSummary: builder.query<
      {
        totalOrders: number;
        pendingOrders: number;
        deliveredOrders: number;
        totalPurchase: number;
        recentOrders: OrderView[];
      },
      void
    >({
      query: () => ({
        url: '/orders/my-summary',
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        return response?.data ?? response;
      },
      providesTags: ['Orders', 'Dashboard'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetOrdersQuery,
  useGetMyOrdersQuery,
  useGetMyOrderSummaryQuery,
  useGetOrderSummaryQuery,
  useGetOrderByIdQuery,
  useGetOrderInvoiceQuery,
  useLazyGetOrderInvoiceQuery,
  useTrackOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} = orderApi;


