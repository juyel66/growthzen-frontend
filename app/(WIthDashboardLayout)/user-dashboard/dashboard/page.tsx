"use client";

import React from "react";
import Link from "next/link";
import { useGetMyOrdersQuery, useGetMyOrderSummaryQuery } from "@/services/orderApi";
import { useGetWishlistQuery } from "@/services/wishlistApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/features/auth/authSlice";
import { PrivateRoute } from "@/components/auth/AuthGuards";
import {
  Package,
  ShoppingBag,
  ShoppingCart,
  Heart,
  FileText,
  User,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Clock,
  DollarSign,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function UserDashboardPage() {
  return (
    <PrivateRoute>
      <UserDashboardContent />
    </PrivateRoute>
  );
}

function UserDashboardContent() {
  const currentUser = useAppSelector(selectCurrentUser);
  const isReseller = currentUser?.role?.toUpperCase() === "RESELLER";

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useGetMyOrdersQuery();

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    refetch: refetchSummary,
  } = useGetMyOrderSummaryQuery();

  const { data: wishlistData } = useGetWishlistQuery();

  const orders = Array.isArray(ordersData) ? ordersData : (ordersData?.items || []);
  const isLoading = isOrdersLoading || isSummaryLoading;
  const isError = isOrdersError || isSummaryError;

  const totalOrders = summaryData?.totalOrders ?? orders.length;
  const pendingOrders = summaryData?.pendingOrders ?? orders.filter((o) =>
    ["PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED"].includes((o.status || "").toUpperCase())
  ).length;
  const deliveredOrders = summaryData?.deliveredOrders ?? orders.filter((o) => (o.status || "").toUpperCase() === "DELIVERED").length;
  const totalPurchase = summaryData?.totalPurchase ?? orders.reduce((sum, o) => sum + (Number(o.payableAmount) || 0), 0);
  const recentOrders = summaryData?.recentOrders ?? orders.slice(0, 5);
  const wishlistCount = wishlistData?.items?.length || wishlistData?.totalItems || 0;

  const handleRetry = () => {
    refetchOrders();
    refetchSummary();
  };


  const quickLinks = [
    {
      title: "Browse Products",
      desc: "Discover catalog & special prices",
      href: "/products",
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200",
    },
    {
      title: "Shopping Cart",
      desc: "Review selected items",
      href: "/cart",
      icon: ShoppingCart,
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200",
    },
    {
      title: "My Orders",
      desc: "Track purchase history & status",
      href: "/order/my-orders",
      icon: Package,
      color: "bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200",
    },
    {
      title: "My Invoices",
      desc: "Print delivered order invoices",
      href: "/user-dashboard/invoices",
      icon: FileText,
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200",
    },
    {
      title: "Saved Wishlist",
      desc: "Items saved for later",
      href: "/wishlist",
      icon: Heart,
      color: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200",
    },
    {
      title: "Account Profile",
      desc: "Manage security & password",
      href: "/auth/change-password",
      icon: User,
      color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200",
    },
  ];

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 rounded-3xl text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full bg-white/20 backdrop-blur-xs">
              {isReseller ? "Reseller Account" : "Customer Portal"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {currentUser?.name || currentUser?.email || "Partner"}!
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            {isReseller
              ? "Access wholesale catalog pricing, manage purchases, track order deliveries, and print official invoices."
              : "Manage your shopping experience, track orders, and view invoices."}
          </p>
        </div>

        <Link
          href="/products"
          className="flex items-center gap-2 px-5 py-3 bg-white text-blue-700 font-extrabold text-xs rounded-2xl shadow-md hover:bg-blue-50 transition cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Shop Catalog</span>
        </Link>
      </div>

      {/* Error state */}
      {isError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Failed to load dashboard data. Please try again.</span>
          </div>
          <button
            onClick={handleRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Orders
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100 block mt-1">
              {isLoading ? "--" : totalOrders}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200">
            <Package className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Pending Orders
            </span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 block mt-1">
              {isLoading ? "--" : pendingOrders}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Delivered Orders
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">
              {isLoading ? "--" : deliveredOrders}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Total Purchase */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Purchase
            </span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 block mt-1">
              {isLoading ? "--" : `৳${totalPurchase.toFixed(2)}`}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>


      {/* Recent Orders Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Recent Orders
          </h2>
          <Link
            href="/order/my-orders"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isOrdersLoading ? (
          <div className="py-8 text-center text-xs text-slate-400 font-semibold animate-pulse">
            Loading recent orders...
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-500">No orders yet</p>
            <Link
              href="/products"
              className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/90 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-3">Order #</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentOrders.map((order) => {
                  const code = order.orderCode || order.id;
                  const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "--";
                  const status = (order.status || "PENDING").toUpperCase();
                  const amount = Number(order.payableAmount || 0).toFixed(2);

                  let statusColor = "bg-slate-100 text-slate-700";
                  if (status === "DELIVERED") statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                  else if (status === "PENDING") statusColor = "bg-amber-50 text-amber-700 border-amber-200";
                  else if (status === "CANCELLED") statusColor = "bg-rose-50 text-rose-700 border-rose-200";
                  else statusColor = "bg-blue-50 text-blue-700 border-blue-200";

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-extrabold text-blue-600 dark:text-blue-400">{code}</td>
                      <td className="p-3 text-slate-500">{dateStr}</td>
                      <td className="p-3 font-black text-slate-900 dark:text-slate-100">৳{amount}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md border ${statusColor}`}>
                          {status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/order/my-orders`}
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold rounded-lg transition text-[11px]"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          Quick Portal Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-xs transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl border ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 block group-hover:text-blue-600 transition">
                      {item.title}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{item.desc}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
