export type ContactMessageStatus = 'UNREAD' | 'READ' | string;

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessageStats {
  totalMessages: number;
  unreadMessages: number;
  readMessages: number;
  todayMessages: number;
}

export interface ContactMessagePaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ContactMessageListResponse {
  items: ContactMessage[];
  meta: ContactMessagePaginationMeta;
  stats?: ContactMessageStats;
  summary?: ContactMessageStats;
}

export interface ContactMessageQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  dateRange?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateContactMessageInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}
