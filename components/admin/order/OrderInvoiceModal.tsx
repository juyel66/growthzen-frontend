"use client";

import React from "react";
import { OrderView } from "@/types/order";
import { Printer, X, Building2 } from "lucide-react";
import { SharedInvoiceRenderer } from "@/components/invoice/SharedInvoiceRenderer";

interface OrderInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: any;
  fallbackOrder: OrderView;
  isLoading?: boolean;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoiceData,
  fallbackOrder,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const inv = invoiceData || fallbackOrder || {};
  const orderNum = inv.orderNumber || inv.orderCode || (fallbackOrder as any)?.orderCode || fallbackOrder?.id || "--";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="no-print flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Tax Invoice ({orderNum})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Customer-Safe Invoice */}
        <div className="overflow-y-auto p-6 md:p-10 bg-slate-50/30 dark:bg-slate-900">
          <SharedInvoiceRenderer invoiceData={inv} showBackButton={false} />
        </div>
      </div>
    </div>
  );
};
