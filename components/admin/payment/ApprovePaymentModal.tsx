"use client";

import React from "react";
import { PaymentView } from "@/types/payment";
import { X, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

interface ApprovePaymentModalProps {
  payment: PaymentView | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (paymentId: string) => Promise<void>;
  isLoading: boolean;
}

export const ApprovePaymentModal: React.FC<ApprovePaymentModalProps> = ({
  payment,
  isOpen,
  onClose,
  onApprove,
  isLoading,
}) => {
  if (!isOpen || !payment) return null;

  const handleConfirm = async () => {
    await onApprove(payment.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Approve Payment
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Are you sure you want to approve payment for order{" "}
              <span className="font-bold">{payment.orderNumber}</span>?
            </span>
          </div>

          <div className="space-y-1 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
            <p>Method: <span className="font-bold">{payment.method}</span></p>
            <p>Amount: <span className="font-bold text-emerald-600">৳{payment.paidAmount || payment.totalAmount}</span></p>
            {payment.transactionId && <p>Transaction ID: <span className="font-mono">{payment.transactionId}</span></p>}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
              <span>Approve & Verify</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

