"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  CreditCard,
  Ticket,
  Truck,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import {
  DashboardCustomerAnalytics,
  DashboardOrderAnalytics,
  DashboardPaymentAnalytics,
  DashboardProductSummary,
  DashboardRevenueAnalytics,
  DashboardCouponSummary,
  DashboardShippingSummary,
} from "@/types/dashboard";

interface KpiCardsSectionProps {
  revenue?: DashboardRevenueAnalytics;
  orders?: DashboardOrderAnalytics;
  products?: DashboardProductSummary;
  customers?: DashboardCustomerAnalytics;
  payments?: DashboardPaymentAnalytics;
  coupons?: DashboardCouponSummary;
  shipping?: DashboardShippingSummary;
}

const formatCurrency = (val?: number | null) => {
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

export const KpiCardsSection: React.FC<KpiCardsSectionProps> = ({
  revenue,
  orders,
  products,
  customers,
  payments,
  coupons,
  shipping,
}) => {
  const cards = [
    {
      title: "Gross Sales",
      value: formatCurrency(revenue?.grossSales),
      subtitle: `Total Product Sales`,
      icon: DollarSign,
      color: "from-blue-600 to-indigo-600",
      accentBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      link: "/admin-dashboard/analytics/revenue",
      breakdown: [
        { label: "Today", val: formatCurrency(revenue?.todaySales ?? revenue?.todayRevenue) },
      ],
    },
    {
      title: "Net Profit",
      value: formatCurrency(revenue?.netProfit),
      subtitle: `Net Company Profit`,
      icon: Sparkles,
      color: "from-emerald-600 to-teal-600",
      accentBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      link: "/admin-dashboard/analytics/revenue",
      breakdown: [
        { label: "Today", val: formatCurrency(revenue?.todayProfit) },
      ],
    },
    {
      title: "Product Cost",
      value: formatCurrency(revenue?.productCost ?? revenue?.totalCost),
      subtitle: `Total Cost of Goods`,
      icon: Package,
      color: "from-rose-600 to-pink-600",
      accentBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      link: "/admin-dashboard/analytics/revenue",
      breakdown: [
        { label: "Today", val: formatCurrency(revenue?.todayCost) },
      ],
    },
    {
      title: "Courier Cost",
      value: formatCurrency(revenue?.courierServiceCost ?? revenue?.totalCourierCost),
      subtitle: `Courier Expense`,
      icon: Truck,
      color: "from-amber-600 to-orange-600",
      accentBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      link: "/admin-dashboard/analytics/revenue",
      breakdown: [
        { label: "Today", val: formatCurrency(revenue?.todayCourierCost) },
      ],
    },
    {
      title: "Courier Profit",
      value: formatCurrency(revenue?.courierProfit),
      subtitle: `Delivery Margin`,
      icon: Truck,
      color: "from-indigo-600 to-sky-600",
      accentBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      link: "/admin-dashboard/analytics/revenue",
      breakdown: [
        { label: "Today", val: formatCurrency(revenue?.todayCourierProfit) },
      ],
    },
    {
      title: "Orders Overview",
      value: formatNumber(orders?.totalOrders),
      subtitle: `Delivered: ${formatNumber(orders?.deliveredOrders)}`,
      icon: ShoppingBag,
      color: "from-emerald-600 to-teal-600",
      accentBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      link: "/admin-dashboard/orders",
      breakdown: [
        { label: "Pending", val: formatNumber(orders?.pendingOrders) },
        { label: "Confirmed", val: formatNumber(orders?.confirmedOrders) },
        { label: "Processing", val: formatNumber(orders?.processingOrders) },
        { label: "Packed", val: formatNumber(orders?.packedOrders) },
        { label: "Shipped", val: formatNumber(orders?.shippedOrders) },
        { label: "Cancelled", val: formatNumber(orders?.cancelledOrders) },
        { label: "Returned", val: formatNumber(orders?.returnedOrders) },
      ],
    },
    {
      title: "Product Catalog",
      value: formatNumber(products?.totalProducts),
      subtitle: `Active: ${formatNumber(products?.activeProducts)}`,
      icon: Package,
      color: "from-violet-600 to-purple-600",
      accentBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      link: "/admin-dashboard/products",
      breakdown: [
        { label: "Active", val: formatNumber(products?.activeProducts) },
        { label: "Inactive", val: formatNumber(products?.inactiveProducts) },
        { label: "Featured", val: formatNumber(products?.featuredProducts) },
      ],
    },
    {
      title: "Customer Base",
      value: formatNumber(customers?.totalCustomers),
      subtitle: `Monthly Growth: +${formatNumber(customers?.monthlyCustomers)}`,
      icon: Users,
      color: "from-amber-600 to-orange-600",
      accentBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      link: "/admin-dashboard/customers",
      breakdown: [
        { label: "Today", val: formatNumber(customers?.todayCustomers) },
        { label: "Weekly", val: formatNumber(customers?.weeklyCustomers) },
        { label: "Monthly", val: formatNumber(customers?.monthlyCustomers) },
        { label: "Yearly", val: formatNumber(customers?.yearlyCustomers) },
      ],
    },
    {
      title: "Payments Settled",
      value: formatNumber(payments?.totalPayments),
      subtitle: `Paid: ${formatNumber(payments?.paidPayments)}`,
      icon: CreditCard,
      color: "from-cyan-600 to-blue-600",
      accentBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      link: "/admin-dashboard/payments",
      breakdown: [
        { label: "Pending", val: formatNumber(payments?.pendingPayments) },
        { label: "Paid", val: formatNumber(payments?.paidPayments) },
        { label: "Failed", val: formatNumber(payments?.failedPayments) },
        { label: "Cancelled", val: formatNumber(payments?.cancelledPayments) },
        { label: "Refunded", val: formatNumber(payments?.refundedPayments) },
      ],
    },
    {
      title: "Active Coupons",
      value: formatNumber(coupons?.totalCoupons),
      subtitle: "Campaign Promotions",
      icon: Ticket,
      color: "from-rose-600 to-pink-600",
      accentBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      link: "/admin-dashboard/coupons",
      breakdown: [
        { label: "Total Coupons", val: formatNumber(coupons?.totalCoupons) },
      ],
    },
    {
      title: "Shipping Methods",
      value: formatNumber(shipping?.totalShippingMethods),
      subtitle: `Active: ${formatNumber(shipping?.activeShippingMethods)}`,
      icon: Truck,
      color: "from-indigo-600 to-sky-600",
      accentBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      link: "/admin-dashboard/delivery-management",
      breakdown: [
        { label: "Active", val: formatNumber(shipping?.activeShippingMethods) },
        {
          label: "Inactive",
          val: formatNumber(shipping?.inactiveShippingMethods),
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Link key={idx} href={card.link} className="block group">
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="h-full bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Top Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {card.title}
                  </span>
                  <div
                    className={`p-2.5 rounded-xl ${card.accentBg} transition-transform group-hover:scale-110`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Primary Metric Value */}
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    {card.value}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {card.subtitle}
                </p>
              </div>

              {/* Sub-breakdown badges */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                {card.breakdown.map((item, bIdx) => (
                  <span
                    key={bIdx}
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700"
                  >
                    <span className="text-slate-400">{item.label}:</span>
                    <span className="font-bold">{item.val}</span>
                  </span>
                ))}
              </div>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
};

