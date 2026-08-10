"use client";

import React, { useState, useMemo } from "react";
import { BannerItem, CreateBannerInput } from "@/types/settings";
import {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useGetBannerByIdQuery,
} from "@/services/settingsApi";

import { BannerTable } from "./BannerTable";
import { BannerCardList } from "./BannerCardList";
import { CreateEditBannerModal } from "./CreateEditBannerModal";
import { BannerLightboxModal } from "./BannerLightboxModal";

import {
  Plus,
  Search,
  LayoutGrid,
  List,
  AlertTriangle,
  RefreshCw,
  Image as ImageIcon,
  ArrowUpDown,
} from "lucide-react";
import Swal from "sweetalert2";

export const BannerManagementSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"order-asc" | "order-desc" | "title" | "newest">("order-asc");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [lightboxBanner, setLightboxBanner] = useState<BannerItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // RTK Query hooks
  const { data: bannersList = [], isLoading, isFetching, isError, refetch } = useGetBannersQuery();

  const [createBannerMutation, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBannerMutation, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBannerMutation] = useDeleteBannerMutation();

  // Filter & sort banners
  const filteredBanners = useMemo(() => {
    let list = [...bannersList];

    // Exclude soft deleted items if backend returns them with isDeleted: true
    list = list.filter((b) => !b.isDeleted);

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.subtitle?.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q) ||
          b.buttonText?.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortOrder === "order-asc") return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
      if (sortOrder === "order-desc") return (b.displayOrder ?? 0) - (a.displayOrder ?? 0);
      if (sortOrder === "title") return (a.title || "").localeCompare(b.title || "");
      if (sortOrder === "newest") {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      return 0;
    });

    return list;
  }, [bannersList, searchTerm, sortOrder]);

  const handleCreateSubmit = async (data: any) => {
    try {
      const bannerTitle = data instanceof FormData ? data.get("title")?.toString() || "Banner" : data.title || "Banner";
      if (editingBanner) {
        await updateBannerMutation({ id: editingBanner.id, data }).unwrap();
        Swal.fire({
          icon: "success",
          title: "Banner Updated",
          text: `Banner "${bannerTitle}" updated successfully.`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
        });
      } else {
        await createBannerMutation(data).unwrap();
        Swal.fire({
          icon: "success",
          title: "Banner Created",
          text: `Banner "${bannerTitle}" added to homepage carousel.`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
        });
      }

      setIsCreateModalOpen(false);
      setEditingBanner(null);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: editingBanner ? "Update Failed" : "Creation Failed",
        text: err?.data?.message || "Failed to save banner details.",
      });
    }
  };

  const handleDeleteBanner = async (banner: BannerItem) => {
    const result = await Swal.fire({
      title: "Delete Banner?",
      text: `Are you sure you want to delete banner "${banner.title}"? This soft-delete can be restored by admins.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete Banner",
    });

    if (result.isConfirmed) {
      try {
        setDeletingId(banner.id);
        await deleteBannerMutation(banner.id).unwrap();
        Swal.fire({
          icon: "success",
          title: "Banner Deleted",
          text: `Banner "${banner.title}" removed.`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
        });
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: err?.data?.message || "Failed to delete banner.",
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search, Sort, View Toggle & Create Button Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search banners by title, text, or link..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortOrder}
              onChange={(e: any) => setSortOrder(e.target.value)}
              className="bg-transparent focus:outline-none text-slate-800 dark:text-slate-200 font-bold cursor-pointer"
            >
              <option value="order-asc">Order (Ascending)</option>
              <option value="order-desc">Order (Descending)</option>
              <option value="title">Title (A-Z)</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-900 text-blue-600 shadow-2xs"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded-lg transition ${
                viewMode === "cards"
                  ? "bg-white dark:bg-slate-900 text-blue-600 shadow-2xs"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              title="Cards Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Create Banner Trigger */}
          <button
            onClick={() => {
              setEditingBanner(null);
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Banner</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {isError && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Failed to load homepage banners from backend API.</span>
          </div>
          <button onClick={() => refetch()} className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Banners List (Table or Grid Cards) */}
      {viewMode === "table" ? (
        <BannerTable
          banners={filteredBanners}
          onPreview={(b) => setLightboxBanner(b)}
          onEdit={(b) => {
            setEditingBanner(b);
            setIsCreateModalOpen(true);
          }}
          onDelete={handleDeleteBanner}
          isDeletingId={deletingId}
        />
      ) : (
        <BannerCardList
          banners={filteredBanners}
          onPreview={(b) => setLightboxBanner(b)}
          onEdit={(b) => {
            setEditingBanner(b);
            setIsCreateModalOpen(true);
          }}
          onDelete={handleDeleteBanner}
          isDeletingId={deletingId}
        />
      )}

      {/* Create / Edit Modal */}
      <CreateEditBannerModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingBanner(null);
        }}
        onSubmitBanner={handleCreateSubmit}
        bannerToEdit={editingBanner}
        isLoading={isCreating || isUpdating}
      />

      {/* Image Lightbox & Live Simulation Modal */}
      <BannerLightboxModal
        banner={lightboxBanner}
        isOpen={Boolean(lightboxBanner)}
        onClose={() => setLightboxBanner(null)}
      />
    </div>
  );
};

