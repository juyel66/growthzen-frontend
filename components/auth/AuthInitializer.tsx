'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateToken, setUser, setInitialized, logOut } from '@/features/auth/authSlice';
import { useLazyGetMeQuery } from '@/services/authApi';
import { getAccessToken } from '@/lib/tokenStorage';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000//api';

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector((state) => state.auth);
  const [triggerGetMe] = useLazyGetMeQuery();

  useEffect(() => {
    if (isInitialized) return;

    let isMounted = true;

    const restoreSession = async () => {
      const savedToken = getAccessToken();

      try {
        // Step 1: If Access Token exists in sessionStorage, restore & verify via GET /auth/me
        if (savedToken) {
          dispatch(updateToken({ token: savedToken }));

          try {
            const userRes = await triggerGetMe().unwrap();
            if (isMounted && userRes) {
              dispatch(setUser(userRes));
              return;
            }
          } catch (meError: any) {
            // If GET /auth/me returned 401, proceed to refresh token restore
          }
        }

        // Step 2: Attempt Refresh Token restore via HttpOnly Cookie (POST /auth/refresh-token)
        const refreshRes = await fetch(`${baseUrl}/auth/refresh-token`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          const payload = data?.data || data;
          const newAccessToken = payload?.accessToken || payload?.token;

          if (newAccessToken && isMounted) {
            dispatch(updateToken({ token: newAccessToken }));

            // Fetch user profile after token refresh
            try {
              const userObj = await triggerGetMe().unwrap();
              if (isMounted && userObj) {
                dispatch(setUser(userObj));
                return;
              }
            } catch {
              // If profile fetch fails after refresh
            }
          }
        }

        // Step 3: If session restoration fails completely, clear state
        if (isMounted) {
          dispatch(logOut());
        }
      } catch {
        if (isMounted) {
          dispatch(logOut());
        }
      } finally {
        if (isMounted) {
          dispatch(setInitialized(true));
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [dispatch, isInitialized, triggerGetMe]);

  return <>{children}</>;
};

export default AuthInitializer;

