import { baseApi } from './baseApi';
import { ReportData, ReportQueryParams } from '@/types/report';

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query<ReportData[], void>({
      query: () => '/reports',
      providesTags: ['Reports'],
    }),
    generateReport: builder.mutation<ReportData, ReportQueryParams>({
      query: (params) => ({
        url: '/reports/generate',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['Reports'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetReportsQuery,
  useGenerateReportMutation,
} = reportApi;
