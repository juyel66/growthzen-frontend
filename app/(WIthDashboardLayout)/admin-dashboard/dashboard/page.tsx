"use client";

import React, { useState, useEffect } from "react";
import {
  useGetDashboardOverviewQuery,
  useGetDashboardChartsQuery,
  useGetDashboardRecentQuery,
} from "@/services/dashboardApi";

import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { RevenueOverview } from "@/components/admin/dashboard/RevenueOverview";
import { RecentOrdersTable } from "@/components/admin/dashboard/RecentOrdersTable";
import { RecentPaymentsTable } from "@/components/admin/dashboard/RecentPaymentsTable";
import { OrderSummaryCards } from "@/components/admin/dashboard/OrderSummaryCards";
import { TopSellingProducts } from "@/components/admin/dashboard/TopSellingProducts";
import { RecentCustomers } from "@/components/admin/dashboard/RecentCustomers";
import { ShippingSummary } from "@/components/admin/dashboard/ShippingSummary";
import { CouponSummary } from "@/components/admin/dashboard/CouponSummary";
import { DashboardSkeletons } from "@/components/admin/dashboard/DashboardSkeletons";

import {
  DollarSign,
  Calendar,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Users,
  Package,
  Star,
  AlertTriangle,
} from "lucide-react";

const formatCurrency = (val: number | undefined) => {
  if (val === undefined || val === null) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(val);
};

const formatNumber = (val: number | undefined) => {
  if (val === undefined || val === null) return "0";
  return new Intl.NumberFormat("en-US").format(val);
};

export default function Dashboard() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const POLLING_INTERVAL = 60000; // Auto refresh every 60 seconds

  const overviewQuery = useGetDashboardOverviewQuery(undefined, {
    pollingInterval: POLLING_INTERVAL,
  });

  const chartsQuery = useGetDashboardChartsQuery(
    { range: "LAST_7_DAYS" },
    { pollingInterval: POLLING_INTERVAL }
  );

  const recentQuery = useGetDashboardRecentQuery(undefined, {
    pollingInterval: POLLING_INTERVAL,
  });

  const isLoading =
    overviewQuery.isLoading ||
    chartsQuery.isLoading ||
    recentQuery.isLoading;

  const isFetching =
    overviewQuery.isFetching ||
    chartsQuery.isFetching ||
    recentQuery.isFetching;

  const isError =
    overviewQuery.isError ||
    chartsQuery.isError ||
    recentQuery.isError;

  useEffect(() => {
    if (overviewQuery.data || recentQuery.data) {
      setLastUpdated(new Date());
    }
  }, [overviewQuery.data, recentQuery.data]);

  const handleRefreshAll = () => {
    overviewQuery.refetch();
    chartsQuery.refetch();
    recentQuery.refetch();
  };

  const overview = overviewQuery.data;
  const revenue = overview?.revenue;
  const orders = overview?.orders;
  const products = overview?.products;
  const customers = overview?.customers;
  const shipping = overview?.shipping;
  const coupons = overview?.coupons;

  if (isLoading) {
    return (
      <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
        <DashboardSkeletons />
      </div>
    );
  }

  // 1. Overview KPI Cards (8 Key Business Metrics)
  const kpiCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(revenue?.totalRevenue),
      icon: DollarSign,
      colorBg: "bg-blue-50 dark:bg-blue-950/60",
      textColor: "text-blue-600 dark:text-blue-400",
      link: "/admin-dashboard/analytics/revenue",
    },
    {
      title: "Today's Revenue",
      value: formatCurrency(revenue?.todayRevenue),
      icon: Calendar,
      colorBg: "bg-indigo-50 dark:bg-indigo-950/60",
      textColor: "text-indigo-600 dark:text-indigo-400",
      link: "/admin-dashboard/analytics/revenue",
    },
    {
      title: "Total Orders",
      value: formatNumber(orders?.totalOrders),
      icon: ShoppingBag,
      colorBg: "bg-emerald-50 dark:bg-emerald-950/60",
      textColor: "text-emerald-600 dark:text-emerald-400",
      link: "/admin-dashboard/orders",
    },
    {
      title: "Pending Orders",
      value: formatNumber(orders?.pendingOrders),
      icon: Clock,
      colorBg: "bg-amber-50 dark:bg-amber-950/60",
      textColor: "text-amber-600 dark:text-amber-400",
      link: "/admin-dashboard/orders",
    },
    {
      title: "Delivered Orders",
      value: formatNumber(orders?.deliveredOrders),
      icon: CheckCircle2,
      colorBg: "bg-teal-50 dark:bg-teal-950/60",
      textColor: "text-teal-600 dark:text-teal-400",
      link: "/admin-dashboard/orders",
    },
    {
      title: "Total Customers",
      value: formatNumber(customers?.totalCustomers),
      icon: Users,
      colorBg: "bg-orange-50 dark:bg-orange-950/60",
      textColor: "text-orange-600 dark:text-orange-400",
      link: "/admin-dashboard/customers",
    },
    {
      title: "Total Products",
      value: formatNumber(products?.totalProducts),
      icon: Package,
      colorBg: "bg-violet-50 dark:bg-violet-950/60",
      textColor: "text-violet-600 dark:text-violet-400",
      link: "/admin-dashboard/products",
    },
    {
      title: "Featured Products",
      value: formatNumber(products?.featuredProducts),
      icon: Star,
      colorBg: "bg-pink-50 dark:bg-pink-950/60",
      textColor: "text-pink-600 dark:text-pink-400",
      link: "/admin-dashboard/products",
    },
  ];

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* SECTION 1: Dashboard Header */}
      <DashboardHeader
        lastUpdated={lastUpdated}
        onRefresh={handleRefreshAll}
        isFetching={isFetching}
      />

      {/* Error Banner */}
      {isError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-bold">Failed to load business overview</h3>
              <p className="text-xs text-rose-600 dark:text-rose-400">
                Please check network or backend connection.
              </p>
            </div>
          </div>
          <button
            onClick={handleRefreshAll}
            className="px-3 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* SECTION 1: Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => (
          <StatCard
            key={idx}
            title={card.title}
            value={card.value}
            icon={card.icon}
            colorBg={card.colorBg}
            textColor={card.textColor}
            link={card.link}
          />
        ))}
      </div>

      {/* SECTION 2: Revenue Overview (Small 7-Day Line Chart) */}
      <RevenueOverview revenueChart={chartsQuery.data?.revenueChart} />

      {/* SECTION 3 & 4 Grid: Recent Orders & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 3: Recent Orders (Top 5) */}
        <RecentOrdersTable orders={recentQuery.data?.recentOrders} />

        {/* SECTION 4: Recent Payments (Top 5) */}
        <RecentPaymentsTable payments={recentQuery.data?.recentPayments} />
      </div>

      {/* SECTION 5: Order Summary Cards */}
      <OrderSummaryCards orderAnalytics={orders} />

      {/* SECTION 6 & 7 Grid: Top Selling Products & Recent Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 6: Top Selling Products (Top 5) */}
        <TopSellingProducts products={recentQuery.data?.topSellingProducts} />

        {/* SECTION 7: Recent Customers (Top 5) */}
        <RecentCustomers customers={recentQuery.data?.recentCustomers} />
      </div>

      {/* SECTION 8 & 9 Grid: Shipping Summary & Coupon Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SECTION 8: Shipping Summary */}
        <ShippingSummary shippingSummary={shipping} />

        {/* SECTION 9: Coupon Summary */}
        <CouponSummary couponSummary={coupons} />
      </div>
    </div>
  );
}