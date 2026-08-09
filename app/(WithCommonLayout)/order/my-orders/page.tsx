"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGetMyOrdersQuery } from "@/services/orderApi";
import { PrivateRoute } from "@/components/auth/AuthGuards";
import { Package, Clock, CheckCircle2, Truck, XCircle, ChevronRight, RefreshCw, FileText } from "lucide-react";

export default function MyOrdersPage() {
  return (
    <PrivateRoute>
      <MyOrdersContent />
    </PrivateRoute>
  );
}

function MyOrdersContent() {
  const [page, setPage] = useState(1);
  const { data: responseData, isLoading, isError, refetch } = useGetMyOrdersQuery({ page, limit: 10 });

  const orders = Array.isArray(responseData) ? responseData : (responseData?.items || []);
  const meta = Array.isArray(responseData) ? undefined : responseData?.meta;


  const getStatusBadge = (status?: string) => {
    const s = (status || "PENDING").toUpperCase();
    switch (s) {
      case "DELIVERED":
      case "COMPLETED":
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case "SHIPPED":
      case "IN_TRANSIT":
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {s}
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            My Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1">View and track your account purchase history.</p>
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
          Loading your order history...
        </div>
      ) : isError ? (
        <div className="bg-rose-50 p-6 rounded-2xl text-rose-800 text-sm font-semibold flex items-center justify-between">
          <span>Failed to load your orders.</span>
          <button onClick={() => refetch()} className="px-3 py-1 bg-rose-600 text-white text-xs rounded-lg font-bold">
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-4">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Orders Found</h3>
            <p className="text-xs text-slate-400 mt-1">You haven't placed any orders yet.</p>
          </div>
          <Link
            href="/products"
            className="inline-block px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-blue-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const orderCode = order.orderCode || order.id;
            const totalAmount = order.payableAmount ?? order.subtotal ?? 0;
            const itemsCount = order.items?.length || 0;

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-xs transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Order Code
                    </span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                      #{orderCode}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <span className="text-xs font-semibold text-slate-400">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">
                      {itemsCount} item{itemsCount !== 1 ? "s" : ""}
                    </p>
                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      ৳{Number(totalAmount).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === "DELIVERED" && (
                      <Link
                        href={`/invoice/${order.id}`}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition"
                      >
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span>Invoice</span>
                      </Link>
                    )}

                    <Link
                      href={`/order/success?orderId=${order.id}`}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
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
