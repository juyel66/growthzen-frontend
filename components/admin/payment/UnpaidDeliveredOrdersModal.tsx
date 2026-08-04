"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { OrderView } from "@/types/order";
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from "@/services/orderApi";
import { useApprovePaymentMutation } from "@/services/paymentApi";
import { X, Search, CheckCircle, Eye, AlertCircle, MapPin, Phone, Loader2, PackageCheck } from "lucide-react";
import Swal from "sweetalert2";

interface UnpaidDeliveredOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(val || 0);
};

const formatDate = (dateStr: string | Date | undefined) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const UnpaidDeliveredOrdersModal: React.FC<UnpaidDeliveredOrdersModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [search, setSearch] = useState<string>("");

  // Query delivered orders
  const { data: responseData, isLoading, refetch } = useGetOrdersQuery(
    { status: "DELIVERED", limit: 100 },
    { skip: !isOpen }
  );

  const [approvePayment, { isLoading: isApproving }] = useApprovePaymentMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const allDeliveredOrders = responseData?.items || [];

  // Filter delivered orders where Payment Status is NOT Paid
  const unpaidDeliveredOrders = useMemo(() => {
    let list = allDeliveredOrders.filter((o) => {
      const payStatus = (o.payment?.status || (o.paymentMethod === "COD" ? "PENDING" : "PENDING")).toUpperCase();
      return payStatus !== "PAID";
    });

    if (search.trim()) {
      const query = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderCode.toLowerCase().includes(query) ||
          (o.customerName || o.guestName || "").toLowerCase().includes(query) ||
          (o.customerPhone || o.guestPhone || "").toLowerCase().includes(query)
      );
    }

    return list;
  }, [allDeliveredOrders, search]);

  if (!isOpen) return null;

  const handleMarkPaid = async (order: OrderView) => {
    try {
      if (order.payment?.id) {
        await approvePayment(order.payment.id).unwrap();
      } else {
        // Fallback: update order status history admin note
        await updateOrderStatus({
          id: order.id,
          status: "DELIVERED",
          adminNote: "Payment marked as collected/paid by admin.",
        }).unwrap();
      }

      Swal.fire({
        icon: "success",
        title: "Marked as Paid",
        text: `Order ${order.orderCode} payment status updated to PAID.`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });
      refetch();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err?.data?.message || "Could not mark payment as paid.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-orange-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Unpaid Delivered Orders Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Delivered orders awaiting payment collection verification ({unpaidDeliveredOrders.length})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Order #, Customer Name, or Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
              <span className="text-xs font-semibold">Loading unpaid delivered orders...</span>
            </div>
          ) : unpaidDeliveredOrders.length > 0 ? (
            <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/90 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Order Code</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Area / Address</th>
                    <th className="p-3">Grand Total</th>
                    <th className="p-3">Delivery Date</th>
                    <th className="p-3">Payment Collected</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {unpaidDeliveredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-extrabold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {order.orderCode}
                      </td>

                      <td className="p-3 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {order.customerName || order.guestName || "Guest User"}
                      </td>

                      <td className="p-3 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Phone className="w-3 h-3 text-emerald-500" />
                          <span>{order.customerPhone || order.guestPhone || "-"}</span>
                        </div>
                      </td>

                      <td className="p-3 max-w-[160px] truncate">
                        <div className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3 h-3 text-rose-500 flex-shrink-0" />
                          <span className="truncate">{order.address || order.guestAddress || "-"}</span>
                        </div>
                      </td>

                      <td className="p-3 font-black text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {formatCurrency(order.payableAmount)}
                      </td>

                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        {formatDate(order.deliveredAt || order.createdAt)}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded border uppercase bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200">
                          Unpaid (Delivered)
                        </span>
                      </td>

                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleMarkPaid(order)}
                            disabled={isApproving}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-2xs cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Mark Paid</span>
                          </button>

                          <Link
                            href={`/admin-dashboard/orders/${order.id}`}
                            className="p-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                            title="View Order"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400 gap-2">
              <AlertCircle className="w-8 h-8 text-emerald-500" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                All delivered orders have been fully paid & verified!
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 cursor-pointer"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
