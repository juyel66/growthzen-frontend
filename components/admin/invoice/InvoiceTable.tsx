"use client";

import React from "react";
import { InvoiceListItem } from "@/types/invoice";
import { Eye, Printer, ExternalLink, Copy, FileText } from "lucide-react";
import { OrderTableSkeletonRow } from "@/components/ui/TableSkeleton";
import Swal from "sweetalert2";

interface InvoiceTableProps {
  invoices: InvoiceListItem[];
  onViewInvoice: (invoice: InvoiceListItem) => void;
  onPrintInvoice: (invoice: InvoiceListItem) => void;
  isLoading?: boolean;
}

const formatCurrency = (val: number | undefined | null) => {
  if (val === undefined || val === null) return "--";
  return `৳${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(val)}`;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getPaymentBadge = (statusStr?: string) => {
  const status = (statusStr || "PENDING").toUpperCase();
  if (status === "PAID") {
    return (
      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200">
        Paid
      </span>
    );
  }
  if (status === "PENDING") {
    return (
      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded uppercase bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200">
        Pending
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded uppercase bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200">
      {status}
    </span>
  );
};

const getStatusBadge = (statusStr?: string) => {
  const s = (statusStr || "PENDING").toUpperCase();
  let color = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200";

  if (s === "DELIVERED") {
    color = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200";
  } else if (s === "PENDING") {
    color = "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200";
  } else if (["CONFIRMED", "PROCESSING", "PACKED", "SHIPPED"].includes(s)) {
    color = "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200";
  } else if (s === "CANCELLED") {
    color = "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200";
  }

  return (
    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md border tracking-wide uppercase ${color}`}>
      {s}
    </span>
  );
};

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  onViewInvoice,
  onPrintInvoice,
  isLoading = false,
}) => {
  const handleOpenPublicInvoice = (item: InvoiceListItem) => {
    const token = item.verificationToken || item.token || item.invoiceNumber || item.invoiceCode || item.orderNumber;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const publicUrl = item.publicUrl || `${origin}/invoice/verify/${encodeURIComponent(token)}`;
    window.open(publicUrl, "_blank");
  };

  const handleCopyPublicLink = (item: InvoiceListItem) => {
    const token = item.verificationToken || item.token || item.invoiceNumber || item.invoiceCode || item.orderNumber;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const publicUrl = item.publicUrl || `${origin}/invoice/verify/${encodeURIComponent(token)}`;

    navigator.clipboard.writeText(publicUrl);

    Swal.fire({
      icon: "success",
      title: "Public Link Copied!",
      text: publicUrl,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/90 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 z-10">
            <tr>
              <th className="p-3.5">Invoice No</th>
              <th className="p-3.5">Order No</th>
              <th className="p-3.5">Customer</th>
              <th className="p-3.5">Phone</th>
              <th className="p-3.5">Grand Total</th>
              <th className="p-3.5">Payment</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Invoice Date</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, idx) => (
                <OrderTableSkeletonRow key={idx} />
              ))
            ) : invoices.length > 0 ? (
              invoices.map((item) => {
                const invNo = item.invoiceNumber || item.invoiceCode || `INV-${item.id.slice(0, 8)}`;
                const orderNo = item.orderNumber || item.orderCode || item.orderId || "--";
                const total = item.grandTotal ?? item.payableAmount ?? item.totalAmount ?? 0;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Invoice No */}
                    <td className="p-3.5 font-extrabold text-blue-600 dark:text-blue-400 font-mono whitespace-nowrap">
                      {invNo}
                    </td>

                    {/* Order No */}
                    <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {orderNo}
                    </td>

                    {/* Customer */}
                    <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {item.customerName || "Customer"}
                    </td>

                    {/* Phone */}
                    <td className="p-3.5 font-medium text-slate-500 whitespace-nowrap">
                      {item.customerPhone || "--"}
                    </td>

                    {/* Grand Total */}
                    <td className="p-3.5 font-black text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {formatCurrency(total)}
                    </td>

                    {/* Payment */}
                    <td className="p-3.5 whitespace-nowrap">
                      {getPaymentBadge(item.paymentStatus)}
                    </td>

                    {/* Status */}
                    <td className="p-3.5 whitespace-nowrap">
                      {getStatusBadge(item.orderStatus || item.deliveryStatus)}
                    </td>

                    {/* Invoice Date */}
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">
                      {formatDate(item.invoiceDate || item.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View */}
                        <button
                          onClick={() => onViewInvoice(item)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="View Invoice"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Print PDF */}
                        <button
                          onClick={() => onPrintInvoice(item)}
                          className="p-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition cursor-pointer"
                          title="Print Invoice PDF"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* Open Public Invoice */}
                        <button
                          onClick={() => handleOpenPublicInvoice(item)}
                          className="p-1.5 rounded-lg border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40 hover:bg-blue-100 transition cursor-pointer"
                          title="Open Public Invoice Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        {/* Copy Public Link */}
                        <button
                          onClick={() => handleCopyPublicLink(item)}
                          className="p-1.5 rounded-lg border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-950/40 hover:bg-purple-100 transition cursor-pointer"
                          title="Copy Public Invoice URL"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      No Invoices Found
                    </span>
                    <span className="text-xs text-slate-400">
                      Try adjusting your date range, search, or status filters.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
