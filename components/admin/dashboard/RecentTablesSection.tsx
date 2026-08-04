"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DashboardRecent,
  DashboardRecentOrderItem,
  DashboardRecentCustomerItem,
  DashboardTopSellingProductItem,
  DashboardRecentPaymentItem,
} from "@/types/dashboard";
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
  Users,
  Award,
  CreditCard,
} from "lucide-react";

interface RecentTablesSectionProps {
  recentData?: DashboardRecent;
}

const getStatusBadge = (status: string | null) => {
  if (!status) return null;
  const s = status.toUpperCase();

  let color = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  if (["DELIVERED", "PAID", "COMPLETED", "ACTIVE"].includes(s)) {
    color = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800";
  } else if (["PENDING", "PROCESSING", "PACKED", "CONFIRMED"].includes(s)) {
    color = "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-800";
  } else if (["SHIPPED"].includes(s)) {
    color = "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/60 dark:border-blue-800";
  } else if (["CANCELLED", "FAILED", "INACTIVE"].includes(s)) {
    color = "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60 dark:border-rose-800";
  } else if (["REFUNDED", "RETURNED"].includes(s)) {
    color = "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/60 dark:border-purple-800";
  }

  return (
    <span
      className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md border tracking-wide uppercase ${color}`}
    >
      {s}
    </span>
  );
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(val || 0);
};

const formatDate = (dateStr: string | Date) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const RecentTablesSection: React.FC<RecentTablesSectionProps> = ({
  recentData,
}) => {
  const [activeTab, setActiveTab] = useState<
    "orders" | "customers" | "products" | "payments"
  >("orders");

  // Search States
  const [ordersSearch, setOrdersSearch] = useState("");
  const [customersSearch, setCustomersSearch] = useState("");
  const [productsSearch, setProductsSearch] = useState("");
  const [paymentsSearch, setPaymentsSearch] = useState("");

  // Sort States
  const [ordersSortDir, setOrdersSortDir] = useState<"asc" | "desc">("desc");
  const [customersSortDir, setCustomersSortDir] = useState<"asc" | "desc">("desc");
  const [productsSortDir, setProductsSortDir] = useState<"asc" | "desc">("desc");
  const [paymentsSortDir, setPaymentsSortDir] = useState<"asc" | "desc">("desc");

  // Pagination States (5 items per page)
  const PAGE_SIZE = 5;
  const [ordersPage, setOrdersPage] = useState(1);
  const [customersPage, setCustomersPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);
  const [paymentsPage, setPaymentsPage] = useState(1);

  // 1. Filtered & Sorted Recent Orders
  const processedOrders = useMemo(() => {
    let list = [...(recentData?.recentOrders || [])];
    if (ordersSearch.trim()) {
      const q = ordersSearch.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.orderStatus?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return ordersSortDir === "desc" ? timeB - timeA : timeA - timeB;
    });
    return list;
  }, [recentData?.recentOrders, ordersSearch, ordersSortDir]);

  // 2. Filtered & Sorted Customers
  const processedCustomers = useMemo(() => {
    let list = [...(recentData?.recentCustomers || [])];
    if (customersSearch.trim()) {
      const q = customersSearch.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const timeA = new Date(a.registrationDate).getTime();
      const timeB = new Date(b.registrationDate).getTime();
      return customersSortDir === "desc" ? timeB - timeA : timeA - timeB;
    });
    return list;
  }, [recentData?.recentCustomers, customersSearch, customersSortDir]);

  // 3. Filtered & Sorted Top Products
  const processedProducts = useMemo(() => {
    let list = [...(recentData?.topSellingProducts || [])];
    if (productsSearch.trim()) {
      const q = productsSearch.toLowerCase();
      list = list.filter((p) => p.productName?.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      return productsSortDir === "desc"
        ? b.soldQuantity - a.soldQuantity
        : a.soldQuantity - b.soldQuantity;
    });
    return list;
  }, [recentData?.topSellingProducts, productsSearch, productsSortDir]);

  // 4. Filtered & Sorted Recent Payments
  const processedPayments = useMemo(() => {
    let list = [...(recentData?.recentPayments || [])];
    if (paymentsSearch.trim()) {
      const q = paymentsSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.customer?.toLowerCase().includes(q) ||
          p.paymentStatus?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return paymentsSortDir === "desc" ? timeB - timeA : timeA - timeB;
    });
    return list;
  }, [recentData?.recentPayments, paymentsSearch, paymentsSortDir]);

  // Paged Data slices
  const pagedOrders = processedOrders.slice(
    (ordersPage - 1) * PAGE_SIZE,
    ordersPage * PAGE_SIZE
  );
  const pagedCustomers = processedCustomers.slice(
    (customersPage - 1) * PAGE_SIZE,
    customersPage * PAGE_SIZE
  );
  const pagedProducts = processedProducts.slice(
    (productsPage - 1) * PAGE_SIZE,
    productsPage * PAGE_SIZE
  );
  const pagedPayments = processedPayments.slice(
    (paymentsPage - 1) * PAGE_SIZE,
    paymentsPage * PAGE_SIZE
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header & Tabs */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Recent Enterprise Activity
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time feed of recent orders, customer registrations, top products, & payment audit logs
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "orders"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders ({recentData?.recentOrders?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "customers"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Customers ({recentData?.recentCustomers?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "products"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Top Products ({recentData?.topSellingProducts?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "payments"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payments ({recentData?.recentPayments?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* 1. RECENT ORDERS TABLE */}
      {activeTab === "orders" && (
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search order number or customer..."
                value={ordersSearch}
                onChange={(e) => {
                  setOrdersSearch(e.target.value);
                  setOrdersPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <button
              onClick={() =>
                setOrdersSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-slate-100"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort Date: {ordersSortDir.toUpperCase()}</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Order Number</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pagedOrders.length > 0 ? (
                  pagedOrders.map((item: DashboardRecentOrderItem, idx: number) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="p-3.5 font-bold text-blue-600 dark:text-blue-400">
                        {item.orderNumber}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                        {item.customerName || "Guest User"}
                      </td>
                      <td className="p-3.5 font-bold">
                        {formatCurrency(item.totalAmount)}
                      </td>
                      <td className="p-3.5">
                        <span className="font-medium text-slate-600 dark:text-slate-400">
                          {item.paymentMethod || "COD"}
                        </span>
                      </td>
                      <td className="p-3.5">{getStatusBadge(item.orderStatus)}</td>
                      <td className="p-3.5 text-slate-500">{formatDate(item.createdAt)}</td>
                      <td className="p-3.5 text-right">
                        <Link
                          href="/admin-dashboard/orders"
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No recent orders found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {processedOrders.length > PAGE_SIZE && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <span>
                Showing {Math.min((ordersPage - 1) * PAGE_SIZE + 1, processedOrders.length)} to{" "}
                {Math.min(ordersPage * PAGE_SIZE, processedOrders.length)} of {processedOrders.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={ordersPage === 1}
                  onClick={() => setOrdersPage((p) => p - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Page {ordersPage} of {Math.ceil(processedOrders.length / PAGE_SIZE)}
                </span>
                <button
                  disabled={ordersPage >= Math.ceil(processedOrders.length / PAGE_SIZE)}
                  onClick={() => setOrdersPage((p) => p + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. RECENT CUSTOMERS TABLE */}
      {activeTab === "customers" && (
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={customersSearch}
                onChange={(e) => {
                  setCustomersSearch(e.target.value);
                  setCustomersPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <button
              onClick={() =>
                setCustomersSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-slate-100"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort Registration: {customersSortDir.toUpperCase()}</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Email Address</th>
                  <th className="p-3.5">Registration Date</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pagedCustomers.length > 0 ? (
                  pagedCustomers.map((item: DashboardRecentCustomerItem, idx: number) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center font-black text-xs">
                          {item.name ? item.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span>{item.name || "Anonymous User"}</span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-600 dark:text-slate-400">
                        {item.email}
                      </td>
                      <td className="p-3.5 text-slate-500">{formatDate(item.registrationDate)}</td>
                      <td className="p-3.5 text-right">
                        <Link
                          href="/admin-dashboard/customers"
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">
                      No customer accounts match criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {processedCustomers.length > PAGE_SIZE && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <span>
                Showing {Math.min((customersPage - 1) * PAGE_SIZE + 1, processedCustomers.length)} to{" "}
                {Math.min(customersPage * PAGE_SIZE, processedCustomers.length)} of {processedCustomers.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={customersPage === 1}
                  onClick={() => setCustomersPage((p) => p - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Page {customersPage} of {Math.ceil(processedCustomers.length / PAGE_SIZE)}
                </span>
                <button
                  disabled={customersPage >= Math.ceil(processedCustomers.length / PAGE_SIZE)}
                  onClick={() => setCustomersPage((p) => p + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. TOP SELLING PRODUCTS TABLE */}
      {activeTab === "products" && (
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search product name..."
                value={productsSearch}
                onChange={(e) => {
                  setProductsSearch(e.target.value);
                  setProductsPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <button
              onClick={() =>
                setProductsSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-slate-100"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort Units Sold: {productsSortDir.toUpperCase()}</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Sold Quantity</th>
                  <th className="p-3.5">Total Revenue</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pagedProducts.length > 0 ? (
                  pagedProducts.map((item: DashboardTopSellingProductItem, idx: number) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700 flex-shrink-0">
                          {item.thumbnailImage ? (
                            <Image
                              src={item.thumbnailImage}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                              No Img
                            </div>
                          )}
                        </div>
                        <span>{item.productName}</span>
                      </td>
                      <td className="p-3.5 font-extrabold text-indigo-600 dark:text-indigo-400">
                        {item.soldQuantity} Units
                      </td>
                      <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(item.revenue)}
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          href={`/admin-dashboard/products/edit/${item.productId}`}
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                        >
                          Edit <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">
                      No top selling product entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {processedProducts.length > PAGE_SIZE && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <span>
                Showing {Math.min((productsPage - 1) * PAGE_SIZE + 1, processedProducts.length)} to{" "}
                {Math.min(productsPage * PAGE_SIZE, processedProducts.length)} of {processedProducts.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={productsPage === 1}
                  onClick={() => setProductsPage((p) => p - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Page {productsPage} of {Math.ceil(processedProducts.length / PAGE_SIZE)}
                </span>
                <button
                  disabled={productsPage >= Math.ceil(processedProducts.length / PAGE_SIZE)}
                  onClick={() => setProductsPage((p) => p + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. RECENT PAYMENTS TABLE */}
      {activeTab === "payments" && (
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search customer or status..."
                value={paymentsSearch}
                onChange={(e) => {
                  setPaymentsSearch(e.target.value);
                  setPaymentsPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <button
              onClick={() =>
                setPaymentsSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-slate-100"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort Date: {paymentsSortDir.toUpperCase()}</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Method</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pagedPayments.length > 0 ? (
                  pagedPayments.map((item: DashboardRecentPaymentItem, idx: number) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                        {item.customer || "Anonymous"}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-600 dark:text-slate-400">
                        {item.paymentMethod}
                      </td>
                      <td className="p-3.5">{getStatusBadge(item.paymentStatus)}</td>
                      <td className="p-3.5 text-slate-500">{formatDate(item.date)}</td>
                      <td className="p-3.5 text-right">
                        <Link
                          href="/admin-dashboard/payments"
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No payment records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {processedPayments.length > PAGE_SIZE && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <span>
                Showing {Math.min((paymentsPage - 1) * PAGE_SIZE + 1, processedPayments.length)} to{" "}
                {Math.min(paymentsPage * PAGE_SIZE, processedPayments.length)} of {processedPayments.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={paymentsPage === 1}
                  onClick={() => setPaymentsPage((p) => p - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Page {paymentsPage} of {Math.ceil(processedPayments.length / PAGE_SIZE)}
                </span>
                <button
                  disabled={paymentsPage >= Math.ceil(processedPayments.length / PAGE_SIZE)}
                  onClick={() => setPaymentsPage((p) => p + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
