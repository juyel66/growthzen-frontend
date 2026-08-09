import { baseApi } from './baseApi';
import {
  ContactMessage,
  ContactMessageListResponse,
  ContactMessageQueryParams,
  CreateContactMessageInput,
  ContactMessageStatus,
} from '@/types/contactMessage';

interface BackendContactListRawResponse {
  items?: ContactMessage[];
  messages?: ContactMessage[];
  data?: {
    items?: ContactMessage[];
    messages?: ContactMessage[];
    data?: ContactMessage[];
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };
    stats?: {
      totalMessages?: number;
      unreadMessages?: number;
      readMessages?: number;
      todayMessages?: number;
    };
    summary?: {
      totalMessages?: number;
      unreadMessages?: number;
      readMessages?: number;
      todayMessages?: number;
    };
    totalMessages?: number;
    unreadMessages?: number;
    readMessages?: number;
    todayMessages?: number;
  } | ContactMessage[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  stats?: {
    totalMessages?: number;
    unreadMessages?: number;
    readMessages?: number;
    todayMessages?: number;
  };
  summary?: {
    totalMessages?: number;
    unreadMessages?: number;
    readMessages?: number;
    todayMessages?: number;
  };
  totalMessages?: number;
  unreadMessages?: number;
  readMessages?: number;
  todayMessages?: number;
}

export const contactMessageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Storefront public submission endpoint: POST /contact/messages
    submitContactMessage: builder.mutation<ContactMessage, CreateContactMessageInput>({
      query: (body) => ({
        url: '/contact/messages',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ContactMessages'],
    }),

    // Admin list endpoint: GET /admin/contact-messages
    getContactMessages: builder.query<ContactMessageListResponse, ContactMessageQueryParams | void>({
      query: (params) => ({
        url: '/admin/contact-messages',
        method: 'GET',
        params: params || undefined,
      }),
      transformResponse: (response: BackendContactListRawResponse | ContactMessage[]): ContactMessageListResponse => {
        if (!response) {
          return {
            items: [],
            meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
            stats: { totalMessages: 0, unreadMessages: 0, readMessages: 0, todayMessages: 0 },
          };
        }

        let items: ContactMessage[] = [];
        let meta = { page: 1, limit: 10, total: 0, totalPages: 1 };
        let rawStats: any = null;

        let responseObj: BackendContactListRawResponse | null = Array.isArray(response) ? null : response;

        if (Array.isArray(response)) {
          items = response;
          meta.total = items.length;
        } else {
          rawStats = responseObj?.stats || responseObj?.summary;

          if (Array.isArray(responseObj?.items)) {
            items = responseObj.items;
          } else if (Array.isArray(responseObj?.messages)) {
            items = responseObj.messages;
          } else if (responseObj?.data) {
            if (Array.isArray(responseObj.data)) {
              items = responseObj.data;
            } else if (typeof responseObj.data === 'object') {
              const dataObj = responseObj.data;
              items = dataObj.items || dataObj.messages || dataObj.data || [];
              const rawMeta = dataObj.meta || responseObj.meta;
              if (rawMeta) {
                meta = {
                  page: rawMeta.page ?? 1,
                  limit: rawMeta.limit ?? 10,
                  total: rawMeta.total ?? items.length,
                  totalPages: rawMeta.totalPages ?? 1,
                };
              }
              rawStats = dataObj.stats || dataObj.summary || rawStats || dataObj;
            }
          }

          if (responseObj?.meta) {
            meta = {
              page: responseObj.meta.page ?? meta.page,
              limit: responseObj.meta.limit ?? meta.limit,
              total: responseObj.meta.total ?? items.length,
              totalPages: responseObj.meta.totalPages ?? Math.ceil((responseObj.meta.total || items.length) / (responseObj.meta.limit || 10)),
            };
          } else {
            meta.total = items.length;
            meta.totalPages = Math.max(1, Math.ceil(items.length / meta.limit));
          }
        }

        // Calculate stats fallback if backend stats are missing or incomplete
        const unreadCountFromItems = items.filter((m) => (m.status || '').toUpperCase() === 'UNREAD').length;
        const readCountFromItems = items.filter((m) => (m.status || '').toUpperCase() === 'READ').length;

        const totalMessages = rawStats?.totalMessages ?? responseObj?.totalMessages ?? meta.total ?? items.length;
        const unreadMessages = rawStats?.unreadMessages ?? responseObj?.unreadMessages ?? unreadCountFromItems;
        const readMessages = rawStats?.readMessages ?? responseObj?.readMessages ?? readCountFromItems;
        const todayMessages = rawStats?.todayMessages ?? responseObj?.todayMessages ?? 0;

        return {
          items,
          meta,
          stats: {
            totalMessages: Number(totalMessages) || 0,
            unreadMessages: Number(unreadMessages) || 0,
            readMessages: Number(readMessages) || 0,
            todayMessages: Number(todayMessages) || 0,
          },
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'ContactMessages' as const, id })),
              { type: 'ContactMessages', id: 'LIST' },
            ]
          : [{ type: 'ContactMessages', id: 'LIST' }],
    }),

    // Admin single view endpoint: GET /admin/contact-messages/:id
    getContactMessageById: builder.query<ContactMessage, string>({
      query: (id) => `/admin/contact-messages/${id}`,
      transformResponse: (response: { data?: ContactMessage } | ContactMessage): ContactMessage => {
        if ('data' in response && response.data) {
          return response.data;
        }
        return response as ContactMessage;
      },
      providesTags: (_result, _error, id) => [{ type: 'ContactMessages', id }],
    }),

    // Admin status update endpoint: PATCH /admin/contact-messages/:id/status
    updateContactMessageStatus: builder.mutation<ContactMessage, { id: string; status: ContactMessageStatus }>({
      query: ({ id, status }) => ({
        url: `/admin/contact-messages/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ContactMessages', id },
        { type: 'ContactMessages', id: 'LIST' },
        'ContactMessages',
      ],
    }),

    // Admin delete endpoint: DELETE /admin/contact-messages/:id
    deleteContactMessage: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/admin/contact-messages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'ContactMessages', id: 'LIST' },
        'ContactMessages',
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useSubmitContactMessageMutation,
  useGetContactMessagesQuery,
  useGetContactMessageByIdQuery,
  useUpdateContactMessageStatusMutation,
  useDeleteContactMessageMutation,
} = contactMessageApi;
