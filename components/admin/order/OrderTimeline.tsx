"use client";

import React from "react";
import { OrderStatus } from "@/types/order";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";

interface OrderTimelineProps {
  status: OrderStatus | string;
  productCost?: number | null;
  courierServiceCost?: number | null;
  courierCost?: number | null;
  deliveryProfit?: number | null;
  courierProfit?: number | null;
  netProfit?: number | null;
}

const STAGES = [
  { key: "PENDING", label: "Pending" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PROCESSING", label: "Processing" },
  { key: "PACKED", label: "Packed" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

const formatCurrency = (val: number | null | undefined) => {
  if (val === null || val === undefined) return "--";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT", currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 2,
  }).format(val);
};

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  status,
  productCost,
  courierServiceCost,
  courierCost,
  deliveryProfit,
  courierProfit,
  netProfit,
}) => {
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
  const costVal = courierServiceCost ?? courierCost;
  const profitVal = deliveryProfit ?? courierProfit;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
      {/* Stages Stepper Progress Bar */}
      <div className="relative flex items-center justify-between">
        {/* Background Track Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0" />
        
        {/* Active Track Progress Line */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
        />

        {STAGES.map((stage, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={stage.key} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-600 text-white shadow-xs ring-4 ring-emerald-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <span
                className={`text-xs font-bold tracking-tight ${
                  isCurrent
                    ? "text-emerald-600 dark:text-emerald-400"
                    : isCompleted
                    ? "text-slate-800 dark:text-slate-200"
                    : "text-slate-400"
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Delivered Accounting Details Banner */}
      {s === "DELIVERED" && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                Order Update History - Delivered Accounting
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Backend transaction ledger metrics upon order delivery
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Product Cost</span>
              <span className="font-extrabold text-slate-900 dark:text-slate-100">
                {productCost != null ? formatCurrency(productCost) : "--"}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Courier Cost</span>
              <span className="font-extrabold text-slate-900 dark:text-slate-100">
                {costVal != null ? formatCurrency(costVal) : "--"}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Courier Profit</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400">
                {profitVal != null ? formatCurrency(profitVal) : "--"}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Net Profit</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                {netProfit != null ? formatCurrency(netProfit) : "--"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

