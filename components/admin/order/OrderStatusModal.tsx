"use client";

import React, { useState } from "react";
import { OrderView, OrderStatus } from "@/types/order";
import { X, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

import { ORDER_STATUS } from "@/constants/orderStatus";

interface OrderStatusModalProps {
  order: OrderView | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: OrderStatus, adminNote?: string) => Promise<void>;
  isLoading: boolean;
}

const STATUSES: { label: string; value: OrderStatus }[] = [
  { label: "Pending", value: ORDER_STATUS.PENDING },
  { label: "Confirmed", value: ORDER_STATUS.CONFIRMED },
  { label: "Processing", value: ORDER_STATUS.PROCESSING },
  { label: "Packed", value: ORDER_STATUS.PACKED },
  { label: "Shipped", value: ORDER_STATUS.SHIPPED },
  { label: "Delivered", value: ORDER_STATUS.DELIVERED },
  { label: "Cancelled", value: ORDER_STATUS.CANCELLED },
  { label: "Returned", value: ORDER_STATUS.RETURNED },
];

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  isLoading,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order?.status || "CONFIRMED"
  );
  const [adminNote, setAdminNote] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    await onUpdateStatus(order.id || order.orderCode, selectedStatus, adminNote);
    setShowConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Update Order Status
            </h3>
            <p className="text-xs text-slate-500">
              Order: <span className="font-bold text-blue-600">{order.orderCode}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Select New Order Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as OrderStatus);
                setShowConfirm(false);
              }}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
            >
              {STATUSES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Admin Internal Note (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Add verification notes or dispatch info..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Confirmation Warning Notice */}
          {showConfirm && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Are you sure you want to change order status from{" "}
                <span className="font-bold uppercase">{order.status}</span> to{" "}
                <span className="font-bold uppercase">{selectedStatus}</span>?
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
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
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl transition cursor-pointer ${showConfirm
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Updating...
                </>
              ) : showConfirm ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Confirm Status Change
                </>
              ) : (
                "Proceed to Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

