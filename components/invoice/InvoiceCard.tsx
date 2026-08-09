"use client";

import React, { useRef } from "react";
import { ShieldCheck, CheckCircle2, Printer } from "lucide-react";

interface InvoiceCardProps {
  invoiceData: any;
  isVerifiedView?: boolean;
  showPrintButton?: boolean;
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

export const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoiceData,
  isVerifiedView = false,
  showPrintButton = true,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const inv = invoiceData || {};
  const items = Array.isArray(inv.items)
    ? inv.items
    : Array.isArray(inv.products)
    ? inv.products
    : Array.isArray(inv.productsJson)
    ? inv.productsJson
    : [];

  const invoiceNum = inv.invoiceNumber || inv.invoiceNo || inv.invoiceCode || "--";
  const invoiceDate = inv.invoiceDate || inv.createdAt;
  const orderNum = inv.orderNumber || inv.orderCode || "--";
  const verifyToken = inv.verificationToken || inv.token || invoiceNum;

  const customerName = inv.customerName || inv.customer?.name || inv.customer?.fullName || "Customer";
  const customerPhone = inv.customerPhone || inv.phone || inv.customer?.phone || "--";
  const customerEmail = inv.customerEmail || inv.email || inv.customer?.email || "--";
  const customerRole = (
    inv.customerRole ||
    inv.role ||
    inv.userRole ||
    inv.orderedByRole ||
    inv.customer?.customerRole ||
    inv.customer?.role ||
    inv.user?.role ||
    inv.order?.user?.role ||
    inv.order?.customerRole ||
    inv.order?.role ||
    inv.order?.orderedByRole ||
    "CUSTOMER"
  ).toUpperCase();
  const shippingAddress = inv.shippingAddress || inv.address || inv.shipping?.address || "--";
  const district = inv.district || inv.shippingDistrict || inv.shipping?.district || "";
  const division = inv.division || inv.shippingDivision || inv.shipping?.division || "";
  const shippingType = inv.shippingType || inv.shippingMethod || inv.shipping?.shippingType || "Standard Delivery";

  const paymentMethod = inv.paymentMethod || inv.payment?.paymentMethod || inv.payment?.method || "COD";
  const paymentStatus = inv.paymentStatus || inv.payment?.paymentStatus || inv.payment?.status || "PAID";
  const orderStatus = inv.orderStatus || inv.deliveryStatus || inv.status || inv.payment?.orderStatus || "DELIVERED";

  const subtotal = inv.subtotal ?? 0;
  const discount = inv.discount ?? inv.discountAmount ?? 0;
  const deliveryCharge = inv.deliveryCharge ?? inv.shippingFee ?? 0;
  const grandTotal = inv.grandTotal ?? inv.payableAmount ?? inv.totalAmount ?? 0;

  const origin = typeof window !== "undefined" ? window.location.origin : "https://growthzen.com";
  const verifyUrl = `${origin}/invoice/verify/${encodeURIComponent(verifyToken)}`;
  const qrCodeImageUrl = inv.qrCodeUrl || inv.qr?.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 font-sans">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-invoice-content, #printable-invoice-content * {
            visibility: visible !important;
          }
          #printable-invoice-content {
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
            margin: 8mm;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Action Bar (No Print) */}
      {showPrintButton && (
        <div className="no-print flex items-center justify-end mb-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      )}

      {/* Main Invoice Card */}
      <div
        ref={printRef}
        id="printable-invoice-content"
        className="bg-white text-slate-900 p-6 md:p-10 rounded-3xl border border-slate-200 shadow-lg space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-6 gap-6">
          <div className="space-y-2">
            <img
              src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1785603633/ChatGPT_Image_Aug_1_2026_10_56_41_PM_1_vd6zar.png"
              alt="GrowthZen Trends Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="text-left sm:text-right space-y-1">
            {isVerifiedView ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-black tracking-wide uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Authentic Invoice
              </div>
            ) : (
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-black tracking-widest uppercase">
                TAX INVOICE
              </span>
            )}
            <p className="text-sm font-extrabold text-slate-800 font-mono mt-2">
              Invoice #: {invoiceNum}
            </p>
            <p className="text-xs font-medium text-slate-500">
              Invoice Date: {formatDate(invoiceDate)}
            </p>
            <p className="text-xs font-medium text-slate-500">
              Order #: {orderNum}
            </p>
          </div>
        </div>

        {/* Customer & Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5">
              Customer Information
            </h4>
            <div className="space-y-1 text-xs">
              <p className="font-extrabold text-slate-900 text-sm">{customerName}</p>
              <p><span className="text-slate-500 font-medium">Phone:</span> <span className="font-semibold">{customerPhone}</span></p>
              {customerEmail && customerEmail !== "--" && (
                <p><span className="text-slate-500 font-medium">Email:</span> <span className="font-semibold">{customerEmail}</span></p>
              )}
              <p><span className="text-slate-500 font-medium">Role:</span> <span className="font-extrabold text-blue-700 uppercase">{customerRole}</span></p>
              <p><span className="text-slate-500 font-medium">Shipping Address:</span> <span className="font-semibold">{shippingAddress}</span></p>
              {(district || division) && (
                <p><span className="text-slate-500 font-medium">District / Division:</span> <span className="font-semibold">{[district, division].filter(Boolean).join(", ")}</span></p>
              )}
              <p><span className="text-slate-500 font-medium">Shipping Type:</span> <span className="font-semibold">{shippingType}</span></p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5">
              Order & Payment Info
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
                <span className="text-slate-500 font-medium">Order Status:</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                  {orderStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Purchased Products
          </h4>
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
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
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="flex justify-end pt-2">
          <div className="w-full sm:w-72 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
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

        {/* Footer: QR Code & Verification */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-xs font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified by GrowthZen Trends
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Computer Generated Invoice. No Signature Required.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-1">
            <img
              src={qrCodeImageUrl}
              alt="Verification QR Code"
              className="w-20 h-20 border border-slate-200 p-1 rounded-xl bg-white"
            />
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Digital Signature QR
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
