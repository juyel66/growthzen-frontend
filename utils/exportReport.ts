import { getAccessToken } from '@/lib/tokenStorage';
import { ExportFormat, ReportQueryParams } from '@/types/report';
import Swal from 'sweetalert2';

export type ReportType =
  | 'sales'
  | 'revenue'
  | 'orders'
  | 'products'
  | 'customers'
  | 'payments'
  | 'shipping'
  | 'coupons';

export const downloadReportFile = async (
  reportType: ReportType,
  format: ExportFormat,
  queryParams: ReportQueryParams = {}
): Promise<boolean> => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    const cleanUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const exportUrl = `${cleanUrl}/reports/${reportType}/export`;

    const urlParams = new URLSearchParams();
    urlParams.append('format', format);

    if (queryParams.range) urlParams.append('range', queryParams.range);
    if (queryParams.from) urlParams.append('from', queryParams.from);
    if (queryParams.to) urlParams.append('to', queryParams.to);
    if (queryParams.search) urlParams.append('search', queryParams.search);
    if (queryParams.sortBy) urlParams.append('sortBy', queryParams.sortBy);
    if (queryParams.sortOrder) urlParams.append('sortOrder', queryParams.sortOrder);
    if (queryParams.status) urlParams.append('status', queryParams.status);
    if (queryParams.paymentMethod)
      urlParams.append('paymentMethod', queryParams.paymentMethod);

    const fullUrl = `${exportUrl}?${urlParams.toString()}`;
    const token = getAccessToken();

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let message = 'Failed to generate report export';
      try {
        const parsed = JSON.parse(errorText);
        message = parsed.message || message;
      } catch {
        // ignore JSON parse error
      }
      throw new Error(message);
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get('content-disposition');
    let filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.${format}`;

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    Swal.fire({
      icon: 'success',
      title: 'Export Successful',
      text: `${filename} downloaded successfully.`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
    });

    return true;
  } catch (error: any) {
    console.error('Export Report Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Export Failed',
      text: error?.message || 'Something went wrong while exporting the report.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
    });
    return false;
  }
};
