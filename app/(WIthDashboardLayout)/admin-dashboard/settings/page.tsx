"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SettingsHeader, SettingsTab } from "@/components/admin/settings/SettingsHeader";
import { BannerManagementSection } from "@/components/admin/settings/BannerManagementSection";
import { SystemSettingsSection } from "@/components/admin/settings/SystemSettingsSection";
import { CategoryDiscountsSection } from "@/components/admin/settings/CategoryDiscountsSection";
import { DeliveryManagementSection } from "@/components/admin/settings/DeliveryManagementSection";
import {
  useGetBannersQuery,
  useGetCategoryDiscountsQuery,
  useGetSettingsQuery,
} from "@/services/settingsApi";

function SettingsPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as SettingsTab | null;

  const [activeTab, setActiveTab] = useState<SettingsTab>("delivery");

  useEffect(() => {
    if (tabParam && ["banners", "system", "category-discounts", "delivery"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const { data: banners = [], isFetching: isFetchingBanners, refetch: refetchBanners } = useGetBannersQuery();
  const { data: discounts = [], isFetching: isFetchingDiscounts, refetch: refetchDiscounts } = useGetCategoryDiscountsQuery();
  const { isFetching: isFetchingSettings, refetch: refetchSettings } = useGetSettingsQuery();

  const isFetchingAny = isFetchingBanners || isFetchingDiscounts || isFetchingSettings;

  const handleGlobalRefresh = () => {
    if (activeTab === "banners") refetchBanners();
    else if (activeTab === "system") refetchSettings();
    else if (activeTab === "category-discounts") refetchDiscounts();
    else if (activeTab === "delivery") refetchSettings();
  };

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* Settings Navigation Header */}
      <SettingsHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isFetching={isFetchingAny}
        onRefresh={handleGlobalRefresh}
        bannerCount={banners.length}
        discountCount={discounts.length}
      />

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === "banners" && (
          <motion.div
            key="banners"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <BannerManagementSection />
          </motion.div>
        )}

        {activeTab === "delivery" && (
          <motion.div
            key="delivery"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <DeliveryManagementSection />
          </motion.div>
        )}

        {activeTab === "system" && (
          <motion.div
            key="system"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <SystemSettingsSection />
          </motion.div>
        )}

        {activeTab === "category-discounts" && (
          <motion.div
            key="category-discounts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <CategoryDiscountsSection />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<div className="p-6 min-h-screen bg-slate-50 dark:bg-slate-950 animate-pulse" />}>
      <SettingsPageContent />
    </Suspense>
  );
}

