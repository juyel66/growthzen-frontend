"use client";

import React, { useState, useMemo } from "react";
import { PaymentView } from "@/types/payment";
import {
  useGetAdminPaymentsQuery,
  useApprovePaymentMutation,
  useRejectPaymentMutation,
  useRefundPaymentMutation,
} from "@/services/paymentApi";

import { PaymentSummaryCards } from "@/components/admin/payment/PaymentSummaryCards";
import { PaymentFilters } from "@/components/admin/payment/PaymentFilters";
import { PaymentTable } from "@/components/admin/payment/PaymentTable";
import { PaymentDetailsModal } from "@/components/admin/payment/PaymentDetailsModal";
import { ApprovePaymentModal } from "@/components/admin/payment/ApprovePaymentModal";
import { RejectPaymentModal } from "@/components/admin/payment/RejectPaymentModal";
import { RefundPaymentModal } from "@/components/admin/payment/RefundPaymentModal";
import { UnpaidDeliveredOrdersModal } from "@/components/admin/payment/UnpaidDeliveredOrdersModal";

import { CreditCard, RefreshCw, AlertTriangle, ChevronLeft, ChevronRight, PackageCheck } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminPaymentsPage() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [methodFilter, setMethodFilter] = useState<string>("ALL");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  // Modals state
  const [selectedPaymentForDetails, setSelectedPaymentForDetails] = useState<PaymentView | null>(null);
  const [selectedPaymentForApprove, setSelectedPaymentForApprove] = useState<PaymentView | null>(null);
  const [selectedPaymentForReject, setSelectedPaymentForReject] = useState<PaymentView | null>(null);
  const [selectedPaymentForRefund, setSelectedPaymentForRefund] = useState<PaymentView | null>(null);
  const [isUnpaidModalOpen, setIsUnpaidModalOpen] = useState<boolean>(false);

  // RTK Query hook with 60-second polling
  const { data: responseData, isLoading, isFetching, isError, refetch } = useGetAdminPaymentsQuery(
    {
      page,
      limit,
      search: search.trim() ? search.trim() : undefined,
      method: methodFilter !== "ALL" ? methodFilter : undefined,
      status: statusFilter !== "ALL" ? statusFilter : undefined,
    },
    { pollingInterval: 60000 }
  );

  const [approvePaymentMutation, { isLoading: isApproving }] = useApprovePaymentMutation();
  const [rejectPaymentMutation, { isLoading: isRejecting }] = useRejectPaymentMutation();
  const [refundPaymentMutation, { isLoading: isRefunding }] = useRefundPaymentMutation();

  const paymentsList = responseData?.items || [];
  const meta = responseData?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 };

  // Calculate KPI counts & revenue metrics dynamically
  const { counts, totalRevenue, totalRefunds } = useMemo(() => {
    const map: Record<string, number> = { total: meta.total || paymentsList.length };
    let rev = 0;
    let ref = 0;

    paymentsList.forEach((p) => {
      const st = (p.status || "").toUpperCase();
      map[st] = (map[st] || 0) + 1;

      const amt = p.paidAmount || p.totalAmount || 0;
      if (st === "PAID") rev += amt;
      if (st === "REFUNDED") ref += amt;
    });

    return { counts: map, totalRevenue: rev, totalRefunds: ref };
  }, [paymentsList, meta.total]);

  // Client-side sorting for highest / lowest amount or date
  const sortedPayments = useMemo(() => {
    let list = [...paymentsList];

    list.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      const amntA = a.paidAmount || a.totalAmount || 0;
      const amntB = b.paidAmount || b.totalAmount || 0;

      if (sortOrder === "oldest") return timeA - timeB;
      if (sortOrder === "highest") return amntB - amntA;
      if (sortOrder === "lowest") return amntA - amntB;
      return timeB - timeA; // newest default
    });

    return list;
  }, [paymentsList, sortOrder]);

  const handleApproveSubmit = async (paymentId: string) => {
    try {
      await approvePaymentMutation(paymentId).unwrap();
      Swal.fire({
        icon: "success",
        title: "Payment Approved",
        text: "Payment status has been marked as PAID and order confirmed.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });
      refetch();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Approval Failed",
        text: err?.data?.message || "Failed to approve payment.",
      });
    }
  };

  const handleRejectSubmit = async (paymentId: string, reason: string) => {
    try {
      await rejectPaymentMutation({ paymentId, reason }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Payment Rejected",
        text: "Payment status marked as FAILED.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });
      refetch();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Rejection Failed",
        text: err?.data?.message || "Failed to reject payment.",
      });
    }
  };

  const handleRefundSubmit = async (paymentId: string, reason: string) => {
    try {
      await refundPaymentMutation({ paymentId, reason }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Payment Refunded",
        text: "Payment status marked as REFUNDED.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });
      refetch();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Refund Failed",
        text: err?.data?.message || "Failed to issue refund.",
      });
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setMethodFilter("ALL");
    setSortOrder("newest");
    setPage(1);
  };

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Payment Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise transaction ledger, manual payment verification, & refund audits
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Unpaid Delivered Orders Drawer Trigger */}
          <button
            onClick={() => setIsUnpaidModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition shadow-md shadow-orange-500/20 cursor-pointer"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Unpaid Delivered Orders</span>
          </button>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh Ledger</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {isError && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Failed to load payment transactions ledger.</span>
          </div>
          <button onClick={() => refetch()} className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Summary KPI & Revenue Cards */}
      <PaymentSummaryCards
        counts={counts}
        totalRevenue={totalRevenue}
        totalRefunds={totalRefunds}
        activeStatusFilter={statusFilter}
        onSelectStatusFilter={(st) => {
          setStatusFilter(st);
          setPage(1);
        }}
        isLoading={isLoading}
      />

      {/* Filters Bar */}
      <PaymentFilters
        search={search}
        setSearch={(val) => { setSearch(val); setPage(1); }}
        statusFilter={statusFilter}
        setStatusFilter={(val) => { setStatusFilter(val); setPage(1); }}
        methodFilter={methodFilter}
        setMethodFilter={(val) => { setMethodFilter(val); setPage(1); }}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        limit={limit}
        setLimit={(l) => { setLimit(l); setPage(1); }}
        onReset={handleResetFilters}
      />

      {/* Payment Table */}
      <PaymentTable
        payments={sortedPayments}
        isLoading={isLoading}
        onOpenDetailsModal={(pay) => setSelectedPaymentForDetails(pay)}
        onOpenApproveModal={(pay) => setSelectedPaymentForApprove(pay)}
        onOpenRejectModal={(pay) => setSelectedPaymentForReject(pay)}
        onOpenRefundModal={(pay) => setSelectedPaymentForRefund(pay)}
      />

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        <div>
          Showing page <span className="font-bold text-slate-800 dark:text-slate-200">{meta.page}</span> of{" "}
          <span className="font-bold text-slate-800 dark:text-slate-200">{meta.totalPages || 1}</span> (Total{" "}
          <span className="font-bold text-slate-800 dark:text-slate-200">{meta.total}</span> payments)
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            disabled={page >= (meta.totalPages || 1) || isFetching}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer font-semibold"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <PaymentDetailsModal
        payment={selectedPaymentForDetails}
        isOpen={Boolean(selectedPaymentForDetails)}
        onClose={() => setSelectedPaymentForDetails(null)}
      />

      <ApprovePaymentModal
        payment={selectedPaymentForApprove}
        isOpen={Boolean(selectedPaymentForApprove)}
        onClose={() => setSelectedPaymentForApprove(null)}
        onApprove={handleApproveSubmit}
        isLoading={isApproving}
      />

      <RejectPaymentModal
        payment={selectedPaymentForReject}
        isOpen={Boolean(selectedPaymentForReject)}
        onClose={() => setSelectedPaymentForReject(null)}
        onReject={handleRejectSubmit}
        isLoading={isRejecting}
      />

      <RefundPaymentModal
        payment={selectedPaymentForRefund}
        isOpen={Boolean(selectedPaymentForRefund)}
        onClose={() => setSelectedPaymentForRefund(null)}
        onRefund={handleRefundSubmit}
        isLoading={isRefunding}
      />

      <UnpaidDeliveredOrdersModal
        isOpen={isUnpaidModalOpen}
        onClose={() => setIsUnpaidModalOpen(false)}
      />
    </div>
  );
}

