"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PaymentView } from "@/types/payment";
import { X, CreditCard, ExternalLink, Calendar, Hash, PhoneCall, AlertTriangle, ShieldCheck } from "lucide-react";

interface PaymentDetailsModalProps {
  payment: PaymentView | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatCurrency = (val: number | undefined | null) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(val || 0);
};

const formatDate = (dateStr: string | Date | undefined | null) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  payment,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Payment Audit Record
              </h3>
              <p className="text-xs text-slate-400">ID: {payment.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Status & Method Bar */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Payment Method
              </span>
              <span className="text-sm font-extrabold uppercase text-indigo-600 dark:text-indigo-400">
                {payment.method}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Current Status
              </span>
              <span className="text-xs font-black uppercase text-slate-900 dark:text-slate-100">
                {payment.status}
              </span>
            </div>
          </div>

          {/* Transaction & Reference Details */}
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
              <span className="text-slate-500">Order Reference:</span>
              <Link
                href={`/admin-dashboard/orders/${payment.orderId}`}
                className="font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>{payment.orderNumber}</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
              <span className="text-slate-500">Transaction ID:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {payment.transactionId || "N/A"}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
              <span className="text-slate-500">Sender Phone Number:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {payment.senderNumber || "N/A"}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
              <span className="text-slate-500">Paid Amount:</span>
              <span className="font-extrabold text-emerald-600 text-sm">
                {formatCurrency(payment.paidAmount || payment.totalAmount)}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500">Order Payable Total:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {formatCurrency(payment.totalAmount)}
              </span>
            </div>
          </div>

          {/* Audit Reason Alerts */}
          {payment.rejectionReason && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-800 dark:text-rose-200 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Rejection Reason:
              </span>
              <p className="italic text-slate-700 dark:text-slate-300">{payment.rejectionReason}</p>
            </div>
          )}

          {payment.refundReason && (
            <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 text-purple-800 dark:text-purple-200 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Refund Audit Reason:
              </span>
              <p className="italic text-slate-700 dark:text-slate-300">{payment.refundReason}</p>
            </div>
          )}

          {/* Screenshot Upload Preview if Available */}
          {payment.paymentScreenshot && (
            <div className="space-y-1.5 pt-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                Manual Payment Screenshot:
              </span>
              <div className="relative w-full h-48 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                <Image
                  src={payment.paymentScreenshot}
                  alt="Payment Screenshot"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="pt-2 text-[11px] text-slate-400 space-y-1 border-t border-slate-100 dark:border-slate-800">
            <p>Created: {formatDate(payment.createdAt)}</p>
            <p>Verified: {formatDate(payment.verifiedAt)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
