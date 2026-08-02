export type UserRole =
  | 'CUSTOMER'
  | 'RESELLER'
  | 'ADMIN'
  | 'SUPER_ADMIN'
  | 'admin'
  | 'user'
  | 'seller'
  | 'reseller';

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: UserRole;
  isVerified?: boolean;
  isActive?: boolean;
  profile?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isRestoring: boolean;
  refreshToken?: string | null;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface VerifyOtpInput {
  email: string;
  otp: string;
}

export interface ResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface AuthResponseData {
  user: User;
  accessToken?: string;
  refreshToken?: string;
  token?: string;
}

export interface ApiResponse<T = unknown> {
  statusCode?: number;
  success: boolean;
  message: string;
  data?: T;
}

// Backward compatibility alias
export type LoginCredentials = LoginInput;
export type AuthResponse = AuthResponseData;
