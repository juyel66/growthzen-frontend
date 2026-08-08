"use client";

import React from "react";
import { Users, UserCheck, ShieldCheck, UserPlus } from "lucide-react";
import { UserManagementSummary, UserManagementMeta, UserStatsResponse } from "@/types/userManagement";

interface UserSummaryCardsProps {
  statsData?: UserStatsResponse | null;
  summary?: UserManagementSummary;
  meta?: UserManagementMeta;
  isLoading?: boolean;
  isError?: boolean;
  activeRoleFilter?: string;
  onSelectRoleFilter?: (role: string) => void;
}

const formatValue = (val: number | null | undefined, isError?: boolean): string => {
  if (isError || val === null || val === undefined) return "--";
  return new Intl.NumberFormat("en-US").format(val);
};

export const UserSummaryCards: React.FC<UserSummaryCardsProps> = ({
  statsData,
  summary,
  meta,
  isLoading = false,
  isError = false,
  activeRoleFilter,
  onSelectRoleFilter,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl animate-pulse space-y-3"
          >
            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-7 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  // Exact data sources from GET /users/stats API
  const totalUsers = isError
    ? null
    : statsData?.totalUsers ?? statsData?.data?.totalUsers ?? summary?.totalUsers ?? meta?.totalUsers ?? meta?.total;

  const totalCustomers = isError
    ? null
    : statsData?.totalCustomers ?? statsData?.data?.totalCustomers ?? summary?.customersCount ?? meta?.customersCount;

  // Display data.totalAdmins + data.totalSuperAdmins
  const adminsCalc =
    statsData?.totalAdmins !== undefined || statsData?.totalSuperAdmins !== undefined || statsData?.data?.totalAdmins !== undefined
      ? (statsData?.totalAdmins ?? statsData?.data?.totalAdmins ?? 0) + (statsData?.totalSuperAdmins ?? statsData?.data?.totalSuperAdmins ?? 0)
      : summary?.adminsCount ?? meta?.adminsCount;

  const totalAdminsCombined = isError ? null : adminsCalc;

  const newUsersToday = isError
    ? null
    : statsData?.newUsersToday ?? statsData?.data?.newUsersToday ?? summary?.newUsersToday ?? meta?.newUsersToday ?? meta?.todayUsersCount;

  const cards = [
    {
      role: "ALL",
      label: "Total Users",
      count: totalUsers,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200",
    },
    {
      role: "CUSTOMER",
      label: "Customers",
      count: totalCustomers,
      icon: UserCheck,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200",
    },
    {
      role: "ADMIN",
      label: "Admins",
      count: totalAdminsCombined,
      icon: ShieldCheck,
      color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200",
    },
    {
      role: "TODAY",
      label: "New Users Today",
      count: newUsersToday,
      icon: UserPlus,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isActive = activeRoleFilter === card.role;

        return (
          <div
            key={idx}
            onClick={() => onSelectRoleFilter && card.role !== "TODAY" && onSelectRoleFilter(card.role)}
            className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-2xs transition-all flex items-center justify-between cursor-pointer ${
              isActive
                ? "ring-2 ring-blue-500 border-blue-500 shadow-md"
                : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
            }`}
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {card.label}
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100 block tracking-tight">
                {formatValue(card.count, isError)}
              </span>
            </div>

            <div className={`p-3 rounded-xl border flex-shrink-0 ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
