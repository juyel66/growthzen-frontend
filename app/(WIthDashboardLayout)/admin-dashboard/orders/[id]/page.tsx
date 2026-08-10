"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} from "@/services/orderApi";
import { useLazyGetInvoiceByOrderIdQuery } from "@/services/invoiceApi";
import { useApprovePaymentMutation } from "@/services/paymentApi";

import { OrderTimeline } from "@/components/admin/order/OrderTimeline";
import { UpdateOrderModal } from "@/components/admin/order/UpdateOrderModal";
import { TrackOrderModal } from "@/components/admin/order/TrackOrderModal";
import { OrderInvoiceModal } from "@/components/admin/order/OrderInvoiceModal";
import { OrderStatus } from "@/types/order";

import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Truck,
  UserCheck,
  UserX,
  MapPin,
  Package,
  Printer,
  Edit3,
  XCircle,
  AlertTriangle,
  FileText,
  DollarSign,
  Tag,
  Clock,
} from "lucide-react";
import Swal from "sweetalert2";

const formatCurrency = (val: number | undefined) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT", currencyDisplay: "narrowSymbol",
  }).format(val || 0);
};

const formatDate = (dateStr: string | Date | undefined) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "";

  const { data: order, isLoading, isError, refetch } = useGetOrderByIdQuery(id, {
    skip: !id,
  });

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();
  const [approvePayment, { isLoading: isApprovingPayment }] = useApprovePaymentMutation();
  const [cancelOrderMutation] = useCancelOrderMutation();

  // Modals state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState<boolean>(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);

  const [triggerGetInvoice, { data: invoiceData, isLoading: isFetchingInvoice }] = useLazyGetInvoiceByOrderIdQuery();

  if (isLoading) {
    return (
      <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6 animate-pulse">
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen flex flex-col items-center justify-center text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Order Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          Could not locate order with ID or code: <span className="font-mono">{id}</span>.
        </p>
        <button
          onClick={() => router.push("/admin-dashboard/orders")}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 cursor-pointer"
        >
          Back to Orders List
        </button>
      </div>
    );
  }

  const isGuest = !order.userId || Boolean(order.guestName || order.guestEmail);
  const isCancellable = order.status === "PENDING";
  const items = order.items || [];
  const isSaving = isUpdatingStatus || isApprovingPayment;
  const isPaid = order.payment?.status === "PAID";
  const isDelivered = (order.status || "").toUpperCase() === "DELIVERED";

  const handleUpdateOrderSubmit = async (
    orderId: string,
    newStatus: OrderStatus,
    paymentStatus: "Paid" | "Unpaid",
    adminNote?: string,
    courierServiceCost?: number
  ) => {
    try {
      // 1. Update order status
      await updateStatus({
        id: orderId,
        status: newStatus,
        adminNote,
        courierServiceCost,
      }).unwrap();

      // 2. If Payment is marked Paid & payment record exists and not yet paid, approve payment
      if (paymentStatus === "Paid" && order.payment?.id && order.payment.status !== "PAID") {
        await approvePayment(order.payment.id).unwrap();
      }

      Swal.fire({
        icon: "success",
        title: "Order Updated",
        text: `Order status set to ${newStatus} & payment set to ${paymentStatus}.`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });

      refetch();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err?.data?.message || "Failed to update order workflow.",
      });
    }
  };

  const handleCancelOrderSubmit = async () => {
    const confirm = await Swal.fire({
      title: "Cancel Order?",
      text: `Are you sure you want to cancel order ${order.orderCode}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Cancel Order",
    });

    if (confirm.isConfirmed) {
      try {
        await cancelOrderMutation(order.id).unwrap();
        Swal.fire({
          icon: "success",
          title: "Order Cancelled",
          text: `Order ${order.orderCode} has been cancelled.`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
        });
        refetch();
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Cancellation Failed",
          text: err?.data?.message || "Could not cancel order.",
        });
      }
    }
  };

  const handlePrintInvoiceClick = async () => {
    if (!isDelivered) return;
    try {
      await triggerGetInvoice(order.id).unwrap();
    } catch {
      // Allow modal fallback to order details if API response is delayed
    } finally {
      setIsInvoiceModalOpen(true);
    }
  };

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* Top Header & Actions */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin-dashboard/orders"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">
                Order {order.orderCode}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Update Order Modal Button */}
          <button
            onClick={() => setIsUpdateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-md cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Update Order</span>
          </button>

          {/* Track Order Button */}
          <button
            onClick={() => setIsTrackModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-2xs cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order</span>
          </button>

          {isCancellable && (
            <button
              onClick={handleCancelOrderSubmit}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-2xs cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel Order</span>
            </button>
          )}

          <button
            onClick={handlePrintInvoiceClick}
            disabled={!isDelivered || isFetchingInvoice}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              isDelivered
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 opacity-50 cursor-not-allowed"
            }`}
            title={!isDelivered ? "Invoice print is only enabled for DELIVERED orders" : "Print Invoice"}
          >
            <Printer className={`w-4 h-4 ${isFetchingInvoice ? "animate-spin" : ""}`} />
            <span>{isFetchingInvoice ? "Fetching Invoice..." : "Print Invoice"}</span>
          </button>
        </div>
      </div>

      {/* Visual Status Progress Timeline & Order Update History */}
      <OrderTimeline
        status={order.status}
        productCost={order.productCost}
        courierServiceCost={order.courierServiceCost}
        courierCost={order.courierCost}
        deliveryProfit={order.deliveryProfit}
        courierProfit={order.courierProfit}
        netProfit={order.netProfit}
      />

      {/* 4 Grid Cards: Customer Info, Shipping Address, Payment Details, Business Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Customer Info Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Customer Information
            </h3>
            {isGuest ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-700 border border-amber-200">
                <UserX className="w-3 h-3" /> Guest
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded bg-blue-50 text-blue-700 border border-blue-200">
                <UserCheck className="w-3 h-3" /> Registered
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-xs">
            <p className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
              {order.customerName || order.guestName || "Guest User"}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Phone: <span className="font-semibold">{order.customerPhone || order.guestPhone || "-"}</span>
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Email: <span className="font-semibold">{order.customerEmail || order.guestEmail || order.userEmail || "-"}</span>
            </p>
          </div>
        </div>

        {/* Shipping Address Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <MapPin className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Shipping Address
            </h3>
          </div>

          <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
            <p className="font-bold text-slate-900 dark:text-slate-100">
              {order.address || order.guestAddress || "Address Not Provided"}
            </p>
            <p className="text-slate-500">
              {[order.guestUpazila, order.guestDistrict, order.guestDivision].filter(Boolean).join(", ") || "Location details"}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200">
                Type: {order.shippingType || "Standard"}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-sky-50 text-sky-700 border border-sky-200">
                Area: {order.deliveryArea?.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Payment Information
              </h3>
            </div>
            {isPaid ? (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Paid
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-orange-50 text-orange-700 border border-orange-200">
                Unpaid
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Method:</span>
              <span className="font-extrabold uppercase">{order.paymentMethod || order.payment?.method || "COD"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Payment Status:</span>
              <span className={`font-extrabold uppercase ${isPaid ? "text-emerald-600" : "text-amber-600"}`}>
                {order.payment?.status || (order.paymentMethod === "COD" ? "PENDING" : "PENDING")}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Updated Time:</span>
              <span className="font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {formatDate(order.updatedAt || order.createdAt)}
              </span>
            </div>

            {order.payment?.transactionId && (
              <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono font-bold text-blue-600">{order.payment.transactionId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Business Summary Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Business Summary
              </h3>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200">
              Accounting
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Gross Sales:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {isDelivered && order.grossSales != null ? formatCurrency(order.grossSales) : "--"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Product Cost:</span>
              <span className="font-bold"> -
                {isDelivered && order.productCost != null ? formatCurrency(order.productCost) : "--"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Courier Service Cost:</span>
              <span className="font-bold">-
                {isDelivered && order.courierServiceCost != null ? formatCurrency(order.courierServiceCost) : "--"}
              </span>
            </div>

            {/* <div className="flex justify-between">
              <span className="text-slate-500">Courier Profit:</span>
              <span className="font-bold">
                {isDelivered && (order.deliveryProfit ?? order.courierProfit) != null
                  ? formatCurrency(order.deliveryProfit ?? order.courierProfit!)
                  : "--"}
              </span>
            </div> */}

            <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800 font-extrabold text-xs">
              <span className="text-slate-900 dark:text-slate-100">Net Profit:</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {isDelivered && order.netProfit != null ? formatCurrency(order.netProfit) : "--"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Products Table */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Package className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Ordered Products ({items.length})
          </h3>
        </div>

        <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">SKU / Code</th>
                <th className="p-3.5">Size</th>
                <th className="p-3.5 text-center">Quantity</th>
                <th className="p-3.5">Unit Price</th>
                <th className="p-3.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700 flex-shrink-0">
                      {item.product?.thumbnailImage ? (
                        <Image
                          src={item.product.thumbnailImage}
                          alt={item.product?.title || "Product"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                          Img
                        </div>
                      )}
                    </div>
                    <span>{item.product?.title || item.product?.name || `Product ID: ${item.productId}`}</span>
                  </td>

                  <td className="p-3.5 font-mono text-slate-500">{item.productCode || "-"}</td>
                  <td className="p-3.5 text-slate-600 font-semibold">{item.size || "-"}</td>
                  <td className="p-3.5 text-center font-extrabold text-slate-900 dark:text-slate-100">{item.quantity}</td>
                  <td className="p-3.5 font-semibold text-slate-700">{formatCurrency(item.unitPrice)}</td>
                  <td className="p-3.5 text-right font-extrabold text-blue-600 dark:text-blue-400">
                    {formatCurrency(item.totalPrice || item.unitPrice * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Pricing Summary & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order & Admin Notes */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <FileText className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Order & Internal Notes
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                Customer Instructions:
              </span>
              <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 italic border border-slate-100">
                {order.orderNotes || "No customer notes attached to this order."}
              </p>
            </div>

            {order.adminNote && (
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                  Admin Internal Note:
                </span>
                <p className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-200">
                  {order.adminNote}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Summary Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pricing Summary
            </h3>
          </div>

          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal:</span>
              <span className="font-bold">{formatCurrency(order.subtotal)}</span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount / Coupon Savings:</span>
                <span className="font-bold">-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}

            {order.couponCode && (
              <div className="flex justify-between text-rose-600">
                <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Coupon Code Used:</span>
                <span className="font-mono font-bold uppercase">{order.couponCode}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-slate-500">Shipping Delivery Charge:</span>
              <span className="font-bold">
                {order.deliveryCharge === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 uppercase font-extrabold">
                    FREE
                  </span>
                ) : (
                  formatCurrency(order.deliveryCharge)
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-sm">
              <span className="font-extrabold text-slate-900 dark:text-slate-100">Grand Total Payable:</span>
              <span className="font-black text-blue-600 dark:text-blue-400 text-base">
                {formatCurrency(order.payableAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Update Order Workflow Modal */}
      <UpdateOrderModal
        order={order}
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdateOrder={handleUpdateOrderSubmit}
        isLoading={isSaving}
      />

      {/* Track Order Progress Modal */}
      <TrackOrderModal
        order={order}
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />

      {/* Official Tax Invoice Print Modal */}
      <OrderInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        invoiceData={invoiceData}
        fallbackOrder={order}
        isLoading={isFetchingInvoice}
      />
    </div>
  );
}
