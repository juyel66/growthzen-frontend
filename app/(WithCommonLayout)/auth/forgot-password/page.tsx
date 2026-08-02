'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForgotPasswordMutation } from '@/services/authApi';
import { GuestGuard } from '@/components/auth/AuthGuards';
import { Button } from '@/components/ui/button';
import { KeyRound, Mail, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ForgotPasswordPage() {
  return (
    <GuestGuard>
      <ForgotPasswordContent />
    </GuestGuard>
  );
}

function ForgotPasswordContent() {
  const router = useRouter();
  const [forgotPasswordApi, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: 'warning',
        title: 'Email Required',
        text: 'Please enter your registered email address.',
      });
      return;
    }

    try {
      await forgotPasswordApi({ email }).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'OTP Sent!',
        text: `Verification OTP code has been sent to ${email}.`,
        confirmButtonText: 'Verify OTP',
      }).then(() => {
        router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
      });
    } catch (error: any) {
      const message =
        error?.data?.message || 'Failed to send OTP code. Please check your email and try again.';

      Swal.fire({
        icon: 'error',
        title: 'Request Failed',
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
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
            Enter your account email address below and we will send you a verification OTP code.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full cursor-pointer font-bold mt-2 shadow-md hover:shadow-lg transition-all"
          >
            Send Verification Code
          </Button>
        </form>

        {/* Back Link */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
