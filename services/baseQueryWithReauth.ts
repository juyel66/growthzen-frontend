import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { updateToken, logOut } from '@/features/auth/authSlice';
import { AuthState } from '@/types/auth';
import { getAccessToken } from '@/lib/tokenStorage';

interface RootState {
  auth: AuthState;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://growthzen-it-backend.onrender.com/api';

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.token || getAccessToken();
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Mutex queue mechanism to hold concurrent requests during a token refresh
let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string | null) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string | null) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const urlString = typeof args === 'string' ? args : args.url;

    // Avoid infinite refresh loops if failing request IS login, logout, refresh-token, register, etc.
    if (
      urlString.includes('/auth/refresh-token') ||
      urlString.includes('/auth/login') ||
      urlString.includes('/auth/register') ||
      urlString.includes('/auth/forgot-password') ||
      urlString.includes('/auth/reset-password')
    ) {
      return result;
    }

    // If we're already refreshing, queue concurrent requests
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          if (token) {
            resolve(baseQuery(args, api, extraOptions));
          } else {
            resolve(result);
          }
        });
      });
    }

    isRefreshing = true;

    try {
      // POST /auth/refresh-token with credentials: 'include' (sends HttpOnly refreshToken cookie)
      const refreshResult = await fetch(`${baseUrl}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (refreshResult.ok) {
        const data = await refreshResult.json();
        const payload = data?.data || data;
        const newAccessToken = payload?.accessToken || payload?.token;

        if (newAccessToken) {
          // Dispatch updated token (persists to sessionStorage as well)
          api.dispatch(
            updateToken({
              token: newAccessToken,
            })
          );

          // Trigger waiting subscribers
          onTokenRefreshed(newAccessToken);
          isRefreshing = false;

          // Retry the failed request transparently
          result = await baseQuery(args, api, extraOptions);
        } else {
          onTokenRefreshed(null);
          api.dispatch(logOut());
          isRefreshing = false;
        }
      } else {
        onTokenRefreshed(null);
        api.dispatch(logOut());
        isRefreshing = false;
      }
    } catch {
      onTokenRefreshed(null);
      api.dispatch(logOut());
      isRefreshing = false;
    }
  }

  return result;
};
