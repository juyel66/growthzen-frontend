'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCredentials, setUser, setInitialized } from '@/features/auth/authSlice';
import { useLazyGetMeQuery } from '@/services/authApi';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isInitialized, token, refreshToken } = useAppSelector((state) => state.auth);
  const [triggerGetMe] = useLazyGetMeQuery();

  useEffect(() => {
    if (isInitialized) return;

    let isMounted = true;

    const restoreSession = async () => {
      try {
        // 1. If we already have token & refreshToken, attempt getMe directly
        if (token) {
          const userRes = await triggerGetMe().unwrap();
          if (isMounted && userRes) {
            dispatch(setUser(userRes));
            return;
          }
        }

        // 2. Otherwise attempt refresh token restore
        if (refreshToken) {
          const refreshRes = await fetch(`${baseUrl}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            const payload = data?.data || data;
            const newAccessToken = payload?.accessToken || payload?.token;
            const newRefreshToken = payload?.refreshToken || refreshToken;

            if (newAccessToken && isMounted) {
              dispatch(
                setCredentials({
                  token: newAccessToken,
                  refreshToken: newRefreshToken,
                })
              );

              // Fetch user profile via GET /auth/me
              try {
                const userObj = await triggerGetMe().unwrap();
                if (isMounted && userObj) {
                  dispatch(setUser(userObj));
                }
              } catch {
                // If profile fails, leave initialized
              }
            }
          }
        }
      } catch {
        // Fallback silently if session cannot be restored
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
  }, [dispatch, isInitialized, refreshToken, token, triggerGetMe]);

  return <>{children}</>;
};

export default AuthInitializer;
