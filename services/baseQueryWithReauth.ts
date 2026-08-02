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

// A mutex-like queue mechanism to hold concurrent requests during a token refresh
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
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
    // If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          // Retry the request with the new token
          resolve(baseQuery(args, api, extraOptions));
        });
      });
    }

    const state = api.getState() as RootState;
    const refreshToken = state.auth?.refreshToken;

    if (refreshToken) {
      isRefreshing = true;

      try {
        // Direct fetch call to refresh token endpoint to avoid recursion
        const refreshResult = await fetch(`${baseUrl}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResult.ok) {
          const data = await refreshResult.json();
          const newAccessToken = data.token || data.accessToken;
          const newRefreshToken = data.refreshToken;

          // Dispatch updated credentials
          api.dispatch(
            updateToken({
              token: newAccessToken,
            })
          );

          // Trigger all waiting subscribers
          onTokenRefreshed(newAccessToken);
          isRefreshing = false;

          // Retry the failed query
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh failed - log user out
          api.dispatch(logOut());
          isRefreshing = false;
        }
      } catch (error) {
        // Network/parsing errors - log user out
        api.dispatch(logOut());
        isRefreshing = false;
      }
    } else {
      // No refresh token available - log user out
      api.dispatch(logOut());
    }
  }

  return result;
};
