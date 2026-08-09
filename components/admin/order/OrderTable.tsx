"use client";

import React from "react";
import { OrderActionButtons } from "./OrderActionButtons";
import { OrderView } from "@/types/order";
import {
  Eye,
  Edit3,
  Truck,
  XCircle,
  UserCheck,
  UserX,
} from "lucide-react";

import { OrderTableSkeletonRow } from "@/components/ui/TableSkeleton";

interface OrderTableProps {
  orders: OrderView[];
  onOpenStatusModal: (order: OrderView) => void;
  onOpenTrackModal: (order: OrderView) => void;
  onCancelOrder: (order: OrderView) => void;
  isLoading?: boolean;
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
    currency: "BDT", currencyDisplay: "narrowSymbol",
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
  isLoading = false,
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
              <th className="p-3.5">Courier Cost</th>
              <th className="p-3.5">Net Profit</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, idx) => (
                <OrderTableSkeletonRow key={idx} />
              ))
            ) : orders.length > 0 ? (
              orders.map((item) => {
                const isGuest = !item.userId || Boolean(item.guestName || item.guestEmail);
                const isCancellable = item.status === "PENDING";
                const payStatus = item.payment?.status || (item.paymentMethod === "COD" ? "PENDING" : "PENDING");
                const isDelivered = (item.status || "").toUpperCase() === "DELIVERED";
                const courierCostVal = item.courierServiceCost ?? item.courierCost;

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
                        {(item.orderedByRole === "RESELLER" || (item as any).orderRole === "RESELLER") ? (
                          <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">
                            RESELLER
                          </span>
                        ) : isGuest ? (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-amber-50 text-amber-700 border border-amber-200">
                            Guest
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-blue-50 text-blue-700 border border-blue-200">
                            Customer
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

                    {/* Courier Cost */}
                    <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {isDelivered && courierCostVal != null ? formatCurrency(courierCostVal) : "--"}
                    </td>

                    {/* Net Profit */}
                    <td className="p-3.5 font-extrabold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {isDelivered && item.netProfit != null ? formatCurrency(item.netProfit) : "--"}
                    </td>

                    {/* Date */}
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <OrderActionButtons
                        order={item}
                        onOpenStatusModal={onOpenStatusModal}
                        onOpenTrackModal={onOpenTrackModal}
                        onCancelOrder={onCancelOrder}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="p-10 text-center text-slate-400">
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

