export type UserRole = 'CUSTOMER' | 'RESELLER' | 'ADMIN' | 'SUPER_ADMIN';

export interface UserManagementItem {
  id: string;
  name?: string | null;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  role: UserRole | string;
  avatar?: string | null;
  avatarUrl?: string | null;
  profileImage?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface UserManagementMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  totalUsers?: number;
  customersCount?: number;
  adminsCount?: number;
  todayUsersCount?: number;
  newUsersToday?: number;
}

export interface UserManagementSummary {
  totalUsers?: number | null;
  customersCount?: number | null;
  adminsCount?: number | null;
  newUsersToday?: number | null;
}

export interface UserStatsResponse {
  totalUsers?: number | null;
  totalCustomers?: number | null;
  totalAdmins?: number | null;
  totalSuperAdmins?: number | null;
  newUsersToday?: number | null;
  data?: {
    totalUsers?: number | null;
    totalCustomers?: number | null;
    totalAdmins?: number | null;
    totalSuperAdmins?: number | null;
    newUsersToday?: number | null;
  };
}

export interface UserManagementListResponse {
  items?: UserManagementItem[];
  users?: UserManagementItem[];
  data?:
    | UserManagementItem[]
    | {
        items?: UserManagementItem[];
        users?: UserManagementItem[];
        meta?: UserManagementMeta;
        summary?: UserManagementSummary;
      };
  meta?: UserManagementMeta;
  summary?: UserManagementSummary;
  totalUsers?: number | null;
  customersCount?: number | null;
  adminsCount?: number | null;
  newUsersToday?: number | null;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
