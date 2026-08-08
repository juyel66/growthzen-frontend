"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useVerifyInvoiceByTokenQuery } from "@/services/invoiceApi";
import { ShieldCheck, AlertOctagon, CheckCircle2, Home, Printer, Loader2 } from "lucide-react";

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

export default function PublicInvoiceVerificationPage() {
  const params = useParams();
  const token = (params?.verificationToken as string) || "";

  const { data: invoiceData, isLoading, isError } = useVerifyInvoiceByTokenQuery(token, {
    skip: !token,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 flex flex-col items-center justify-center">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full text-center space-y-4">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Verifying Tax Invoice...
          </h2>
          <p className="text-xs text-slate-500">
            Authenticating invoice token with GrowthZen Trends platform.
          </p>
        </div>
      </div>
    );
  }

  if (isError || !invoiceData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 flex flex-col items-center justify-center">
        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Invoice Not Found
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This invoice does not exist or the verification link is invalid. Please verify your invoice code or contact support.
            </p>
          </div>

          <Link href="/">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer">
              <Home className="w-4 h-4" />
              <span>Go to Homepage</span>
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const inv = invoiceData;
  const items = Array.isArray(inv.items) ? inv.items : [];

  const invoiceNum = inv.invoiceNumber || inv.invoiceCode || token;
  const invoiceDate = inv.invoiceDate || inv.createdAt;
  const orderNum = inv.orderNumber || inv.orderCode || "--";

  const customerName = inv.customerName || "Valued Customer";
  const customerPhone = inv.customerPhone || inv.phone || "--";
  const shippingAddress = inv.shippingAddress || inv.address || "--";

  const paymentMethod = inv.paymentMethod || "COD";
  const paymentStatus = inv.paymentStatus || "PAID";
  const orderStatus = inv.orderStatus || inv.deliveryStatus || inv.status || "DELIVERED";

  const subtotal = inv.subtotal;
  const discount = inv.discount ?? inv.discountAmount ?? 0;
  const deliveryCharge = inv.deliveryCharge ?? inv.shippingFee ?? 0;
  const grandTotal = inv.grandTotal ?? inv.payableAmount ?? inv.totalAmount ?? 0;

  const origin = typeof window !== "undefined" ? window.location.origin : "https://growthzen.com";
  const verifyUrl = `${origin}/invoice/verify/${encodeURIComponent(token)}`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 flex flex-col items-center justify-center font-sans">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #public-invoice-card, #public-invoice-card * {
            visibility: visible !important;
          }
          #public-invoice-card {
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

      {/* Top Bar Action (No Print) */}
      <div className="no-print w-full max-w-3xl mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition"
        >
          ← Back to GrowthZen Store
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Main Centered Verification Invoice Card */}
      <div
        id="public-invoice-card"
        className="bg-white text-slate-900 p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl max-w-3xl w-full space-y-8"
      >
        {/* Header: Company Logo & Verified Badge */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-6 gap-6">
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

          <div className="text-left sm:text-right space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-black tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Authentic Invoice
            </div>
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

        {/* Customer & Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5">
              Customer Information
            </h4>
            <div className="space-y-1 text-xs">
              <p className="font-extrabold text-slate-900 text-sm">{customerName}</p>
              <p><span className="text-slate-500 font-medium">Phone:</span> <span className="font-semibold">{customerPhone}</span></p>
              <p><span className="text-slate-500 font-medium">Shipping Address:</span> <span className="font-semibold">{shippingAddress}</span></p>
            </div>
          </div>

          {/* Payment & Order Status */}
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
                    const title = item.productTitle || item.productName || item.title || "Product";
                    const sku = item.sku || item.productCode || "--";
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

        {/* Summary Card */}
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

        {/* Footer: QR Code & Verified Badge */}
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
}
