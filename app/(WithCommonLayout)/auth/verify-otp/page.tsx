'use client';

import React, { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useVerifyOtpMutation, useForgotPasswordMutation } from '@/services/authApi';
import { GuestGuard } from '@/components/auth/AuthGuards';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Mail, RefreshCw, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

interface PageProps {
  searchParams: Promise<{ email?: string }>;
}

export default function VerifyOtpPage({ searchParams }: PageProps) {
  const resolvedSearchParams = use(searchParams);
  return (
    <GuestGuard>
      <VerifyOtpContent initialEmail={resolvedSearchParams.email || ''} />
    </GuestGuard>
  );
}

function VerifyOtpContent({ initialEmail }: { initialEmail: string }) {
  const router = useRouter();
  const [verifyOtpApi, { isLoading }] = useVerifyOtpMutation();
  const [forgotPasswordApi, { isLoading: isResending }] = useForgotPasswordMutation();

  const [email, setEmail] = useState(initialEmail);
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState<number>(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*৳/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.slice(-1);
    setOtpValues(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{4,6}৳/.test(pasteData)) {
      const digits = pasteData.split('');
      const newOtp = [...otpValues];
      digits.forEach((digit, idx) => {
        if (idx < 6) newOtp[idx] = digit;
      });
      setOtpValues(newOtp);
      inputRefs.current[Math.min(digits.length, 5)]?.focus();
    }
  };

  const fullOtp = otpValues.join('');

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

    if (fullOtp.length < 4) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete OTP',
        text: 'Please enter the full verification OTP code.',
      });
      return;
    }

    try {
      await verifyOtpApi({ email, otp: fullOtp }).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'OTP Verified!',
        text: 'Verification successful. Please set a new password.',
        confirmButtonText: 'Reset Password',
      }).then(() => {
        router.push(
          `/auth/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(
            fullOtp
          )}`
        );
      });
    } catch (error: any) {
      const message =
        error?.data?.message || 'Invalid or expired OTP code. Please try again.';

      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: message,
      });
    }
  };

  const handleResend = async () => {
    if (!email || countdown > 0 || isResending) return;

    try {
      await forgotPasswordApi({ email }).unwrap();
      setCountdown(60);
      Swal.fire({
        icon: 'success',
        title: 'Code Resent!',
        text: `A new OTP code has been sent to ${email}.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Resend Failed',
        text: 'Unable to resend OTP code right now. Please try again.',
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
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Verify OTP Code
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
            We sent a verification code to{' '}
            <span className="font-bold text-slate-800 dark:text-slate-200">{email || 'your email'}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {!initialEmail && (
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
          )}

          {/* 6 Digit Input Grid */}
          <div className="flex justify-between gap-2 my-2">
            {otpValues.map((val, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={val}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl font-extrabold bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition shadow-xs"
              />
            ))}
          </div>

          {/* Resend Timer & Button */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {countdown > 0 ? (
                <>Resend code in <span className="font-bold text-emerald-600">{countdown}s</span></>
              ) : (
                'Didn\'t receive the code?'
              )}
            </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || isResending}
              className="font-bold text-emerald-600 dark:text-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} /> Resend Code
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            disabled={isLoading || fullOtp.length < 4}
            className="w-full cursor-pointer font-bold mt-2 shadow-md hover:shadow-lg transition-all"
          >
            Verify Code
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

