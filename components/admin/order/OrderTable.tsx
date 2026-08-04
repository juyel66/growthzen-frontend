"use client";

import React from "react";
import Link from "next/link";
import { OrderView } from "@/types/order";
import {
  Eye,
  Edit3,
  Truck,
  XCircle,
  UserCheck,
  UserX,
} from "lucide-react";

interface OrderTableProps {
  orders: OrderView[];
  onOpenStatusModal: (order: OrderView) => void;
  onOpenTrackModal: (order: OrderView) => void;
  onCancelOrder: (order: OrderView) => void;
}

const getOrderStatusBadge = (status: string | null) => {
  if (!status) return null;
  const s = status.toUpperCase();

  let color = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  if (["DELIVERED"].includes(s)) {
    color = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800";
  } else if (["PENDING"].includes(s)) {
    color = "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-800";
  } else if (["CONFIRMED", "PROCESSING"].includes(s)) {
    color = "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/60 dark:border-blue-800";
  } else if (["PACKED"].includes(s)) {
    color = "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800";
  } else if (["SHIPPED"].includes(s)) {
    color = "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/60 dark:border-purple-800";
  } else if (["CANCELLED"].includes(s)) {
    color = "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60 dark:border-rose-800";
  } else if (["RETURNED"].includes(s)) {
    color = "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300";
  }

  return (
    <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md border tracking-wide uppercase ${color}`}>
      {s}
    </span>
  );
};

const getPaymentCollectedBadge = (orderStatus: string, paymentStatus: string | null | undefined) => {
  const os = (orderStatus || "").toUpperCase();
  const ps = (paymentStatus || "PENDING").toUpperCase();

  if (ps === "PAID") {
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold rounded border uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60">
        Paid
      </span>
    );
  }

  if (os === "DELIVERED" && ps !== "PAID") {
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold rounded border uppercase bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200/60">
        Unpaid
      </span>
    );
  }

  if (ps === "FAILED" || ps === "CANCELLED") {
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold rounded border uppercase bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60">
        {ps}
      </span>
    );
  }

  if (ps === "REFUNDED") {
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold rounded border uppercase bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/60">
        Refunded
      </span>
    );
  }

  return (
    <span className="px-2 py-0.5 text-[10px] font-bold rounded border uppercase bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60">
      Pending
    </span>
  );
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(val || 0);
};

const formatDate = (dateStr: string | Date) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onOpenStatusModal,
  onOpenTrackModal,
  onCancelOrder,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/90 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 z-10">
            <tr>
              <th className="p-3.5">Order Number</th>
              <th className="p-3.5">Customer</th>
              <th className="p-3.5">Phone</th>
              <th className="p-3.5">Grand Total</th>
              <th className="p-3.5">Payment</th>
              <th className="p-3.5">Order Status</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {orders.length > 0 ? (
              orders.map((item) => {
                const isGuest = !item.userId || Boolean(item.guestName || item.guestEmail);
                const isCancellable = item.status === "PENDING";
                const payStatus = item.payment?.status || (item.paymentMethod === "COD" ? "PENDING" : "PENDING");

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Order Code */}
                    <td className="p-3.5 font-extrabold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {item.orderCode || item.id}
                    </td>

                    {/* Customer Name */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {item.customerName || item.guestName || "Guest User"}
                        </span>
                        {isGuest ? (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-50 text-amber-700 border border-amber-200">
                            Guest
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-50 text-blue-700 border border-blue-200">
                            User
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="p-3.5 font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {item.customerPhone || item.guestPhone || "-"}
                    </td>

                    {/* Grand Total */}
                    <td className="p-3.5 font-black text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {formatCurrency(item.payableAmount)}
                    </td>

                    {/* Payment Method & Collected Badge */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase">
                          {item.paymentMethod || item.payment?.method || "COD"}
                        </span>
                        {getPaymentCollectedBadge(item.status, payStatus)}
                      </div>
                    </td>

                    {/* Order Status */}
                    <td className="p-3.5 whitespace-nowrap">
                      {getOrderStatusBadge(item.status)}
                    </td>

                    {/* Date */}
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin-dashboard/orders/${item.id}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-2xs transition cursor-pointer"
                          title="View Full Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>

                        <button
                          onClick={() => onOpenStatusModal(item)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition cursor-pointer"
                          title="Update Status"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onOpenTrackModal(item)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition cursor-pointer"
                          title="Track Progress"
                        >
                          <Truck className="w-3.5 h-3.5" />
                        </button>

                        {isCancellable && (
                          <button
                            onClick={() => onCancelOrder(item)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400 transition cursor-pointer"
                            title="Cancel Order"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="p-10 text-center text-slate-400">
                  No orders match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
