import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '@/types/auth';

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; refreshToken?: string | null; user?: User | null }>
    ) => {
      const { token, refreshToken, user } = action.payload;
      state.token = token;
      if (refreshToken !== undefined) {
        state.refreshToken = refreshToken;
      }
      if (user !== undefined) {
        state.user = user;
      }
      state.isAuthenticated = Boolean(token);
      state.isInitialized = true;
    },
    updateToken: (
      state,
      action: PayloadAction<{ token: string; refreshToken?: string }>
    ) => {
      state.token = action.payload.token;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      state.isAuthenticated = true;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(state.token || action.payload);
      state.isInitialized = true;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    logOut: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
    },
  },
});

export const { setCredentials, updateToken, setUser, setInitialized, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsAuthInitialized = (state: { auth: AuthState }) => state.auth.isInitialized;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
