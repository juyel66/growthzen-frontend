"use client";

import React, { useState } from "react";
import { PaymentView } from "@/types/payment";
import { X, RotateCcw, AlertTriangle, Loader2 } from "lucide-react";

interface RefundPaymentModalProps {
  payment: PaymentView | null;
  isOpen: boolean;
  onClose: () => void;
  onRefund: (paymentId: string, reason: string) => Promise<void>;
  isLoading: boolean;
}

export const RefundPaymentModal: React.FC<RefundPaymentModalProps> = ({
  payment,
  isOpen,
  onClose,
  onRefund,
  isLoading,
}) => {
  const [reason, setReason] = useState<string>("");

  if (!isOpen || !payment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    await onRefund(payment.id, reason.trim());
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Issue Payment Refund
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 text-purple-800 dark:text-purple-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <span>
              Issuing refund for order <span className="font-bold">{payment.orderNumber}</span> will record this transaction as REFUNDED.
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Reason for Refund *
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Customer returned goods in original condition. Funds sent via bKash..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !reason.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
              <span>Confirm & Issue Refund</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

