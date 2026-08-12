"use client";

import React from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  CreditCard,
  Truck,
  Ticket,
} from "lucide-react";

export type ReportTabType =
  | "sales"
  | "revenue"
  | "orders"
  | "products"
  | "customers"
  | "payments"
  | "coupons";

export type ReportTypeTab = ReportTabType;

interface ReportTabsProps {
  activeTab: ReportTabType;
  setActiveTab: (tab: ReportTabType) => void;
  onTabChange?: (tab: ReportTabType) => void;
}

const TABS: { id: ReportTabType; label: string; icon: React.ElementType }[] = [
  { id: "sales", label: "Sales", icon: TrendingUp },
  { id: "revenue", label: "Revenue", icon: DollarSign },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "products", label: "Products", icon: Package },
  { id: "customers", label: "Customers", icon: Users },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "coupons", label: "Coupons", icon: Ticket },
];

export const ReportTabs: React.FC<ReportTabsProps> = ({
  activeTab,
  setActiveTab,
  onTabChange,
}) => {
  const handleClick = (tab: ReportTabType) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-100/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/70 dark:border-slate-800 scrollbar-none">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => handleClick(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700 font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-800/50"
            }`}
          >
            <Icon
              className={`w-4 h-4 transition-colors ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
