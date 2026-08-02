'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLoginMutation, useLazyGetMeQuery } from '@/services/authApi';
import { useAppDispatch } from '@/redux/hooks';
import { setCredentials, setUser } from '@/features/auth/authSlice';
import { GuestGuard, getRoleDashboardPath } from '@/components/auth/AuthGuards';
import { Button } from '@/components/ui/button';
import { LogIn, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';

export default function LoginPage() {
  return (
    <GuestGuard>
      <LoginContent />
    </GuestGuard>
  );
}

function LoginContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loginApi, { isLoading }] = useLoginMutation();
  const [triggerGetMe] = useLazyGetMeQuery();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter both email and password.',
      });
      return;
    }

    try {
      // 1. Call POST /auth/login
      const result = await loginApi({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      }).unwrap();

      const accessToken = result.accessToken || result.token || '';
      const refreshToken = result.refreshToken || '';

      if (accessToken) {
        // Store Access Token strictly in Redux memory
        dispatch(
          setCredentials({
            token: accessToken,
            refreshToken,
            user: result.user || null,
          })
        );
      }

      // 2. Call GET /auth/me to load current user details into Redux
      let currentUser = result.user;
      try {
        const profile = await triggerGetMe().unwrap();
        if (profile) {
          currentUser = profile;
          dispatch(setUser(profile));
        }
      } catch {
        // Fallback to login response user
      }

      Swal.fire({
        icon: 'success',
        title: 'Welcome Back!',
        text: `Logged in successfully as ${currentUser?.name || currentUser?.email || 'User'}.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
      });

      // 3. Role-based redirect
      const targetPath = getRoleDashboardPath(currentUser?.role);
      router.push(targetPath);
    } catch (error: any) {
      const status = error?.status;
      const message =
        error?.data?.message ||
        (status === 401
          ? 'Invalid email or password.'
          : status === 404
          ? 'User account not found.'
          : 'Failed to sign in. Please try again.');

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: message,
      });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50/50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col gap-6"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
            <LogIn className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign in to GrowthZen
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your credentials to access your account dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
              Remember me on this device
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full cursor-pointer font-bold mt-2 shadow-md hover:shadow-lg transition-all"
          >
            Sign In
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
            Create an account
          </Link>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Secured by Enterprise OAuth2 & JWT Token Encryption</span>
        </div>
      </motion.div>
    </div>
  );
}
