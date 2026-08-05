'use client';

import React from 'react';
import { Coupon } from '@/types/coupon';
import { useRemoveCouponMutation } from '@/services/couponApi';
import { Tag, Sparkles, X, Loader2, Calendar, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';

interface CouponCardProps {
  coupon: Coupon;
  discountAmount: number;
  onCouponRemoved: () => void;
}

export const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  discountAmount,
  onCouponRemoved,
}) => {
  const [removeCoupon, { isLoading }] = useRemoveCouponMutation();

  const handleRemove = async () => {
    if (isLoading) return;

    try {
      await removeCoupon({ code: coupon.code }).unwrap();
      onCouponRemoved();
      Swal.fire({
        icon: 'info',
        title: 'Coupon Removed',
        text: `Coupon code ${coupon.code} has been removed.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
      });
    } catch {
      // Fallback local state removal if backend responds
      onCouponRemoved();
    }
  };

  const scopeLabel =
    coupon.scope === 'SPECIFIC_CATEGORY' || coupon.scope === 'category'
      ? `Category: ${coupon.categoryName || coupon.categories?.join(', ') || 'Specific'}`
      : coupon.scope === 'SPECIFIC_PRODUCT'
      ? 'Specific Products'
      : 'Global Store Discount';

  const expiry = coupon.expiresAt || coupon.expiryDate;

  return (
    <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex flex-col gap-3 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Tag className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xs text-emerald-900 dark:text-emerald-200 tracking-wider uppercase flex items-center gap-1">
              {coupon.code}
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              {coupon.description || coupon.name || 'Promotional Discount'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRemove}
          disabled={isLoading}
          className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200/60 dark:hover:bg-emerald-900 transition cursor-pointer disabled:opacity-40"
          title="Remove Coupon"
          aria-label="Remove Coupon"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40">
        <div className="flex items-center gap-1 text-emerald-800 dark:text-emerald-300 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{scopeLabel}</span>
        </div>
        <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
          Saved -${discountAmount.toFixed(2)}
        </span>
      </div>

      {expiry && (
        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
          <Calendar className="w-3 h-3" />
          <span>Valid until {new Date(expiry).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
};

export default CouponCard;
