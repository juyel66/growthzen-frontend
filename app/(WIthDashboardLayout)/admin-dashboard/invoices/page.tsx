"use client";

import React, { useState, useMemo } from "react";
import { InvoiceListItem } from "@/types/invoice";
import {
  useGetInvoicesQuery,
  useLazyGetInvoiceByOrderIdQuery,
} from "@/services/invoiceApi";

import { InvoiceSummaryCards } from "@/components/admin/invoice/InvoiceSummaryCards";
import { InvoiceFilters } from "@/components/admin/invoice/InvoiceFilters";
import { InvoiceTable } from "@/components/admin/invoice/InvoiceTable";
import { OrderInvoiceModal } from "@/components/admin/order/OrderInvoiceModal";

import { FileText, RefreshCw, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminInvoicesPage() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("ALL");
  const [paymentStatus, setPaymentStatus] = useState<string>("ALL");
  const [orderStatus, setOrderStatus] = useState<string>("ALL");
  const [sortOption, setSortOption] = useState<string>("newest");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Invoice Modal state
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceListItem | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);

  const [triggerGetInvoiceDetails, { data: detailedInvoiceData, isLoading: isFetchingInvoiceDetails }] =
    useLazyGetInvoiceByOrderIdQuery();

  const { sortBy, sortOrder } = useMemo(() => {
    if (sortOption === "oldest") return { sortBy: "createdAt", sortOrder: "asc" as const };
    return { sortBy: "createdAt", sortOrder: "desc" as const };
  }, [sortOption]);

  const {
    data: responseData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetInvoicesQuery({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
    dateRange: dateRange !== "ALL" ? dateRange : undefined,
    paymentStatus: paymentStatus !== "ALL" ? paymentStatus : undefined,
    orderStatus: orderStatus !== "ALL" ? orderStatus : undefined,
    sortBy,
    sortOrder,
    startDate: dateRange === "custom" && startDate ? startDate : undefined,
    endDate: dateRange === "custom" && endDate ? endDate : undefined,
  });

  const invoiceItems = responseData?.items || responseData?.invoices || [];
  const meta = responseData?.meta || { page: 1, limit: 10, total: invoiceItems.length, totalPages: 1 };
  const summary = responseData?.summary;

  const handleOpenViewModal = async (item: InvoiceListItem) => {
    setSelectedInvoice(item);
    setIsInvoiceModalOpen(true);
    try {
      if (item.orderId || item.id) {
        await triggerGetInvoiceDetails(item.orderId || item.id).unwrap();
      }
    } catch {
      // Fallback to list item payload if detailed fetch fails
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setDateRange("ALL");
    setPaymentStatus("ALL");
    setOrderStatus("ALL");
    setSortOption("newest");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Invoice Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, view and print official tax invoices and customer verification links.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-2xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          <span>Refresh Invoices</span>
        </button>
      </div>

      {/* Error State */}
      {isError && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Failed to load invoice records from backend APIs.</span>
          </div>
          <button onClick={() => refetch()} className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <InvoiceSummaryCards summary={summary} isLoading={isLoading} />

      {/* Filters */}
      <InvoiceFilters
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        dateRange={dateRange}
        setDateRange={(val) => {
          setDateRange(val);
          setPage(1);
        }}
        paymentStatus={paymentStatus}
        setPaymentStatus={(val) => {
          setPaymentStatus(val);
          setPage(1);
        }}
        orderStatus={orderStatus}
        setOrderStatus={(val) => {
          setOrderStatus(val);
          setPage(1);
        }}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        limit={limit}
        setLimit={(l) => {
          setLimit(l);
          setPage(1);
        }}
        sortOption={sortOption}
        setSortOption={(val) => {
          setSortOption(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Invoice Table */}
      <InvoiceTable
        invoices={invoiceItems}
        isLoading={isLoading}
        onViewInvoice={handleOpenViewModal}
        onPrintInvoice={handleOpenViewModal}
      />

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        <div>
          Showing page <span className="font-bold text-slate-800 dark:text-slate-200">{meta.page || page}</span> of{" "}
          <span className="font-bold text-slate-800 dark:text-slate-200">{meta.totalPages || 1}</span> (Total{" "}
          <span className="font-bold text-slate-800 dark:text-slate-200">{meta.total || invoiceItems.length}</span> invoices)
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={(meta.page || page) <= 1 || isFetching}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            disabled={(meta.page || page) >= (meta.totalPages || 1) || isFetching}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer font-semibold"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Invoice View / Print Modal */}
      {selectedInvoice && (
        <OrderInvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setSelectedInvoice(null);
          }}
          invoiceData={detailedInvoiceData || selectedInvoice}
          fallbackOrder={{
            id: selectedInvoice.orderId || selectedInvoice.id,
            orderCode: selectedInvoice.orderNumber || selectedInvoice.orderCode || selectedInvoice.id,
            customerName: selectedInvoice.customerName,
            customerPhone: selectedInvoice.customerPhone,
            customerEmail: selectedInvoice.customerEmail,
            address: "",
            deliveryArea: "INSIDE_DHAKA",
            paymentMethod: "COD",
            subtotal: selectedInvoice.grandTotal,
            discountAmount: 0,
            deliveryCharge: 0,
            payableAmount: selectedInvoice.grandTotal,
            status: (selectedInvoice.orderStatus as any) || "DELIVERED",
            items: [],
            createdAt: selectedInvoice.invoiceDate || selectedInvoice.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }}
          isLoading={isFetchingInvoiceDetails}
        />
      )}
    </div>
  );
}
