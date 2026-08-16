import { getAccessToken } from '@/lib/tokenStorage';
import { ExportFormat, ReportQueryParams } from '@/types/report';
import Swal from 'sweetalert2';

export const downloadReportExport = async (
  reportType: 'sales' | 'revenue' | 'orders' | 'products' | 'customers' | 'payments' | 'shipping' | 'coupons',
  format: ExportFormat,
  queryParams: ReportQueryParams = {}
): Promise<void> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');

  
    const params = new URLSearchParams();
    params.append('format', format);

    if (queryParams.range) params.append('range', queryParams.range);
    if (queryParams.from) params.append('from', queryParams.from);
    if (queryParams.to) params.append('to', queryParams.to);
    if (queryParams.search) params.append('search', queryParams.search);
    if (queryParams.sortBy) params.append('sortBy', queryParams.sortBy);
    if (queryParams.sortOrder) params.append('sortOrder', queryParams.sortOrder);
    if (queryParams.status) params.append('status', queryParams.status);
    if (queryParams.paymentMethod) params.append('paymentMethod', queryParams.paymentMethod);

    const token = getAccessToken();
    const endpoint = `${cleanBaseUrl}/reports/${reportType}/export?${params.toString()}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `Failed to export ${reportType} report`;
      try {
        const jsonErr = JSON.parse(errorText);
        errorMsg = jsonErr.message || errorMsg;
      } catch {
        // ignore parse error
      }
      throw new Error(errorMsg);
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get('Content-Disposition');
    let fileName = `${reportType}_report_${new Date().toISOString().split('T')[0]}.${format}`;

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        fileName = match[1];
      }
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    Swal.fire({
      icon: 'success',
      title: 'Export Successful',
      text: `File ${fileName} downloaded successfully!`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
    });
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Export Failed',
      text: error.message || 'An error occurred while downloading report.',
    });
  }
};
