"use client";

import React from "react";
import Link from "next/link";
import { DashboardRecentCustomerItem } from "@/types/dashboard";
import { Users, ArrowRight, ExternalLink } from "lucide-react";

interface RecentCustomersProps {
  customers?: DashboardRecentCustomerItem[];
}

const formatDate = (dateStr: string | Date) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const RecentCustomers: React.FC<RecentCustomersProps> = ({
  customers = [],
}) => {
  const latest5 = customers.slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Recent Customer Registrations
          </h3>
        </div>

        <Link
          href="/admin-dashboard/customers"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="p-3">Customer Name</th>
              <th className="p-3">Email Address</th>
              <th className="p-3">Registration Date</th>
              <th className="p-3 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {latest5.length > 0 ? (
              latest5.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-3 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center font-black text-[10px]">
                      {item.name ? item.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span>{item.name || "Anonymous"}</span>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{item.email}</td>
                  <td className="p-3 text-slate-500">{formatDate(item.registrationDate)}</td>
                  <td className="p-3 text-right">
                    <Link
                      href="/admin-dashboard/customers"
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-400">
                  No recent customer signups.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

