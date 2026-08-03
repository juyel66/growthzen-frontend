'use client';

import React, { useState } from 'react';
import { useApplyCouponMutation } from '@/services/couponApi';
import { Tag, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Coupon } from '@/types/coupon';
import Swal from 'sweetalert2';

interface CouponInputProps {
  cartSubtotal: number;
  onCouponApplied: (coupon: Coupon, discountAmount: number) => void;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  cartSubtotal,
  onCouponApplied,
}) => {
  const [code, setCode] = useState('');
  const [applyCoupon, { isLoading }] = useApplyCouponMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode || isLoading) return;

    setErrorMessage(null);

    try {
      const res = await applyCoupon({
        code: trimmedCode,
        cartTotal: cartSubtotal,
      }).unwrap();

      if (res.valid && res.coupon) {
        onCouponApplied(res.coupon, res.discountAmount || 0);
        setCode('');
        Swal.fire({
          icon: 'success',
          title: 'Coupon Applied!',
          text: res.message || `Coupon ${trimmedCode} applied successfully. You saved $${res.discountAmount.toFixed(2)}!`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        const msg = res.message || 'Invalid or expired coupon code.';
        setErrorMessage(msg);
        Swal.fire({
          icon: 'error',
          title: 'Invalid Coupon',
          text: msg,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3500,
        });
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      const msg = error?.data?.message || 'Could not apply coupon code. Please try again.';
      setErrorMessage(msg);
      Swal.fire({
        icon: 'error',
        title: 'Coupon Error',
        text: msg,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3500,
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleApply} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="PROMO / COUPON CODE"
            disabled={isLoading}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold tracking-wider placeholder:font-normal placeholder:tracking-normal focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all uppercase"
          />
        </div>
        <button
          type="submit"
          disabled={!code.trim() || isLoading}
          className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          <span>Apply</span>
        </button>
      </form>

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-500 font-semibold px-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default CouponInput;
