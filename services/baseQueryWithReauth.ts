import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { updateToken, logOut } from '@/features/auth/authSlice';
import { AuthState } from '@/types/auth';

interface RootState {
  auth: AuthState;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.token;
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
    // Avoid infinite refresh loops if the failing request IS the refresh token call itself
    const urlString = typeof args === 'string' ? args : args.url;
    if (urlString.includes('/auth/refresh-token') || urlString.includes('/auth/login')) {
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

    const state = api.getState() as RootState;
    const refreshTokenValue = state.auth?.refreshToken;

    isRefreshing = true;

    try {
      // POST /auth/refresh-token endpoint
      const refreshResult = await fetch(`${baseUrl}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue || '' }),
      });

      if (refreshResult.ok) {
        const data = await refreshResult.json();
        const payload = data?.data || data;
        const newAccessToken = payload?.accessToken || payload?.token;
        const newRefreshToken = payload?.refreshToken || refreshTokenValue;

        if (newAccessToken) {
          // Dispatch updated token
          api.dispatch(
            updateToken({
              token: newAccessToken,
              refreshToken: newRefreshToken,
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
