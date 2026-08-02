'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { UserRole } from '@/types/auth';

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
  const { isAuthenticated, isInitialized, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isInitialized && isAuthenticated && user) {
      const redirectPath = getRoleDashboardPath(user.role);
      router.replace(redirectPath);
    }
  }, [isAuthenticated, isInitialized, router, user]);

  if (!isInitialized) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

// Private Route Guard: Prevents unauthenticated users from accessing protected pages
export const PrivateRoute: React.FC<GuardProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Verifying session...</span>
        </div>
      </div>
    );
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
  const { isAuthenticated, isInitialized, user } = useAppSelector((state) => state.auth);

  const hasAccess =
    user &&
    allowedRoles.some(
      (role) => role.toUpperCase() === (user.role || '').toUpperCase()
    );

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated) {
        router.replace('/auth/login');
      } else if (!hasAccess) {
        const fallback = getRoleDashboardPath(user?.role);
        router.replace(fallback);
      }
    }
  }, [hasAccess, isAuthenticated, isInitialized, router, user]);

  if (!isInitialized || !isAuthenticated || !hasAccess) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Checking permissions...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
