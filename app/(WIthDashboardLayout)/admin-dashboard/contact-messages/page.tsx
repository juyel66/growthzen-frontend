"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ContactMessage } from "@/types/contactMessage";
import {
  useGetContactMessagesQuery,
  useUpdateContactMessageStatusMutation,
  useDeleteContactMessageMutation,
} from "@/services/contactMessageApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser, selectUserRole } from "@/features/auth/authSlice";
import { getRoleDashboardPath, RoleGuard } from "@/components/auth/AuthGuards";

import { ContactSummaryCards } from "@/components/admin/contact/ContactSummaryCards";
import { ContactFilters } from "@/components/admin/contact/ContactFilters";
import { ContactTable } from "@/components/admin/contact/ContactTable";
import { ViewContactModal } from "@/components/admin/contact/ViewContactModal";

import {
  MessageSquare,
  RefreshCw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";

export default function ContactMessagesPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <ContactMessagesContent />
    </RoleGuard>
  );
}

function ContactMessagesContent() {
  const router = useRouter();
  const currentUser = useAppSelector(selectCurrentUser);
  const userRoleState = useAppSelector(selectUserRole);
  const currentUserRole = (currentUser?.role || userRoleState || "").toUpperCase();

  // Pagination & Filtering state
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateRange, setDateRange] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Selected message for View Modal
  const [selectedMessageForView, setSelectedMessageForView] = useState<ContactMessage | null>(null);

  // Compute calculated date range parameters
  const computedDateParams = useMemo(() => {
    if (dateRange === "today") {
      const today = new Date().toISOString().split("T")[0];
      return { startDate: today, endDate: today };
    }
    if (dateRange === "last7") {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      return { startDate: d.toISOString().split("T")[0] };
    }
    if (dateRange === "last30") {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      return { startDate: d.toISOString().split("T")[0] };
    }
    if (dateRange === "custom") {
      return {
        startDate: startDate ? startDate : undefined,
        endDate: endDate ? endDate : undefined,
      };
    }
    return { startDate: undefined, endDate: undefined };
  }, [dateRange, startDate, endDate]);

  // RTK Query hooks
  const {
    data: responseData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetContactMessagesQuery({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    dateRange: dateRange !== "all" ? dateRange : undefined,
    startDate: computedDateParams.startDate,
    endDate: computedDateParams.endDate,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [updateStatusMutation, { isLoading: isUpdatingStatus }] =
    useUpdateContactMessageStatusMutation();
  const [deleteMessageMutation, { isLoading: isDeletingMessage }] =
    useDeleteContactMessageMutation();

  const [actionId, setActionId] = useState<string | null>(null);

  // Gracefully handle HTTP 403 Forbidden
  useEffect(() => {
    const errStatus = (error as any)?.status || (error as any)?.originalStatus;
    if (errStatus === 403) {
      const fallback = getRoleDashboardPath(currentUserRole);
      router.replace(fallback);
    }
  }, [error, currentUserRole, router]);

  const messagesList = responseData?.items || [];
  const meta = responseData?.meta || { page: 1, limit: 10, total: messagesList.length, totalPages: 1 };
  const stats = responseData?.stats;

  // Toggle Read/Unread Status handler
  const handleToggleStatus = async (message: ContactMessage) => {
    const isCurrentlyUnread = (message.status || "").toUpperCase() === "UNREAD";
    const targetStatus = isCurrentlyUnread ? "READ" : "UNREAD";

    try {
      setActionId(message.id);
      await updateStatusMutation({ id: message.id, status: targetStatus }).unwrap();
      Swal.fire({
        icon: "success",
        title: `Marked as ${targetStatus}`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });
      refetch();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Status Update Failed",
        text: "Could not update status through backend API.",
      });
    } finally {
      setActionId(null);
    }
  };

  // Delete Message handler with confirmation
  const handleDeleteMessage = async (message: ContactMessage) => {
    const sender = message.name || message.email || "this message";

    const confirm = await Swal.fire({
      title: "Delete Message?",
      text: "Are you sure you want to delete this message?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        setActionId(message.id);
        await deleteMessageMutation(message.id).unwrap();

        Swal.fire({
          icon: "success",
          title: "Message Deleted",
          text: `Message from ${sender} has been deleted successfully.`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });

        refetch();
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Deletion Failed",
          text: err?.data?.message || "Could not delete message via backend API.",
        });
      } finally {
        setActionId(null);
      }
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setDateRange("all");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search.trim() ||
      statusFilter !== "ALL" ||
      dateRange !== "all" ||
      startDate ||
      endDate
  );

  const startRecord = meta.total > 0 ? (meta.page - 1) * meta.limit + 1 : 0;
  const endRecord = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center border border-blue-100 dark:border-blue-900/50">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Contact Messages
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage customer inquiries, support requests and contact submissions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-2xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          <span>Refresh Messages</span>
        </button>
      </div>

      {/* Error state alert */}
      {isError && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 dark:bg-rose-950/80 dark:text-rose-200 border border-rose-200 dark:border-rose-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Failed to load contact messages from backend API.</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 cursor-pointer shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Statistics Cards */}
      <ContactSummaryCards
        stats={stats}
        isLoading={isLoading}
        activeStatusFilter={statusFilter}
        onSelectStatusFilter={(status) => {
          setStatusFilter(status);
          setPage(1);
        }}
      />

      {/* Filters Bar */}
      <ContactFilters
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
        dateRange={dateRange}
        setDateRange={(val) => {
          setDateRange(val);
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
        limit={limit}
        setLimit={(val) => {
          setLimit(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Messages Table */}
      <ContactTable
        messages={messagesList}
        isLoading={isLoading}
        isUpdatingId={isUpdatingStatus ? actionId : null}
        isDeletingId={isDeletingMessage ? actionId : null}
        hasActiveFilters={hasActiveFilters}
        onViewMessage={(msg) => setSelectedMessageForView(msg)}
        onToggleStatus={handleToggleStatus}
        onDeleteMessage={handleDeleteMessage}
      />

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        <div>
          {meta.total > 0 ? (
            <span>
              Showing <span className="font-extrabold text-slate-800 dark:text-slate-200">{startRecord}–{endRecord}</span> of{" "}
              <span className="font-extrabold text-slate-800 dark:text-slate-200">{meta.total}</span> messages
            </span>
          ) : (
            <span>Showing 0 messages</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={(meta.page || page) <= 1 || isFetching}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer font-bold transition hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            type="button"
            disabled={(meta.page || page) >= (meta.totalPages || 1) || isFetching}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer font-bold transition hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View Contact Modal */}
      <ViewContactModal
        message={selectedMessageForView}
        isOpen={Boolean(selectedMessageForView)}
        onClose={() => {
          setSelectedMessageForView(null);
          refetch();
        }}
        onDeleteMessage={handleDeleteMessage}
      />
    </div>
  );
}
