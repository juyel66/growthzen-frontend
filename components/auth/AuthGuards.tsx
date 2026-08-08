'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { UserRole } from '@/types/auth';
import SessionRestoreLoader from './SessionRestoreLoader';

import { getPendingRedirectUrl, sanitizeRedirectUrl } from '@/hooks/useProtectedAction';

export function getRoleDashboardPath(role?: UserRole | string | null): string {
  if (!role) return '/user-dashboard/dashboard';

  const normalized = role.toUpperCase();
  if (normalized === 'ADMIN' || normalized === 'SUPER_ADMIN') {
    return '/admin-dashboard/dashboard';
  }
  if (normalized === 'RESELLER') {
    return '/user-dashboard/dashboard';
  }
  return '/user-dashboard/dashboard';
}

interface GuardProps {
  children: React.ReactNode;
}

// Guest Guard: Prevents logged-in users from accessing Login, Register, Forgot Password, etc.
export const GuestGuard: React.FC<GuardProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, isRestoring, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isInitialized && !isRestoring && isAuthenticated && user) {
      // Check for pending return URL in sessionStorage or URL search query first
      const pendingUrl = getPendingRedirectUrl();
      const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const redirectParam = searchParams?.get('redirect');

      const target = pendingUrl || (redirectParam ? sanitizeRedirectUrl(redirectParam) : null);

      if (target) {
        router.replace(target);
      } else {
        const fallback = getRoleDashboardPath(user.role);
        router.replace(fallback);
      }
    }
  }, [isAuthenticated, isInitialized, isRestoring, router, user]);

  if (!isInitialized || isRestoring) {
    return <SessionRestoreLoader message="Verifying session..." />;
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

// Private Route Guard: Prevents unauthenticated users from accessing protected pages
export const PrivateRoute: React.FC<GuardProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, isRestoring } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isInitialized && !isRestoring && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isInitialized, isRestoring, router]);

  if (!isInitialized || isRestoring) {
    return <SessionRestoreLoader message="Verifying session security..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

// Role Guard: Restricts access by user role
interface RoleGuardProps extends GuardProps {
  allowedRoles: UserRole[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, isRestoring, user } = useAppSelector((state) => state.auth);

  const hasAccess =
    user &&
    allowedRoles.some(
      (role) => role.toUpperCase() === (user.role || '').toUpperCase()
    );

  useEffect(() => {
    if (isInitialized && !isRestoring) {
      if (!isAuthenticated) {
        router.replace('/auth/login');
      } else if (!hasAccess) {
        const fallback = getRoleDashboardPath(user?.role);
        router.replace(fallback);
      }
    }
  }, [hasAccess, isAuthenticated, isInitialized, isRestoring, router, user]);

  if (!isInitialized || isRestoring) {
    return <SessionRestoreLoader message="Checking security permissions..." />;
  }

  if (!isAuthenticated || !hasAccess) {
    return null;
  }

  return <>{children}</>;
};

