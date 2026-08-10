"use client";

import React, { Suspense } from "react";
import { Truck, RefreshCw } from "lucide-react";
import { DeliveryManagementSection } from "@/components/admin/settings/DeliveryManagementSection";
import { useGetDeliverySettingsQuery } from "@/services/settingsApi";

function DeliveryManagementPageContent() {
  const { isFetching, refetch } = useGetDeliverySettingsQuery();

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Truck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Delivery Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pl-11">
            Centralized single source of truth for global delivery status, free shipping offers, and zone charges.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl transition shadow-xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
          <span>Refresh Settings</span>
        </button>
      </div>

      {/* Main Delivery Configuration Form Section */}
      <DeliveryManagementSection />
    </div>
  );
}

export default function AdminDeliveryManagementPage() {
  return (
    <Suspense fallback={<div className="p-6 min-h-screen bg-slate-50 dark:bg-slate-950 animate-pulse" />}>
      <DeliveryManagementPageContent />
    </Suspense>
  );
}
