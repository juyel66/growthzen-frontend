"use client";

import React from "react";
import Link from "next/link";
import { Eye, Edit3, Truck, XCircle } from "lucide-react";
import { OrderView } from "@/types/order";
import {
  canView,
  canEdit,
  canTrack,
  canCancel,
  getEditDisabledReason,
  getTrackDisabledReason,
  getCancelDisabledReason,
} from "@/utils/orderPermissions";

export interface OrderActionButtonsProps {
  order: OrderView;
  onOpenStatusModal?: (order: OrderView) => void;
  onOpenTrackModal?: (order: OrderView) => void;
  onCancelOrder?: (order: OrderView) => void;
  viewHref?: string;
  className?: string;
}

export const OrderActionButtons: React.FC<OrderActionButtonsProps> = ({
  order,
  onOpenStatusModal,
  onOpenTrackModal,
  onCancelOrder,
  viewHref,
  className = "",
}) => {
  const allowView = canView(order);
  const allowEdit = canEdit(order);
  const allowTrack = canTrack(order);
  const allowCancel = canCancel(order);

  const editDisabledReason = getEditDisabledReason(order);
  const trackDisabledReason = getTrackDisabledReason(order);
  const cancelDisabledReason = getCancelDisabledReason(order);

  const targetViewHref = viewHref || `/admin-dashboard/orders/${order.id}`;

  return (
    <div className={`flex items-center justify-end gap-1.5 ${className}`}>
      {/* 1. VIEW ACTION (Always Enabled) */}
      <Link
        href={targetViewHref}
        onClick={() => console.log("Order Table Row (View clicked):", order)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-2xs transition cursor-pointer flex-shrink-0"
        title="View Full Order Details"
        aria-label={`View order ${order.orderCode || order.id}`}
      >
        <Eye className="w-3.5 h-3.5" />
        <span>View</span>
      </Link>

      {/* 2. EDIT / UPDATE ACTION */}
      {allowEdit ? (
        <button
          type="button"
          onClick={() => {
            console.log("Order Table Row (Edit clicked):", order);
            if (onOpenStatusModal) onOpenStatusModal(order);
          }}
          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition cursor-pointer flex-shrink-0"
          title="Update Order Status"
          aria-label={`Update status for order ${order.orderCode || order.id}`}
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      ) : (
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="p-1.5 rounded-lg bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 opacity-45 cursor-not-allowed flex-shrink-0 select-none"
          title={editDisabledReason}
          aria-label={editDisabledReason}
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* 3. TRACK ACTION */}
      {allowTrack ? (
        <button
          type="button"
          onClick={() => {
            console.log("Order Table Row (Track clicked):", order);
            if (onOpenTrackModal) onOpenTrackModal(order);
          }}
          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition cursor-pointer flex-shrink-0"
          title="Track Progress"
          aria-label={`Track progress for order ${order.orderCode || order.id}`}
        >
          <Truck className="w-3.5 h-3.5" />
        </button>
      ) : (
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="p-1.5 rounded-lg bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 opacity-45 cursor-not-allowed flex-shrink-0 select-none"
          title={trackDisabledReason}
          aria-label={trackDisabledReason}
        >
          <Truck className="w-3.5 h-3.5" />
        </button>
      )}

      {/* 4. CANCEL ACTION */}
      {allowCancel ? (
        <button
          type="button"
          onClick={() => {
            console.log("Order Table Row (Cancel clicked):", order);
            if (onCancelOrder) onCancelOrder(order);
          }}
          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400 transition cursor-pointer flex-shrink-0"
          title="Cancel Order"
          aria-label={`Cancel order ${order.orderCode || order.id}`}
        >
          <XCircle className="w-3.5 h-3.5" />
        </button>
      ) : (
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="p-1.5 rounded-lg bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 opacity-45 cursor-not-allowed flex-shrink-0 select-none"
          title={cancelDisabledReason}
          aria-label={cancelDisabledReason}
        >
          <XCircle className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

