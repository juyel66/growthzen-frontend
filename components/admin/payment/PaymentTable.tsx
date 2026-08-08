"use client";

import React from "react";
import Link from "next/link";
import { PaymentView } from "@/types/payment";
import {
  Eye,
  CheckCircle,
  XCircle,
  RotateCcw,
  PhoneCall,
  Hash,
} from "lucide-react";

import { PaymentTableSkeletonRow } from "@/components/ui/TableSkeleton";

interface PaymentTableProps {
  payments: PaymentView[];
  onOpenDetailsModal: (payment: PaymentView) => void;
  onOpenApproveModal: (payment: PaymentView) => void;
  onOpenRejectModal: (payment: PaymentView) => void;
  onOpenRefundModal: (payment: PaymentView) => void;
  isLoading?: boolean;
}

const getPaymentCollectedBadge = (status: string | null) => {
  if (!status) return null;
  const s = status.toUpperCase();

  if (s === "PAID") {
    return (
      <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-md border tracking-wide uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60">
        Paid
      </span>
    );
  }

  if (s === "PENDING") {
    return (
      <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-md border tracking-wide uppercase bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200/60">
        Unpaid
      </span>
    );
  }

  if (["FAILED", "CANCELLED"].includes(s)) {
    return (
      <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-md border tracking-wide uppercase bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60">
        {s}
      </span>
    );
  }

  if (s === "REFUNDED") {
    return (
      <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-md border tracking-wide uppercase bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/60">
        Refunded
      </span>
    );
  }

  return (
    <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-md border tracking-wide uppercase bg-slate-100 text-slate-700 border-slate-200">
      {s}
    </span>
  );
};

