'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';

interface PlaceOrderButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  isSettingsLoading?: boolean;
  isSettingsError?: boolean;
  grandTotal: number;
}

export const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = ({
  isLoading,
  disabled = false,
  isSettingsLoading = false,
  isSettingsError = false,
  grandTotal,
}) => {
  return (
    <div className="flex flex-col gap-2.5">
      <button
        type="submit"
        disabled={disabled || isLoading || isSettingsLoading || isSettingsError}
        className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing Order...</span>
          </>
        ) : isSettingsLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading Delivery Charges...</span>
          </>
        ) : isSettingsError ? (
          <>
            <AlertTriangle className="w-5 h-5 text-rose-300" />
            <span>Unable to Load Delivery Charges</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-5 h-5" />
            <span>Place Order • ৳{grandTotal.toFixed(2)}</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </>
        )}
      </button>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center leading-tight">
        By placing an order, you agree to GrowthZen Trends&apos;{' '}
        <Link href="/terms-and-conditions" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
          Terms & Conditions
        </Link>{' '}
        and{' '}
        <Link href="/privacy-policy" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
          Privacy Policy
        </Link>.
      </p>
    </div>
  );
};

export default PlaceOrderButton;

