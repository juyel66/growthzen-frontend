export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user' | 'seller';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  otp?: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}
