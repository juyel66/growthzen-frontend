"use client";

import React, { useRef } from "react";
import { OrderView } from "@/types/order";
import { Printer, X, Building2, ShieldCheck, CheckCircle2 } from "lucide-react";

interface OrderInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: any;
  fallbackOrder: OrderView;
  isLoading?: boolean;
}

const formatCurrency = (val: number | undefined | null) => {
  if (val === undefined || val === null) return "--";
  return `৳${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(val)}`;
};

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoiceData,
  fallbackOrder,
  isLoading = false,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const inv = invoiceData || {};
  const order = fallbackOrder || {};

  const items = Array.isArray(inv.items) && inv.items.length > 0
    ? inv.items
    : Array.isArray(order.items)
    ? order.items
    : [];

  const invoiceNum = inv.invoiceNumber || inv.invoiceCode || `INV-${order.orderCode || order.id?.slice(0, 8)}`;
  const invoiceDate = inv.invoiceDate || inv.createdAt || order.createdAt;
  const orderNum = inv.orderNumber || inv.orderCode || order.orderCode || order.id;
  const verifyToken = inv.verificationToken || inv.token || invoiceNum;

  const customerName = inv.customerName || inv.customer?.name || order.customerName || order.guestName || "Customer";
  const customerPhone = inv.customerPhone || inv.phone || order.customerPhone || order.guestPhone || "--";
  const customerEmail = inv.customerEmail || inv.email || order.customerEmail || order.guestEmail || "--";
  const shippingAddress = inv.shippingAddress || inv.address || order.address || (order as any).guestAddress || "--";
  const district = inv.district || (order as any).district || order.guestDistrict || "--";
  const division = inv.division || (order as any).division || order.guestDivision || "--";
  const shippingType = inv.shippingType || inv.shippingMethod || order.shippingType || "Standard Delivery";

  const paymentMethod = inv.paymentMethod || order.paymentMethod || "COD";
  const paymentStatus = inv.paymentStatus || order.payment?.status || "PAID";
  const deliveryStatus = inv.deliveryStatus || inv.orderStatus || inv.status || order.status || "DELIVERED";

  const subtotal = inv.subtotal ?? order.subtotal ?? (order as any).totalAmount;
  const discount = inv.discount ?? inv.discountAmount ?? order.discountAmount;
  const deliveryCharge = inv.deliveryCharge ?? inv.shippingFee ?? order.deliveryCharge;
  const grandTotal = inv.grandTotal ?? inv.payableAmount ?? (order as any).payableAmount;

  const origin = typeof window !== "undefined" ? window.location.origin : "https://growthzen.com";
  const verifyUrl = `${origin}/invoice/verify/${encodeURIComponent(verifyToken)}`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-customer-invoice, #printable-customer-invoice * {
            visibility: visible !important;
          }
          #printable-customer-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            background: #ffffff !important;
            color: #0f172a !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

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
              onClick={handlePrint}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
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
          <div
            ref={printRef}
            id="printable-customer-invoice"
            className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8 max-w-3xl mx-auto font-sans"
          >
            {/* Header */}
            <div className="flex flex-row items-start justify-between border-b border-slate-200 pb-6 gap-6">
              <div className="space-y-2">
                <img
                  src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1785603633/ChatGPT_Image_Aug_1_2026_10_56_41_PM_1_vd6zar.png"
                  alt="GrowthZen Trends Logo"
                  className="h-10 w-auto object-contain"
                />
                <div>
                  {/* <h2 className="text-xl font-black text-slate-900 tracking-tight">GrowthZen Trends</h2>
                  <p className="text-xs font-medium text-slate-500">Enterprise Ecommerce Platform</p> */}
                </div>
              </div>

              <div className="text-right space-y-1">
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-black tracking-widest uppercase">
                  TAX INVOICE
                </span>
                <p className="text-sm font-extrabold text-slate-800 font-mono mt-2">
                  Invoice #: {invoiceNum}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Date: {formatDate(invoiceDate)}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Order #: {orderNum}
                </p>
              </div>
            </div>

            {/* Customer & Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5">
                  Customer Information
                </h4>
                <div className="space-y-1 text-xs">
                  <p className="font-extrabold text-slate-900 text-sm">{customerName}</p>
                  <p><span className="text-slate-500 font-medium">Phone:</span> <span className="font-semibold">{customerPhone}</span></p>
                  <p><span className="text-slate-500 font-medium">Email:</span> <span className="font-semibold">{customerEmail}</span></p>
                  <p><span className="text-slate-500 font-medium">Address:</span> <span className="font-semibold">{shippingAddress}</span></p>
                  <p><span className="text-slate-500 font-medium">District / Division:</span> <span className="font-semibold">{district}, {division}</span></p>
                  <p><span className="text-slate-500 font-medium">Shipping Type:</span> <span className="font-semibold">{shippingType}</span></p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5">
                  Payment Information
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Payment Method:</span>
                    <span className="font-bold text-slate-800 uppercase">{paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Payment Status:</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                      {paymentStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Delivery Status:</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                      {deliveryStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Product Items
              </h4>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Product</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {items.length > 0 ? (
                      items.map((item: any, idx: number) => {
                        const title = item.productTitle || item.productName || item.title || item.product?.title || "Product";
                        const sku = item.sku || item.productCode || item.product?.productCode || "--";
                        const qty = item.quantity || item.qty || 1;
                        const price = item.unitPrice ?? item.price ?? 0;
                        const itemSubtotal = item.subtotal ?? item.total ?? (price * qty);

                        return (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3 text-slate-400 font-semibold">{idx + 1}</td>
                            <td className="p-3 font-extrabold text-slate-900">{title}</td>
                            <td className="p-3 font-mono text-slate-600">{sku}</td>
                            <td className="p-3 text-center font-bold">{qty}</td>
                            <td className="p-3 text-right font-medium">{formatCurrency(price)}</td>
                            <td className="p-3 text-right font-extrabold text-slate-900">{formatCurrency(itemSubtotal)}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-slate-400 font-medium">
                          No product items recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="flex justify-end pt-2">
              <div className="w-full md:w-72 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Discount:</span>
                  <span className="font-semibold text-rose-600">-{formatCurrency(discount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold">{formatCurrency(deliveryCharge)}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-300">
                  <span>Grand Total:</span>
                  <span className="text-blue-700">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Footer with QR Code & Signature Notice */}
            <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1 justify-center md:justify-start">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Computer Generated Invoice
                </p>
                <p className="text-[11px] text-slate-500 font-medium">No Signature Required</p>
                <p className="text-[11px] text-slate-400 pt-1">
                  Thank you for shopping with GrowthZen Trends.
                </p>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center text-center space-y-1">
                <img
                  src={qrCodeImageUrl}
                  alt="Invoice Verification QR Code"
                  className="w-20 h-20 border border-slate-200 p-1 rounded-lg bg-white"
                />
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Scan to Verify
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
