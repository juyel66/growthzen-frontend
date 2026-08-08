"use client";

import React, { useState, useMemo } from "react";
import { OrderView, OrderStatus, DateRangeFilterOption } from "@/types/order";
import {
  useGetOrdersQuery,
  useGetOrderSummaryQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} from "@/services/orderApi";

import { OrderSummaryCards } from "@/components/admin/order/OrderSummaryCards";
import { OrderFilters } from "@/components/admin/order/OrderFilters";
import { OrderTable } from "@/components/admin/order/OrderTable";
import { OrderAccountingSummaryRow } from "@/components/admin/order/OrderAccountingSummaryRow";
import { OrderStatusModal } from "@/components/admin/order/OrderStatusModal";
import { TrackOrderModal } from "@/components/admin/order/TrackOrderModal";

import { ListOrdered, RefreshCw, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";

export default function OrderListPage() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilterOption | string>("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("ALL");
  const [shippingAreaFilter, setShippingAreaFilter] = useState<string>("ALL");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Modals state
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<OrderView | null>(null);
  const [selectedOrderForTrack, setSelectedOrderForTrack] = useState<OrderView | null>(null);

  // Unified query parameters shared between Orders List and Order Summary APIs
  const queryParams = useMemo(
    () => ({
      page,
      limit,
      search: search.trim() ? search.trim() : undefined,
      status: statusFilter !== "ALL" ? statusFilter : undefined,
      dateRange: dateRangeFilter !== "ALL" ? dateRangeFilter : undefined,
      startDate: dateRangeFilter === "custom" && startDate ? startDate : undefined,
      endDate: dateRangeFilter === "custom" && endDate ? endDate : undefined,
    }),
    [page, limit, search, statusFilter, dateRangeFilter, startDate, endDate]
  );

  // RTK Query hooks
  const {
    data: responseData,
    isLoading: isOrdersLoading,
    isFetching: isOrdersFetching,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useGetOrdersQuery(queryParams, { pollingInterval: 60000 });

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    refetch: refetchSummary,
  } = useGetOrderSummaryQuery(queryParams);

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();
  const [cancelOrderMutation] = useCancelOrderMutation();

  const ordersList = responseData?.items || [];
  const meta = responseData?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 };

  // Calculate status summary counts dynamically from orders data
  const counts = useMemo(() => {
    const map: Record<string, number> = { total: meta.total || ordersList.length };
    ordersList.forEach((o) => {
      const st = (o.status || "").toUpperCase();
      map[st] = (map[st] || 0) + 1;
    });
    return map;
  }, [ordersList, meta.total]);

  // Client-side filtering for payment method, shipping area, & sorting
  const filteredOrders = useMemo(() => {
    let list = [...ordersList];

    if (paymentMethodFilter !== "ALL") {
      list = list.filter(
        (o) => (o.paymentMethod || o.payment?.method || "").toUpperCase() === paymentMethodFilter
      );
    }

    if (shippingAreaFilter !== "ALL") {
      list = list.filter((o) => (o.deliveryArea || "").toUpperCase() === shippingAreaFilter);
    }

    list.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });

    return list;
  }, [ordersList, paymentMethodFilter, shippingAreaFilter, sortOrder]);

  const handleRefresh = () => {
    refetchOrders();
    refetchSummary();
  };

  const handleUpdateStatusSubmit = async (id: string, newStatus: OrderStatus, adminNote?: string) => {
    try {
      await updateStatus({ id, status: newStatus, adminNote }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Order Status Updated",
        text: `Order status changed to ${newStatus} successfully.`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });
      handleRefresh();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err?.data?.message || "Could not update order status.",
      });
    }
  };

  const handleCancelOrderSubmit = async (order: OrderView) => {
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
        handleRefresh();
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Cancellation Failed",
          text: err?.data?.message || "Could not cancel order.",
        });
      }
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setDateRangeFilter("ALL");
    setStartDate("");
    setEndDate("");
    setPaymentMethodFilter("ALL");
    setShippingAreaFilter("ALL");
    setSortOrder("desc");
    setPage(1);
  };

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ListOrdered className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Order Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise customer order fulfillment, status tracking, & transaction audit
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isOrdersFetching}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isOrdersFetching ? "animate-spin" : ""}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Error state alert */}
      {isOrdersError && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Failed to load order management list from backend APIs.</span>
          </div>
          <button onClick={handleRefresh} className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs">
            Retry
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <OrderSummaryCards
        counts={counts}
        activeStatusFilter={statusFilter}
        onSelectStatusFilter={(st) => {
          setStatusFilter(st);
          setPage(1);
        }}
      />

      {/* Filters Bar */}
      <OrderFilters
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        setStatusFilter={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        dateRangeFilter={dateRangeFilter}
        setDateRangeFilter={(val) => {
          setDateRangeFilter(val);
          setPage(1);
        }}
        startDate={startDate}
        setStartDate={(val) => {
          setStartDate(val);
          setPage(1);
        }}
        endDate={endDate}
        setEndDate={(val) => {
          setEndDate(val);
          setPage(1);
        }}
        paymentMethodFilter={paymentMethodFilter}
        setPaymentMethodFilter={setPaymentMethodFilter}
        shippingAreaFilter={shippingAreaFilter}
        setShippingAreaFilter={setShippingAreaFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        limit={limit}
        setLimit={(l) => {
          setLimit(l);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Backend Order Accounting Summary Row (Above Orders Table) */}
      <OrderAccountingSummaryRow
        summaryData={summaryData}
        isLoading={isSummaryLoading}
        isError={isSummaryError}
      />

      {/* Order Table */}
      <OrderTable
        orders={filteredOrders}
        isLoading={isOrdersLoading}
        onOpenStatusModal={(order) => setSelectedOrderForStatus(order)}
        onOpenTrackModal={(order) => setSelectedOrderForTrack(order)}
        onCancelOrder={handleCancelOrderSubmit}
      />

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        <div>
          Showing page <span className="font-bold text-slate-800 dark:text-slate-200">{meta.page}</span> of{" "}
          <span className="font-bold text-slate-800 dark:text-slate-200">{meta.totalPages || 1}</span> (Total{" "}
          <span className="font-bold text-slate-800 dark:text-slate-200">{meta.total}</span> orders)
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1 || isOrdersFetching}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            disabled={page >= (meta.totalPages || 1) || isOrdersFetching}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer font-semibold"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Update Status Modal */}
      <OrderStatusModal
        order={selectedOrderForStatus}
        isOpen={Boolean(selectedOrderForStatus)}
        onClose={() => setSelectedOrderForStatus(null)}
        onUpdateStatus={handleUpdateStatusSubmit}
        isLoading={isUpdatingStatus}
      />

      {/* Track Order Modal */}
      <TrackOrderModal
        order={selectedOrderForTrack}
        isOpen={Boolean(selectedOrderForTrack)}
        onClose={() => setSelectedOrderForTrack(null)}
      />
    </div>
  );
}