const getPaymentMethodBadge = (method: string | null) => {
  if (!method) return null;
  const m = method.toUpperCase();

  let color = "bg-indigo-50 text-indigo-700 border-indigo-200";
  if (m === "COD") color = "bg-slate-100 text-slate-700 border-slate-200";
  else if (m === "BKASH") color = "bg-pink-50 text-pink-700 border-pink-200";
  else if (m === "NAGAD") color = "bg-orange-50 text-orange-700 border-orange-200";
  else if (m === "SSLCOMMERZ") color = "bg-blue-50 text-blue-700 border-blue-200";
  else if (m === "STRIPE") color = "bg-purple-50 text-purple-700 border-purple-200";

  return (
    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded border uppercase ${color}`}>
      {m}
    </span>
  );
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT", currencyDisplay: "narrowSymbol",
  }).format(val || 0);
};

const formatDate = (dateStr: string | Date) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  onOpenDetailsModal,
  onOpenApproveModal,
  onOpenRejectModal,
  onOpenRefundModal,
  isLoading = false,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/90 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 z-10">
            <tr>
              <th className="p-3.5">Payment ID</th>
              <th className="p-3.5">Order Number</th>
              <th className="p-3.5">Method</th>
              <th className="p-3.5">Amount</th>
              <th className="p-3.5">Payment Collected</th>
              <th className="p-3.5">Transaction Ref / Phone</th>
              <th className="p-3.5">Created Date</th>
              <th className="p-3.5 text-right w-[200px] min-w-[200px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, idx) => (
                <PaymentTableSkeletonRow key={idx} />
              ))
            ) : payments.length > 0 ? (
              payments.map((item) => {
                const status = (item.status || "").toUpperCase();
                const isPending = status === "PENDING";
                const isPaid = status === "PAID";
                const isRefunded = status === "REFUNDED";
                const isFailedOrCancelled = ["FAILED", "CANCELLED"].includes(status);

                // Helper tooltips for actions
                const getApproveTooltip = () => {
                  if (isPending) return "Approve Pending Payment";
                  if (isPaid) return "Payment already approved";
                  if (isRefunded) return "Payment has been refunded";
                  if (isFailedOrCancelled) return "Cannot approve failed or cancelled payment";
                  return "Approve Payment";
                };

                const getRejectTooltip = () => {
                  if (isPending) return "Reject Pending Payment";
                  if (isPaid) return "Cannot reject a paid payment";
                  if (isRefunded) return "Payment has been refunded";
                  if (isFailedOrCancelled) return "Payment already failed or cancelled";
                  return "Reject Payment";
                };

                const getRefundTooltip = () => {
                  if (isPaid) return "Issue Refund";
                  if (isRefunded) return "This payment has already been refunded.";
                  if (isPending) return "Only paid payments can be refunded.";
                  if (isFailedOrCancelled) return "Cannot refund failed or cancelled payment.";
                  return "Refund Payment";
                };

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Payment ID */}
                    <td className="p-3.5 font-mono text-slate-500 max-w-[130px] truncate">
                      {item.id}
                    </td>

                    {/* Order Code */}
                    <td className="p-3.5 whitespace-nowrap">
                      <Link
                        href={`/admin-dashboard/orders/${item.orderId}`}
                        className="font-extrabold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {item.orderNumber || item.orderId}
                      </Link>
                    </td>

                    {/* Payment Method Badge */}
                    <td className="p-3.5 whitespace-nowrap">
                      {getPaymentMethodBadge(item.method)}
                    </td>

                    {/* Amount */}
                    <td className="p-3.5 font-black text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {formatCurrency(item.paidAmount || item.totalAmount)}
                    </td>

                    {/* Payment Collected Badge */}
                    <td className="p-3.5 whitespace-nowrap">
                      {getPaymentCollectedBadge(item.status)}
                    </td>

                    {/* Transaction Ref / Sender Phone */}
                    <td className="p-3.5 whitespace-nowrap">
                      {item.transactionId ? (
                        <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-mono font-bold">
                          <Hash className="w-3 h-3 text-indigo-500" />
                          <span>{item.transactionId}</span>
                        </div>
                      ) : item.senderNumber ? (
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <PhoneCall className="w-3 h-3 text-emerald-500" />
                          <span>{item.senderNumber}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">COD / Cash Ledger</span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>

                    {/* Actions - Always rendered in exact same order */}
                    <td className="p-3.5 text-right whitespace-nowrap w-[200px] min-w-[200px]">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Details Button */}
                        <button
                          onClick={() => onOpenDetailsModal(item)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-2xs transition cursor-pointer"
                          title="View Payment Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>

                        {/* Approve Button */}
                        <button
                          disabled={!isPending}
                          onClick={isPending ? () => onOpenApproveModal(item) : undefined}
                          className={`p-1.5 rounded-lg transition ${
                            isPending
                              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 cursor-pointer"
                              : "bg-slate-100 text-slate-400 dark:bg-slate-800/60 dark:text-slate-600 opacity-40 cursor-not-allowed"
                          }`}
                          title={getApproveTooltip()}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>

                        {/* Reject Button */}
                        <button
                          disabled={!isPending}
                          onClick={isPending ? () => onOpenRejectModal(item) : undefined}
                          className={`p-1.5 rounded-lg transition ${
                            isPending
                              ? "bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400 cursor-pointer"
                              : "bg-slate-100 text-slate-400 dark:bg-slate-800/60 dark:text-slate-600 opacity-40 cursor-not-allowed"
                          }`}
                          title={getRejectTooltip()}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>

                        {/* Refund Button */}
                        <button
                          disabled={!isPaid}
                          onClick={isPaid ? () => onOpenRefundModal(item) : undefined}
                          className={`p-1.5 rounded-lg transition ${
                            isPaid
                              ? "bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-400 cursor-pointer"
                              : isRefunded
                              ? "bg-purple-50/50 text-purple-400 dark:bg-purple-950/30 dark:text-purple-500 opacity-40 cursor-not-allowed"
                              : "bg-slate-100 text-slate-400 dark:bg-slate-800/60 dark:text-slate-600 opacity-40 cursor-not-allowed"
                          }`}
                          title={getRefundTooltip()}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="p-10 text-center text-slate-400">
                  No payment records match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

