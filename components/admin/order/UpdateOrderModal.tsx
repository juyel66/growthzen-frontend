"use client";

import React, { useState, useEffect } from "react";
import { OrderView, OrderStatus } from "@/types/order";
import { X, Edit3, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

interface UpdateOrderModalProps {
  order: OrderView | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateOrder: (
    orderId: string,
    status: OrderStatus,
    paymentStatus: "Paid" | "Unpaid",
    adminNote?: string,
    courierServiceCost?: number
  ) => Promise<void>;
  isLoading: boolean;
}

import { ORDER_STATUS } from "@/constants/orderStatus";

const ORDER_STATUS_OPTIONS: { label: string; value: OrderStatus }[] = [
  { label: "Pending", value: ORDER_STATUS.PENDING },
  { label: "Confirmed", value: ORDER_STATUS.CONFIRMED },
  { label: "Processing", value: ORDER_STATUS.PROCESSING },
  { label: "Packed", value: ORDER_STATUS.PACKED },
  { label: "Shipped", value: ORDER_STATUS.SHIPPED },
  { label: "Delivered", value: ORDER_STATUS.DELIVERED },
  { label: "Cancelled", value: ORDER_STATUS.CANCELLED },
  { label: "Returned", value: ORDER_STATUS.RETURNED },
];

export const UpdateOrderModal: React.FC<UpdateOrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateOrder,
  isLoading,
}) => {
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<OrderStatus>("PENDING");
  const [selectedPayment, setSelectedPayment] = useState<"Paid" | "Unpaid">("Paid");
  const [adminNote, setAdminNote] = useState<string>("");
  const [courierServiceCost, setCourierServiceCost] = useState<number | "">("");

  useEffect(() => {
    if (order) {
      const currentOrderStatus = (order.status || "PENDING") as OrderStatus;
      const isPaid = order.payment?.status === "PAID";

      setSelectedOrderStatus(currentOrderStatus);
      setSelectedPayment(isPaid ? "Paid" : "Unpaid");
      setAdminNote("");
      setCourierServiceCost(order.courierServiceCost ?? "");
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  // Auto UI Logic: When Order Status becomes Delivered -> auto set Payment = Paid. Clear courier cost if changed away from DELIVERED.
  const handleOrderStatusChange = (newStatus: OrderStatus) => {
    setSelectedOrderStatus(newStatus);
    if (newStatus === "DELIVERED") {
      setSelectedPayment("Paid");
    } else {
      setCourierServiceCost("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrderStatus === "DELIVERED") {
      if (courierServiceCost === "" || courierServiceCost === null || isNaN(Number(courierServiceCost))) {
        alert("Courier Service Cost is required for Delivered orders.");
        return;
      }
      if (Number(courierServiceCost) < 0) {
        alert("Courier Service Cost must be at least 0.");
        return;
      }
    }

    const finalCourierCost = selectedOrderStatus === "DELIVERED" && courierServiceCost !== "" ? Number(courierServiceCost) : undefined;

    await onUpdateOrder(
      order.id,
      selectedOrderStatus,
      selectedPayment,
      adminNote.trim() || undefined,
      finalCourierCost
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Update Order Workflow
              </h3>
              <p className="text-xs text-slate-500">
                Order Reference: <span className="font-extrabold text-blue-600">{order.orderCode}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Order Status Dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wider">
              Order Status
            </label>
            <select
              value={selectedOrderStatus}
              onChange={(e) => handleOrderStatusChange(e.target.value as OrderStatus)}
              className="w-full px-3.5 py-2.5 text-xs font-extrabold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              {ORDER_STATUS_OPTIONS.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Dropdown (Paid / Unpaid) */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wider">
              Payment Status
            </label>
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value as "Paid" | "Unpaid")}
              className="w-full px-3.5 py-2.5 text-xs font-extrabold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
            {selectedOrderStatus === "DELIVERED" && selectedPayment === "Paid" && (
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                ✓ Auto-set to Paid for Delivered orders (can be changed to Unpaid).
              </p>
            )}
          </div>

          {/* Courier Service Cost (Shown & Required ONLY when DELIVERED) */}
          {selectedOrderStatus === "DELIVERED" && (
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wider">
                Courier Service Cost <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="Enter courier service cost"
                value={courierServiceCost}
                onChange={(e) => setCourierServiceCost(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs font-extrabold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200 cursor-pointer"
              />
            </div>
          )}

          {/* Optional Admin Note */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Optional Admin Note
            </label>
            <textarea
              rows={3}
              placeholder="Add audit notes or fulfillment status history..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Update Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

