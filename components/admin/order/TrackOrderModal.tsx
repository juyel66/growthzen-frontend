"use client";

import React from "react";
import { OrderView } from "@/types/order";
import { useTrackOrderQuery } from "@/services/orderApi";
import { X, Truck, CheckCircle2, Clock, MapPin, Package, Loader2 } from "lucide-react";

interface TrackOrderModalProps {
  order: OrderView | null;
  isOpen: boolean;
  onClose: () => void;
}

const STAGES = [
  { key: "PENDING", label: "Order Placed" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PROCESSING", label: "Processing" },
  { key: "PACKED", label: "Packed" },
  { key: "SHIPPED", label: "Shipped" },
  { label: "Delivered", key: "DELIVERED" },
];

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const orderCode = order?.orderCode || order?.id || "";
  const { data: trackData, isLoading } = useTrackOrderQuery(
    { orderCode },
    { skip: !isOpen || !orderCode }
  );

  if (!isOpen || !order) return null;

  const currentStatus = (trackData?.status || order.status || "PENDING").toUpperCase();
  const isCancelled = currentStatus === "CANCELLED";
  const isReturned = currentStatus === "RETURNED";

  // Determine stage index
  const getStageIndex = (st: string) => {
    switch (st) {
      case "PENDING": return 0;
      case "CONFIRMED": return 1;
      case "PROCESSING": return 2;
      case "PACKED": return 3;
      case "SHIPPED": return 4;
      case "DELIVERED": return 5;
      default: return 0;
    }
  };

  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Live Order Tracking
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              <span className="text-xs font-semibold">Fetching tracking data...</span>
            </div>
          ) : (
            <>
              {/* Order Info Bar */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Order Reference
                  </span>
                  <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                    {order.orderCode}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Current Status
                  </span>
                  <span className="text-xs font-extrabold uppercase text-slate-800 dark:text-slate-200">
                    {currentStatus}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              {isCancelled ? (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-800 text-center text-xs font-bold">
                  Order was Cancelled on {order.cancelledAt ? new Date(order.cancelledAt).toLocaleDateString() : "system record"}.
                </div>
              ) : isReturned ? (
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 text-purple-800 text-center text-xs font-bold">
                  Order was Marked as Returned.
                </div>
              ) : (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Fulfillment Progress
                  </span>

                  <div className="space-y-3 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                    {STAGES.map((st, idx) => {
                      const isDone = idx <= currentIndex;
                      const isCurrent = idx === currentIndex;

                      return (
                        <div key={st.key} className="flex items-center gap-3 relative">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center -ml-4 font-bold text-[10px] transition-colors ${
                              isCurrent
                                ? "bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950"
                                : isDone
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                            }`}
                          >
                            {isDone ? <CheckCircle2 className="w-3 h-3" /> : idx + 1}
                          </div>
                          <div>
                            <span
                              className={`text-xs font-bold ${
                                isCurrent
                                  ? "text-indigo-600 dark:text-indigo-400"
                                  : isDone
                                  ? "text-slate-800 dark:text-slate-200"
                                  : "text-slate-400"
                              }`}
                            >
                              {st.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Delivery Address Snapshot */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Destination Address</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 pl-5">
                  {order.address || order.guestAddress || "Standard Delivery Address"} (
                  {order.deliveryArea?.replace("_", " ")})
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 cursor-pointer"
          >
            Close Tracking
          </button>
        </div>
      </div>
    </div>
  );
};
