import { baseApi } from './baseApi';
import {
  InvoiceListResponse,
  InvoiceQueryParams,
  InvoiceListItem,
} from '@/types/invoice';

export interface PublicInvoiceItem {
  id?: string;
  title?: string;
  productTitle?: string;
  productName?: string;
  sku?: string;
  productCode?: string;
  quantity?: number;
  qty?: number;
  unitPrice?: number;
  price?: number;
  subtotal?: number;
  total?: number;
}

export interface PublicInvoiceData {
  invoiceNumber?: string;
  invoiceCode?: string;
  verificationToken?: string;
  token?: string;
  invoiceDate?: string;
  createdAt?: string;
  orderNumber?: string;
  orderCode?: string;
  customerName?: string;
  customerPhone?: string;
  phone?: string;
  customerEmail?: string;
  email?: string;
  customerRole?: string;
  role?: string;
  orderedByRole?: string;
  shippingAddress?: string;
  address?: string;
  district?: string;
  division?: string;
  shippingType?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  deliveryStatus?: string;
  orderStatus?: string;
  status?: string;
  items?: PublicInvoiceItem[];
  subtotal?: number;
  discount?: number;
  discountAmount?: number;
  deliveryCharge?: number;
  shippingFee?: number;
  grandTotal?: number;
  totalAmount?: number;
  payableAmount?: number;
}

export const invoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query<InvoiceListResponse, InvoiceQueryParams | void>({
      query: (params) => ({
        url: '/invoices',
        method: 'GET',
        params: params || undefined,
      }),
      transformResponse: (response: any) => {
        if (!response) return { items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };

        let items: InvoiceListItem[] = [];
        let meta = { page: 1, limit: 10, total: 0, totalPages: 1 };
        let summary = response.summary || response.data?.summary || undefined;

        if (Array.isArray(response)) {
          items = response;
          meta.total = items.length;
        } else if (Array.isArray(response.items)) {
          items = response.items;
          meta = response.meta || meta;
        } else if (Array.isArray(response.invoices)) {
          items = response.invoices;
          meta = response.meta || meta;
        } else if (response.data) {
          if (Array.isArray(response.data)) {
            items = response.data;
            meta.total = items.length;
          } else {
            items = response.data.items || response.data.invoices || [];
            meta = response.data.meta || response.meta || meta;
          }
        }

        return {
          items,
          meta,
          summary,
          totalInvoices: response.totalInvoices ?? summary?.totalInvoices ?? response.data?.totalInvoices,
          totalSales: response.totalSales ?? response.totalGrandTotal ?? summary?.totalSales ?? summary?.totalGrandTotal ?? response.data?.totalSales,
          todayInvoices: response.todayInvoices ?? summary?.todayInvoices ?? response.data?.todayInvoices,
          todayGrandTotal: response.todayGrandTotal ?? summary?.todayGrandTotal ?? response.data?.todayGrandTotal,
        };
      },
      providesTags: ['Orders'],
    }),

    getInvoiceByOrderId: builder.query<PublicInvoiceData, string>({
      query: (orderId) => `/invoices/${orderId}`,
      transformResponse: (response: any) => {
        return response?.data ?? response;
      },
      providesTags: (result, error, orderId) => [{ type: 'Orders', id: orderId }],
    }),

    verifyInvoiceByToken: builder.query<PublicInvoiceData, string>({
      query: (verificationToken) => `/public/invoice/${verificationToken}`,
      transformResponse: (response: any) => {
        return response?.data ?? response;
      },
    }),

    getMyInvoices: builder.query<InvoiceListItem[], void>({
      query: () => ({
        url: '/invoices/my-invoices',
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        const data = response?.data ?? response;
        return Array.isArray(data) ? data : [];
      },
      providesTags: ['Orders'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetInvoicesQuery,
  useLazyGetInvoicesQuery,
  useGetMyInvoicesQuery,
  useGetInvoiceByOrderIdQuery,
  useLazyGetInvoiceByOrderIdQuery,
  useVerifyInvoiceByTokenQuery,
} = invoiceApi;

