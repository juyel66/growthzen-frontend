export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  invoiceCode?: string;
  orderNumber: string;
  orderCode?: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  grandTotal: number;
  totalAmount?: number;
  payableAmount?: number;
  paymentStatus: string;
  orderStatus: string;
  deliveryStatus?: string;
  invoiceDate: string;
  createdAt?: string;
  verificationToken?: string;
  token?: string;
  publicUrl?: string;
}

export interface InvoiceSummaryData {
  totalInvoices?: number | null;
  totalSales?: number | null;
  totalGrandTotal?: number | null;
  todayInvoices?: number | null;
  todaySales?: number | null;
  todayGrandTotal?: number | null;
}

export interface InvoiceMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface InvoiceListResponse {
  items?: InvoiceListItem[];
  invoices?: InvoiceListItem[];
  data?:
    | InvoiceListItem[]
    | {
        items?: InvoiceListItem[];
        invoices?: InvoiceListItem[];
        meta?: InvoiceMeta;
        summary?: InvoiceSummaryData;
      };
  meta?: InvoiceMeta;
  summary?: InvoiceSummaryData;
  totalInvoices?: number | null;
  totalSales?: number | null;
  totalGrandTotal?: number | null;
  todayInvoices?: number | null;
  todayGrandTotal?: number | null;
}

export interface InvoiceQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  dateRange?: string;
  paymentStatus?: string;
  orderStatus?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}
