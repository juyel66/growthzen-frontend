"use client";

import React from "react";
import { OrderStatus } from "@/types/order";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";

interface OrderTimelineProps {
  status: OrderStatus | string;
}

const STAGES = [
  { key: "PENDING", label: "Pending" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PROCESSING", label: "Processing" },
  { key: "PACKED", label: "Packed" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status }) => {
  const s = (status || "PENDING").toUpperCase();

  if (s === "CANCELLED") {
    return (
      <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center gap-3">
        <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold">Order Cancelled</h4>
          <p className="text-xs text-rose-600 dark:text-rose-400">
            This order has been cancelled and will not undergo further fulfillment steps.
          </p>
        </div>
      </div>
    );
  }

  if (s === "RETURNED") {
    return (
      <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200 flex items-center gap-3">
        <RotateCcw className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold">Order Returned</h4>
          <p className="text-xs text-purple-600 dark:text-purple-400">
            This order was returned back to inventory.
          </p>
        </div>
      </div>
    );
  }

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

  const currentIndex = getStageIndex(s);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
        Order Fulfillment Timeline
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {STAGES.map((st, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div
              key={st.key}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                isCurrent
                  ? "bg-blue-600 text-white border-blue-600 font-bold shadow-md scale-[1.02]"
                  : isDone
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-800"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCurrent
                    ? "bg-white text-blue-600"
                    : isDone
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                }`}
              >
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
              </div>

              <span className="text-xs font-semibold">{st.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
