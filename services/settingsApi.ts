import { baseApi } from './baseApi';
import { Settings } from '@/types/settings';

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<Settings, void>({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation<Settings, Partial<Settings>>({
      query: (body) => ({
        url: '/settings',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = settingsApi;
