"use client";

import React, { useState, useMemo } from "react";
import { UserManagementItem } from "@/types/userManagement";
import {
  useGetUsersQuery,
  useGetUserStatsQuery,
  useDeleteUserMutation,
} from "@/services/userManagementApi";

import { UserSummaryCards } from "@/components/admin/user/UserSummaryCards";
import { UserFilters } from "@/components/admin/user/UserFilters";
import { UserTable } from "@/components/admin/user/UserTable";
import { ViewUserModal } from "@/components/admin/user/ViewUserModal";
import { EditUserRoleModal } from "@/components/admin/user/EditUserRoleModal";

import { Users, RefreshCw, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";

export default function UserManagementPage() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [sortOption, setSortOption] = useState<string>("newest");

  // Modals state
  const [selectedUserForView, setSelectedUserForView] = useState<UserManagementItem | null>(null);
  const [selectedUserForRoleEdit, setSelectedUserForRoleEdit] = useState<UserManagementItem | null>(null);

  // Parse sortBy & sortOrder from sortOption
  const { sortBy, sortOrder } = useMemo(() => {
    if (sortOption === "oldest") return { sortBy: "createdAt", sortOrder: "asc" as const };
    if (sortOption === "name_asc") return { sortBy: "name", sortOrder: "asc" as const };
    if (sortOption === "name_desc") return { sortBy: "name", sortOrder: "desc" as const };
    return { sortBy: "createdAt", sortOrder: "desc" as const };
  }, [sortOption]);

  // RTK Query hooks
  const {
    data: responseData,
    isLoading: isUsersLoading,
    isFetching: isUsersFetching,
    isError: isUsersError,
    refetch: refetchUsers,
  } = useGetUsersQuery({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
    role: roleFilter !== "ALL" ? roleFilter : undefined,
    sortBy,
    sortOrder,
  });

  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
    refetch: refetchStats,
  } = useGetUserStatsQuery();

  const [deleteUserMutation, { isLoading: isDeletingUser }] = useDeleteUserMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const usersList = responseData?.items || responseData?.users || [];
  const meta = responseData?.meta || { page: 1, limit: 10, total: usersList.length, totalPages: 1 };
  const summary = responseData?.summary;

  const handleDeleteUserSubmit = async (user: UserManagementItem) => {
    const displayName = user.name || user.fullName || user.email || user.id;

    const confirm = await Swal.fire({
      title: "Delete User?",
      text: `Are you sure you want to delete user ${displayName}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete User",
    });

    if (confirm.isConfirmed) {
      try {
        setDeletingId(user.id);
        await deleteUserMutation(user.id).unwrap();

        Swal.fire({
          icon: "success",
          title: "User Deleted",
          text: `User ${displayName} has been deleted successfully.`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
        });

        refetchUsers();
        refetchStats();
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Deletion Failed",
          text: err?.data?.message || "Could not delete user.",
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setRoleFilter("ALL");
    setSortOption("newest");
    setPage(1);
  };

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              User Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage customers, administrators and platform users.
          </p>
        </div>

        <button
          onClick={() => {
            refetchUsers();
            refetchStats();
          }}
          disabled={isUsersFetching || isStatsLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-2xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isUsersFetching || isStatsLoading ? "animate-spin" : ""}`} />
          <span>Refresh Users</span>
        </button>
      </div>

      {/* Error state alert */}
      {isUsersError && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Failed to load user management list from backend APIs.</span>
          </div>
          <button onClick={() => refetchUsers()} className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <UserSummaryCards
        statsData={statsData}
        summary={summary}
        meta={meta}
        isLoading={isStatsLoading}
        isError={isStatsError}
        activeRoleFilter={roleFilter}
        onSelectRoleFilter={(role) => {
          setRoleFilter(role);
          setPage(1);
        }}
      />

      {/* Filters Bar */}
      <UserFilters
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        roleFilter={roleFilter}
        setRoleFilter={(val) => {
          setRoleFilter(val);
          setPage(1);
        }}
        sortOption={sortOption}
        setSortOption={(val) => {
          setSortOption(val);
          setPage(1);
        }}
        limit={limit}
        setLimit={(l) => {
          setLimit(l);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* User Table */}
      <UserTable
        users={usersList}
        isLoading={isUsersLoading}
        isDeletingId={deletingId}
        onViewUser={(user) => setSelectedUserForView(user)}
        onEditUserRole={(user) => setSelectedUserForRoleEdit(user)}
        onDeleteUser={handleDeleteUserSubmit}
      />

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        <div>
          Showing page <span className="font-bold text-slate-800 dark:text-slate-200">{meta.page || page}</span> of{" "}
          <span className="font-bold text-slate-800 dark:text-slate-200">{meta.totalPages || 1}</span> (Total{" "}
          <span className="font-bold text-slate-800 dark:text-slate-200">{meta.total || usersList.length}</span> users)
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={(meta.page || page) <= 1 || isUsersFetching}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            disabled={(meta.page || page) >= (meta.totalPages || 1) || isUsersFetching}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer font-semibold"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View User Modal */}
      <ViewUserModal
        userId={selectedUserForView?.id || null}
        isOpen={Boolean(selectedUserForView)}
        onClose={() => setSelectedUserForView(null)}
      />

      {/* Edit User Role Modal */}
      <EditUserRoleModal
        user={selectedUserForRoleEdit}
        isOpen={Boolean(selectedUserForRoleEdit)}
        onClose={() => setSelectedUserForRoleEdit(null)}
        onSuccess={() => {
          refetchUsers();
          refetchStats();
        }}
      />
    </div>
  );
}
