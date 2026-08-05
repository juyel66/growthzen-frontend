"use client";

import React, { useState, useMemo } from "react";
import {
  useGetCouponsQuery,
  useDeleteCouponMutation,
} from "@/services/couponApi";
import { Coupon, getCouponStatus, CouponStatus } from "@/types/coupon";
import { CouponModal } from "@/components/admin/coupon/CouponModal";
import {
  Tag,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit3,
  Trash2,
  Calendar,
  Percent,
  DollarSign,
  Layers,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import Swal from "sweetalert2";

const formatCurrency = (val?: number | null) => {
  if (val === undefined || val === null) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(val);
};

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function AdminCouponsPage() {
  const { data: coupons = [], isLoading, isError, refetch } = useGetCouponsQuery();
  const [deleteCoupon] = useDeleteCouponMutation();

  // Search, Filter, Sort, Pagination State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"createdAt" | "expiresAt" | "discountValue" | "usage">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // Filtered & Sorted Coupons
  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      // Search
      const searchLower = search.toLowerCase().trim();
      const codeMatches = coupon.code.toLowerCase().includes(searchLower);
      const descMatches = (coupon.description || "").toLowerCase().includes(searchLower);
      if (searchLower && !codeMatches && !descMatches) return false;

      // Status Filter
      const status = getCouponStatus(coupon);
      if (statusFilter !== "ALL" && status !== statusFilter) return false;

      // Type Filter
      const discType = coupon.discountType?.toUpperCase();
      if (typeFilter !== "ALL" && discType !== typeFilter) return false;

      return true;
    });
  }, [coupons, search, statusFilter, typeFilter]);

  const sortedCoupons = useMemo(() => {
    return [...filteredCoupons].sort((a, b) => {
      let valA: any = 0;
      let valB: any = 0;

      if (sortBy === "createdAt") {
        valA = new Date(a.createdAt || 0).getTime();
        valB = new Date(b.createdAt || 0).getTime();
      } else if (sortBy === "expiresAt") {
        valA = new Date(a.expiresAt || a.expiryDate || 0).getTime();
        valB = new Date(b.expiresAt || b.expiryDate || 0).getTime();
      } else if (sortBy === "discountValue") {
        valA = a.discountValue || 0;
        valB = b.discountValue || 0;
      } else if (sortBy === "usage") {
        valA = a.usageCount ?? a._count?.usages ?? 0;
        valB = b.usageCount ?? b._count?.usages ?? 0;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredCoupons, sortBy, sortOrder]);

  // Pagination calculation
  const totalItems = sortedCoupons.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedCoupons = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCoupons.slice(start, start + pageSize);
  }, [sortedCoupons, currentPage, pageSize]);

  const handleOpenCreateModal = () => {
    setSelectedCoupon(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleDeleteCoupon = async (coupon: Coupon) => {
    const result = await Swal.fire({
      title: "Delete Coupon?",
      text: `Are you sure you want to soft delete coupon code ${coupon.code}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Soft Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteCoupon(coupon.id).unwrap();
        Swal.fire({
          icon: "success",
          title: "Coupon Deleted",
          text: `Coupon ${coupon.code} has been soft deleted successfully.`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
        });
      } catch (err: unknown) {
        const error = err as { data?: { message?: string } };
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: error?.data?.message || "Failed to delete coupon.",
        });
      }
    }
  };

  const renderStatusBadge = (status: CouponStatus) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> ACTIVE
          </span>
        );
      case "INACTIVE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <XCircle className="w-3 h-3 text-slate-400" /> INACTIVE
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800">
            <Clock className="w-3 h-3" /> EXPIRED
          </span>
        );
      case "LIMIT REACHED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3" /> LIMIT REACHED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Enterprise Coupon Management
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
                {coupons.length} Total
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Create, configure, and monitor promotional discount coupons
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => refetch()}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Refresh Coupon Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex-1 sm:flex-initial py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* Filter, Search & Sort Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="lg:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by coupon code or description..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition"
          />
        </div>

        {/* Status Filter */}
        <div className="lg:col-span-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-600 transition"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="LIMIT REACHED">LIMIT REACHED</option>
          </select>
        </div>

        {/* Type Filter */}
        <div className="lg:col-span-2">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-600 transition"
          >
            <option value="ALL">All Discount Types</option>
            <option value="PERCENTAGE">Percentage (%)</option>
            <option value="FIXED">Fixed Amount ($)</option>
          </select>
        </div>

        {/* Sort Options */}
        <div className="lg:col-span-3 flex items-center gap-2 justify-end">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split("-") as [any, any];
              setSortBy(by);
              setSortOrder(order);
            }}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-600 transition"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="expiresAt-asc">Expiring Soonest</option>
            <option value="discountValue-desc">Highest Discount</option>
            <option value="usage-desc">Most Used</option>
          </select>
        </div>
      </div>

      {/* Main Coupons Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4 animate-pulse">
            <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
            <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
            <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
            <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
          </div>
        ) : isError ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <AlertCircle className="w-12 h-12 text-rose-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Failed to load coupons
            </h3>
            <p className="text-xs text-slate-500">
              There was an error communicating with the backend APIs.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold text-xs transition hover:bg-blue-700 cursor-pointer"
            >
              Retry Loading
            </button>
          </div>
        ) : paginatedCoupons.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <Tag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              No coupons found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              {search || statusFilter !== "ALL" || typeFilter !== "ALL"
                ? "No promotional coupons match your selected search and filter criteria."
                : "Create your first promotional coupon to get started."}
            </p>
            {!coupons.length && (
              <button
                onClick={handleOpenCreateModal}
                className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create Coupon
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50/80 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4 pl-6">Coupon Code</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Type & Value</th>
                  <th className="p-4">Min Order</th>
                  <th className="p-4">Max Discount</th>
                  <th className="p-4">Usage & Limit</th>
                  <th className="p-4">Validity Range</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {paginatedCoupons.map((coupon) => {
                  const status = getCouponStatus(coupon);
                  const discType = coupon.discountType?.toUpperCase() === "FIXED" ? "FIXED" : "PERCENTAGE";
                  const usedCount = coupon.usageCount ?? coupon._count?.usages ?? 0;
                  const maxUsage = coupon.maximumUsage;
                  const usagePercent = maxUsage ? Math.min(100, Math.round((usedCount / maxUsage) * 100)) : null;

                  return (
                    <tr
                      key={coupon.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* 1. Code */}
                      <td className="p-4 pl-6 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-mono font-extrabold text-xs tracking-wider border border-blue-200/60 dark:border-blue-900/60">
                            {coupon.code}
                          </span>
                        </div>
                      </td>

                      {/* 2. Description */}
                      <td className="p-4 max-w-xs">
                        <p className="line-clamp-2 text-slate-600 dark:text-slate-400 text-xs">
                          {coupon.description || coupon.name || "No description provided"}
                        </p>
                        <span className="text-[10px] font-semibold text-slate-400 capitalize">
                          Scope: {(coupon.scope || "ENTIRE_ORDER").toLowerCase().replace("_", " ")}
                        </span>
                      </td>

                      {/* 3. Discount Type & Value */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 font-black text-slate-900 dark:text-white text-sm">
                          {discType === "PERCENTAGE" ? (
                            <>
                              <Percent className="w-3.5 h-3.5 text-blue-600" />
                              <span>{coupon.discountValue}% OFF</span>
                            </>
                          ) : (
                            <>
                              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                              <span>${coupon.discountValue.toFixed(2)} OFF</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* 4. Min Order */}
                      <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                        {coupon.minimumOrderAmount || coupon.minOrderValue
                          ? formatCurrency(coupon.minimumOrderAmount || coupon.minOrderValue)
                          : "None"}
                      </td>

                      {/* 5. Max Discount */}
                      <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                        {coupon.maximumDiscount || coupon.maxDiscount
                          ? formatCurrency(coupon.maximumDiscount || coupon.maxDiscount)
                          : "Unlimited"}
                      </td>

                      {/* 6. Usage Progress */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1 min-w-[100px]">
                          <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                            {usedCount} {maxUsage ? `/ ${maxUsage}` : "used"}
                          </span>
                          {usagePercent !== null && (
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  usagePercent >= 100
                                    ? "bg-amber-500"
                                    : usagePercent >= 80
                                    ? "bg-blue-600"
                                    : "bg-emerald-500"
                                }`}
                                style={{ width: `${usagePercent}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 7. Dates */}
                      <td className="p-4 text-[11px] text-slate-500 dark:text-slate-400">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-emerald-600 shrink-0" />
                            From: {formatDate(coupon.startsAt || coupon.createdAt)}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                            <Clock className="w-3 h-3 text-rose-500 shrink-0" />
                            To: {formatDate(coupon.expiresAt || coupon.expiryDate)}
                          </span>
                        </div>
                      </td>

                      {/* 8. Status */}
                      <td className="p-4">{renderStatusBadge(status)}</td>

                      {/* 9. Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(coupon)}
                            className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition cursor-pointer"
                            title="Edit Coupon"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCoupon(coupon)}
                            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition cursor-pointer"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Pagination Footer */}
        {totalItems > 0 && (
          <div className="p-4 bg-slate-50/50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span>Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-bold transition cursor-pointer ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Coupon Modal */}
      <CouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        couponToEdit={selectedCoupon}
      />
    </div>
  );
}
