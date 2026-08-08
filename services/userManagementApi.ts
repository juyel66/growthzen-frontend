import { baseApi } from './baseApi';
import {
  UserManagementItem,
  UserManagementListResponse,
  UserQueryParams,
  UserStatsResponse,
} from '@/types/userManagement';

export const userManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserManagementListResponse, UserQueryParams | void>({
      query: (params) => ({
        url: '/users',
        method: 'GET',
        params: params || undefined,
      }),
      transformResponse: (response: any) => {
        if (!response) return { items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };

        let items: UserManagementItem[] = [];
        let meta = { page: 1, limit: 10, total: 0, totalPages: 1 };
        let summary = response.summary || response.data?.summary || undefined;

        if (Array.isArray(response)) {
          items = response;
          meta.total = items.length;
        } else if (Array.isArray(response.items)) {
          items = response.items;
          meta = response.meta || meta;
        } else if (Array.isArray(response.users)) {
          items = response.users;
          meta = response.meta || meta;
        } else if (response.data) {
          if (Array.isArray(response.data)) {
            items = response.data;
            meta.total = items.length;
          } else {
            items = response.data.items || response.data.users || [];
            meta = response.data.meta || response.meta || meta;
          }
        }

        return {
          items,
          meta,
          summary,
          totalUsers: response.totalUsers ?? summary?.totalUsers ?? response.data?.totalUsers,
          customersCount: response.customersCount ?? summary?.customersCount ?? response.data?.customersCount,
          adminsCount: response.adminsCount ?? summary?.adminsCount ?? response.data?.adminsCount,
          newUsersToday: response.newUsersToday ?? summary?.newUsersToday ?? response.data?.newUsersToday,
        };
      },
      providesTags: ['Users'],
    }),

    getUserStats: builder.query<UserStatsResponse, void>({
      query: () => ({
        url: '/users/stats',
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        return response?.data ?? response;
      },
      providesTags: ['Users'],
    }),

    getUserById: builder.query<UserManagementItem, string>({
      query: (id) => `/users/${id}`,
      transformResponse: (response: any) => {
        return response?.data ?? response;
      },
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),

    updateUserRole: builder.mutation<UserManagementItem, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: (result, error, { id }) => [
        'Users',
        { type: 'Users', id },
      ],
    }),

    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetUsersQuery,
  useGetUserStatsQuery,
  useGetUserByIdQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = userManagementApi;
