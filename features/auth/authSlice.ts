import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, UserRole } from '@/types/auth';
import { getAccessToken, setAccessToken, removeAccessToken } from '@/lib/tokenStorage';

const initialToken = getAccessToken();

const initialState: AuthState = {
  token: initialToken,
  user: null,
  role: null,
  isAuthenticated: Boolean(initialToken),
  isInitialized: false,
  isRestoring: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user?: User | null }>
    ) => {
      const { token, user } = action.payload;
      state.token = token;
      setAccessToken(token);

      if (user !== undefined) {
        state.user = user;
        state.role = user?.role || null;
      }
      state.isAuthenticated = Boolean(token);
      state.isInitialized = true;
      state.isRestoring = false;
    },

    updateToken: (
      state,
      action: PayloadAction<{ token: string }>
    ) => {
      const { token } = action.payload;
      state.token = token;
      setAccessToken(token);
      state.isAuthenticated = Boolean(token);
    },

    setUser: (state, action: PayloadAction<User | null>) => {
      const user = action.payload;
      state.user = user;
      state.role = user?.role || null;
      state.isAuthenticated = Boolean(state.token || user);
      state.isInitialized = true;
      state.isRestoring = false;
    },

    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
      if (action.payload) {
        state.isRestoring = false;
      }
    },

    setRestoring: (state, action: PayloadAction<boolean>) => {
      state.isRestoring = action.payload;
    },

    logOut: (state) => {
      state.token = null;
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.isRestoring = false;
      removeAccessToken();
    },
  },
});

export const {
  setCredentials,
  updateToken,
  setUser,
  setInitialized,
  setRestoring,
  logOut,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }): User | null => state.auth.user;
export const selectUserRole = (state: { auth: AuthState }): UserRole | null => state.auth.role;
export const selectIsAuthenticated = (state: { auth: AuthState }): boolean => state.auth.isAuthenticated;
export const selectIsAuthInitialized = (state: { auth: AuthState }): boolean => state.auth.isInitialized;
export const selectIsRestoring = (state: { auth: AuthState }): boolean => state.auth.isRestoring;
export const selectAuthToken = (state: { auth: AuthState }): string | null => state.auth.token;
export const selectIsReseller = (state: { auth: AuthState }): boolean => {
  const role = state.auth.role || state.auth.user?.role;
  return typeof role === 'string' && role.toUpperCase() === 'RESELLER';
};

