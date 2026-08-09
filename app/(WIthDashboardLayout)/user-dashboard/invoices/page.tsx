"use client";

import React from "react";
import Link from "next/link";
import { useGetMyInvoicesQuery } from "@/services/invoiceApi";
import { PrivateRoute } from "@/components/auth/AuthGuards";
import { FileText, RefreshCw, ChevronRight, AlertCircle, Printer, Eye } from "lucide-react";

export default function UserInvoicesPage() {
  return (
    <PrivateRoute>
      <UserInvoicesContent />
    </PrivateRoute>
  );
}

function UserInvoicesContent() {
  const { data: invoices, isLoading, isError, refetch } = useGetMyInvoicesQuery();
  const invoiceList = Array.isArray(invoices) ? invoices : [];

  const formatCurrency = (val: number | undefined | null) => {
    if (val === undefined || val === null) return "৳0.00";
    return `৳${Number(val).toFixed(2)}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "--";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              My Invoices
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Access and print official tax invoices for your delivered purchases.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-100 dark:border-slate-800 text-center text-slate-400 font-semibold animate-pulse">
          Loading your invoices...
        </div>
      ) : isError ? (
        <div className="bg-rose-50 p-6 rounded-2xl text-rose-800 text-sm font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>Failed to load invoices.</span>
          </div>
          <button onClick={() => refetch()} className="px-3 py-1 bg-rose-600 text-white text-xs rounded-lg font-bold">
            Retry
          </button>
        </div>
      ) : invoiceList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-4">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Invoices Available</h3>
            <p className="text-xs text-slate-400 mt-1">
              Invoices are automatically generated once your orders are marked as Delivered.
            </p>
          </div>
          <Link
            href="/order/my-orders"
            className="inline-block px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-2xs hover:bg-blue-700 transition"
          >
            View My Orders
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/90 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4">Invoice No</th>
                  <th className="p-4">Order No</th>
                  <th className="p-4">Invoice Date</th>
                  <th className="p-4">Grand Total</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4">Order Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {invoiceList.map((item) => {
                  const invId = item.id || item.orderId;
                  const invNo = item.invoiceNumber || item.invoiceCode || `INV-${item.orderNumber || item.id?.slice(0, 8)}`;
                  const orderNo = item.orderNumber || item.orderCode || item.orderId || "--";
                  const total = item.grandTotal ?? item.payableAmount ?? 0;
                  const payStatus = (item.paymentStatus || "PAID").toUpperCase();
                  const ordStatus = (item.orderStatus || item.deliveryStatus || "DELIVERED").toUpperCase();

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <td className="p-4 font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                        {invNo}
                      </td>
                      <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                        {orderNo}
                      </td>
                      <td className="p-4 text-slate-500">
                        {formatDate(item.invoiceDate || item.createdAt)}
                      </td>
                      <td className="p-4 font-black text-slate-900 dark:text-slate-100">
                        {formatCurrency(total)}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-md uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {payStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-md uppercase bg-blue-50 text-blue-700 border border-blue-200">
                          {ordStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/user-dashboard/invoices/${invId}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-2xs"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Invoice</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
