export interface ReportData {
  reportId: string;
  reportType: 'sales' | 'inventory' | 'customers' | 'transactions';
  startDate: string;
  endDate: string;
  generatedAt: string;
  summary: {
    totalRecords: number;
    aggregateValue: number;
  };
  details: Array<Record<string, unknown>>;
}

export interface ReportQueryParams {
  type: 'sales' | 'inventory' | 'customers' | 'transactions';
  startDate: string;
  endDate: string;
  format?: 'json' | 'csv' | 'pdf';
}
