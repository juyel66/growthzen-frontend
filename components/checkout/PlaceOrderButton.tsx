'use client';

import React from 'react';
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

interface PlaceOrderButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  grandTotal: number;
}

export const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = ({
  isLoading,
  disabled = false,
  grandTotal,
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing Order...</span>
        </>
      ) : (
        <>
          <ShieldCheck className="w-5 h-5" />
          <span>Place Order • ${grandTotal.toFixed(2)}</span>
          <ArrowRight className="w-5 h-5 ml-1" />
        </>
      )}
    </button>
  );
};

export default PlaceOrderButton;
