import { baseApi } from './baseApi';
import { cartApi } from './cartApi';
import { CheckoutRequest, CheckoutResponse, CheckoutResponseData, CheckoutSummaryQuery } from '@/types/checkout';

const generateIdempotencyKey = (): string => {
  return `checkout-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCheckout: builder.query<CheckoutResponseData, CheckoutSummaryQuery | void>({
      query: (params) => ({
        url: '/checkout/summary',
        method: 'GET',
        params: params || undefined,
      }),
      transformResponse: (response: unknown) => {
        if (!response) return {} as CheckoutResponseData;
        const res = response as { data?: CheckoutResponseData };
        if (res.data) return res.data;
        return response as CheckoutResponseData;
      },
      providesTags: ['Checkout'],
    }),

    placeOrder: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      transformResponse: (response: unknown) => {
        if (!response) return { success: false } as CheckoutResponse;
        const res = response as {
          data?: CheckoutResponseData & { orderCode?: string; orderNumber?: string; id?: string };
          success?: boolean;
          message?: string;
          orderId?: string;
          totalAmount?: number;
        };
        if (res.data) {
          const orderCode = res.data.orderCode || res.data.orderNumber || res.data.orderId || res.orderId || res.data.id || '';
          return {
            success: res.success ?? true,
            orderId: orderCode,
            totalAmount: res.data.totalAmount || res.totalAmount || res.data.grandTotal || 0,
            data: res.data,
            message: res.message,
          };
        }
        return response as CheckoutResponse;
      },
      invalidatesTags: ['Checkout', 'Cart', 'Orders'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          // 1. Invalidate Cart & Checkout RTK Query cache
          dispatch(baseApi.util.invalidateTags(['Cart', 'Checkout', 'Orders']));

          // 2. Immediately reset cached Cart data to empty
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

          // 3. Clear guest cart and session items from localStorage/sessionStorage
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
              // ignore storage errors
            }
          }
        } catch {
          // Requirement 6: Never clear the cart if checkout fails.
        }
      },
    }),

    // Alias for backward compatibility
    initializeCheckout: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
        headers: {
          'Idempotency-Key': generateIdempotencyKey(),
        },
      }),
      transformResponse: (response: unknown) => {
        if (!response) return { success: false } as CheckoutResponse;
        const res = response as {
          data?: CheckoutResponseData & { orderCode?: string; orderNumber?: string; id?: string };
          success?: boolean;
          message?: string;
          orderId?: string;
          totalAmount?: number;
        };
        if (res.data) {
          const orderCode = res.data.orderCode || res.data.orderNumber || res.data.orderId || res.orderId || res.data.id || '';
          return {
            success: res.success ?? true,
            orderId: orderCode,
            totalAmount: res.data.totalAmount || res.totalAmount || res.data.grandTotal || 0,
            data: res.data,
            message: res.message,
          };
        }
        return response as CheckoutResponse;
      },
      invalidatesTags: ['Checkout', 'Cart', 'Orders'],
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
  }),
  overrideExisting: true,
});

export const {
  useGetCheckoutQuery,
  useGetCheckoutQuery: useGetCheckoutSummaryQuery,
  usePlaceOrderMutation,
  useInitializeCheckoutMutation,
} = checkoutApi;
