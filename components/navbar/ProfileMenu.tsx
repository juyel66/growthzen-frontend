'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, LogIn, UserPlus, LayoutDashboard, ClipboardList, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser, selectIsAuthenticated } from '@/features/auth/authSlice';

export const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  
  // Connect to global auth slice. Defaults to false.
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="p-2 hover:bg-slate-100/80 rounded-full transition-all group outline-none flex items-center justify-center cursor-pointer"
        aria-label="User profile menu"
      >
        <User
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
            className="absolute right-0 mt-1 w-52 bg-white border rounded-xl shadow-xl z-50 overflow-hidden py-1.5"
            style={{
              borderColor: theme.borderColor,
            }}
          >
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 border-b text-xs text-slate-500" style={{ borderColor: theme.borderColor }}>
                  Logged in as <br />
                  <span className="font-bold text-slate-800">{user?.name || user?.email || 'User'}</span>
                </div>
                <Link
                  href="/user-dashboard/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ClipboardList className="w-4 h-4 text-slate-400" />
                  <span>My Orders</span>
                </Link>
                <hr className="my-1 border-slate-100" />
                <button
                  onClick={() => {}}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50/50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <div className="px-4 py-2 border-b text-xs text-slate-500" style={{ borderColor: theme.borderColor }}>
                  Welcome to GrowthZen
                </div>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <LogIn className="w-4 h-4 text-slate-400" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-slate-400" />
                  <span>Register</span>
                </Link>
                <hr className="my-1 border-slate-100" />
                <Link
                  href="/admin-dashboard/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  <span>Admin Dashboard</span>
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
