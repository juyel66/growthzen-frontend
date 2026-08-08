'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User as UserIcon, LogIn, UserPlus, LayoutDashboard, ClipboardList, LogOut, KeyRound } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectCurrentUser, selectIsAuthenticated, logOut } from '@/features/auth/authSlice';
import { useLogoutMutation } from '@/services/authApi';
import { baseApi } from '@/services/baseApi';
import { getRoleDashboardPath } from '@/components/auth/AuthGuards';
import Swal from 'sweetalert2';

export const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // Ignore network errors on logout API call
    } finally {
      dispatch(logOut());
      dispatch(baseApi.util.resetApiState());
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been successfully logged out.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
      });
      router.push('/auth/login');
    }
  };

  const dashboardPath = getRoleDashboardPath(user?.role);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="p-2 hover:bg-slate-100/80 dark:hover:bg-slate-800 rounded-full transition-all group outline-none flex items-center justify-center cursor-pointer"
        aria-label="User profile menu"
      >
        <UserIcon
          className="w-5.5 h-5.5 transition-all group-hover:scale-105"
          style={{ color: theme.textColor }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-1 w-56 bg-white dark:bg-slate-900 border rounded-xl shadow-xl z-50 overflow-hidden py-1.5"
            style={{
              borderColor: theme.borderColor,
            }}
          >
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 border-b text-xs text-slate-500 dark:text-slate-400" style={{ borderColor: theme.borderColor }}>
                  Logged in as <br />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{user?.name || user?.email || 'User'}</span>
                  {user?.role && (
                    <span className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {user.role}
                    </span>
                  )}
                </div>
                <Link
                  href={dashboardPath}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/auth/change-password"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-slate-400" />
                  <span>Change Password</span>
                </Link>
                <hr className="my-1 border-slate-100 dark:border-slate-800" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <div className="px-4 py-2 border-b text-xs text-slate-500 dark:text-slate-400" style={{ borderColor: theme.borderColor }}>
                  Welcome to GrowthZen
                </div>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <LogIn className="w-4 h-4 text-slate-400" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-slate-400" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ProfileMenu;

