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
import { DailyAnalyticsChartsSection } from "@/components/admin/dashboard/DailyAnalyticsChartsSection";
import { BusinessSummarySection } from "@/components/admin/dashboard/BusinessSummarySection";
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
  TrendingUp,
  Truck,
  Coins,
} from "lucide-react";

const formatCurrency = (val: number | undefined) => {
  if (val === undefined || val === null) return "৳0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT", currencyDisplay: "narrowSymbol",
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

  // Revenue & Business Accounting Cards (10 requested metrics)
  const kpiCards = [
    {
      title: "Gross Sales",
      value: revenue?.grossSales != null ? formatCurrency(revenue.grossSales) : revenue?.totalRevenue != null ? formatCurrency(revenue.totalRevenue) : "--",
      icon: DollarSign,
      colorBg: "bg-blue-50 dark:bg-blue-950/60",
      textColor: "text-blue-600 dark:text-blue-400",
      link: "/admin-dashboard/analytics/revenue",
    },
    {
      title: "Net Profit",
      value: revenue?.netProfit != null ? formatCurrency(revenue.netProfit) : "--",
      icon: TrendingUp,
      colorBg: "bg-emerald-50 dark:bg-emerald-950/60",
      textColor: "text-emerald-600 dark:text-emerald-400",
      link: "/admin-dashboard/analytics/revenue",
    },
    {
      title: "Product Cost",
      value: revenue?.productCost != null ? formatCurrency(revenue.productCost) : revenue?.totalCost != null ? formatCurrency(revenue.totalCost) : "--",
      icon: Package,
      colorBg: "bg-violet-50 dark:bg-violet-950/60",
      textColor: "text-violet-600 dark:text-violet-400",
      link: "/admin-dashboard/products",
    },
    {
      title: "Courier Cost",
      value: revenue?.courierCost != null ? formatCurrency(revenue.courierCost) : revenue?.totalCourierCost != null ? formatCurrency(revenue.totalCourierCost) : revenue?.courierServiceCost != null ? formatCurrency(revenue.courierServiceCost) : "--",
      icon: Truck,
      colorBg: "bg-amber-50 dark:bg-amber-950/60",
      textColor: "text-amber-600 dark:text-amber-400",
      link: "/admin-dashboard/orders",
    },
    {
      title: "Courier Profit",
      value: revenue?.courierProfit != null ? formatCurrency(revenue.courierProfit) : "--",
      icon: Coins,
      colorBg: "bg-indigo-50 dark:bg-indigo-950/60",
      textColor: "text-indigo-600 dark:text-indigo-400",
      link: "/admin-dashboard/orders",
    },
    {
      title: "Today's Gross Sales",
      value: revenue?.todaySales != null ? formatCurrency(revenue.todaySales) : revenue?.todayRevenue != null ? formatCurrency(revenue.todayRevenue) : "--",
      icon: Calendar,
      colorBg: "bg-sky-50 dark:bg-sky-950/60",
      textColor: "text-sky-600 dark:text-sky-400",
      link: "/admin-dashboard/analytics/revenue",
    },
    {
      title: "Today's Profit",
      value: revenue?.todayProfit != null ? formatCurrency(revenue.todayProfit) : "--",
      icon: TrendingUp,
      colorBg: "bg-teal-50 dark:bg-teal-950/60",
      textColor: "text-teal-600 dark:text-teal-400",
      link: "/admin-dashboard/analytics/revenue",
    },
    {
      title: "Today's Product Cost",
      value: revenue?.todayProductCost != null ? formatCurrency(revenue.todayProductCost) : revenue?.todayCost != null ? formatCurrency(revenue.todayCost) : "--",
      icon: Package,
      colorBg: "bg-rose-50 dark:bg-rose-950/60",
      textColor: "text-rose-600 dark:text-rose-400",
      link: "/admin-dashboard/products",
    },
    {
      title: "Today's Courier Cost",
      value: revenue?.todayCourierCost != null ? formatCurrency(revenue.todayCourierCost) : "--",
      icon: Truck,
      colorBg: "bg-purple-50 dark:bg-purple-950/60",
      textColor: "text-purple-600 dark:text-purple-400",
      link: "/admin-dashboard/orders",
    },
    {
      title: "Today's Quantity Sold",
      value: revenue?.todayQuantitySold != null ? formatNumber(revenue.todayQuantitySold) : revenue?.todayQuantity != null ? formatNumber(revenue.todayQuantity) : "--",
      icon: ShoppingBag,
      colorBg: "bg-amber-50 dark:bg-amber-950/60",
      textColor: "text-amber-600 dark:text-amber-400",
      link: "/admin-dashboard/orders",
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

      {/* SECTION 1: Revenue & Accounting Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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

      {/* SECTION 2: Business Summary Section */}
      <BusinessSummarySection overview={overview} />

      {/* SECTION 3: Daily Analytics Charts (5 Daily Backend Charts) */}
      <DailyAnalyticsChartsSection chartsData={chartsQuery.data} />

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
