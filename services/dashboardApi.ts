import { baseApi } from './baseApi';
import { DashboardStats } from '@/types/dashboard';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, string | void>({
      query: (period) => ({
        url: '/dashboard/stats',
        params: period ? { period } : undefined,
      }),
      providesTags: ['Dashboard'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDashboardStatsQuery,
} = dashboardApi;
