"use client";

import React from "react";
import Link from "next/link";
import { useGetMyInvoicesQuery } from "@/services/invoiceApi";
import { useGetMyOrdersQuery } from "@/services/orderApi";
import { FileText, RefreshCw, ChevronRight, ExternalLink, Printer } from "lucide-react";

export function MyInvoicesList() {
  const {
    data: invoicesData,
    isLoading: isInvLoading,
    isError: isInvError,
    refetch: refetchInvoices,
  } = useGetMyInvoicesQuery();

  const {
    data: ordersData,
    isLoading: isOrdLoading,
    isError: isOrdError,
    refetch: refetchOrders,
  } = useGetMyOrdersQuery();

  const handleRefetch = () => {
    refetchInvoices();
    refetchOrders();
  };

  const isLoading = isInvLoading && isOrdLoading;
  const isError = isInvError && isOrdError;

  const invoicesList = Array.isArray(invoicesData) ? invoicesData : [];

  const deliveredOrders = (
    Array.isArray(ordersData) ? ordersData : ordersData?.items || []
  ).filter((order: any) => (order.status || "").toUpperCase() === "DELIVERED");

  // Merge invoices and delivered orders (avoiding duplicates)
  const combinedItemsMap = new Map<string, any>();

  invoicesList.forEach((inv) => {
    const key = inv.orderId || inv.id;
    combinedItemsMap.set(key, {
      id: inv.orderId || inv.id,
      invoiceNumber: inv.invoiceNumber || `INV-${inv.orderNumber}`,
      orderNumber: inv.orderNumber || "--",
      date: inv.invoiceDate || inv.createdAt,
      grandTotal: inv.grandTotal,
      paymentStatus: inv.paymentStatus || "PAID",
      orderStatus: inv.orderStatus || "DELIVERED",
      verificationToken: inv.verificationToken,
    });
  });

  deliveredOrders.forEach((ord: any) => {
    const key = ord.id;
    if (!combinedItemsMap.has(key)) {
      combinedItemsMap.set(key, {
        id: ord.id,
        invoiceNumber: `INV-${ord.orderCode || ord.id.slice(0, 8)}`,
        orderNumber: ord.orderCode || ord.id,
        date: ord.deliveredAt || ord.createdAt,
        grandTotal: ord.payableAmount,
        paymentStatus: ord.payment?.status || "PAID",
        orderStatus: ord.status || "DELIVERED",
        verificationToken: null,
      });
    }
  });

  const displayItems = Array.from(combinedItemsMap.values());

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            My Invoices
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access and print official tax invoices for your delivered purchases.
          </p>
        </div>

        <button
          onClick={handleRefetch}
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
          <span>Failed to load invoices.</span>
          <button onClick={handleRefetch} className="px-3 py-1 bg-rose-600 text-white text-xs rounded-lg font-bold">
            Retry
          </button>
        </div>
      ) : displayItems.length === 0 ? (
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
            className="inline-block px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-700 transition"
          >
            View My Orders
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {displayItems.map((item) => {
            const formattedTotal = Number(item.grandTotal ?? 0).toFixed(2);
            const dateStr = item.date ? new Date(item.date).toLocaleDateString() : "--";

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-xs transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                      {item.invoiceNumber}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                      {item.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Order #: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.orderNumber}</span> • Date: {dateStr}
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    ৳{formattedTotal}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/invoice/${item.id}`}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-2xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Invoice</span>
                    </Link>

                    {item.verificationToken && (
                      <Link
                        href={`/invoice/verify/${item.verificationToken}`}
                        target="_blank"
                        className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition"
                        title="Public Verification Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
