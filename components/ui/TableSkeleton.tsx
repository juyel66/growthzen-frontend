"use client";

import React, { memo } from "react";

export interface BadgeSkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export const BadgeSkeleton: React.FC<BadgeSkeletonProps> = memo(({
  width = "w-16",
  height = "h-4",
  className = "",
}) => (
  <div
    className={`inline-block rounded-md animate-shimmer ${width} ${height} ${className}`}
  />
));
BadgeSkeleton.displayName = "BadgeSkeleton";

export interface ActionSkeletonProps {
  count?: number;
  className?: string;
}

export const ActionSkeleton: React.FC<ActionSkeletonProps> = memo(({
  count = 4,
  className = "",
}) => (
  <div className={`flex items-center justify-end gap-1.5 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="w-7 h-7 rounded-lg animate-shimmer flex-shrink-0"
      />
    ))}
  </div>
));
ActionSkeleton.displayName = "ActionSkeleton";

export interface TableSkeletonRowProps {
  columns?: number;
  className?: string;
}

export const TableSkeletonRow: React.FC<TableSkeletonRowProps> = memo(({
  columns = 8,
  className = "",
}) => (
  <tr className={`border-b border-slate-100 dark:border-slate-800 ${className}`}>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="p-3.5 whitespace-nowrap">
        <div className="h-4 w-3/4 rounded-md animate-shimmer" />
      </td>
    ))}
  </tr>
));
TableSkeletonRow.displayName = "TableSkeletonRow";

export interface OrderTableSkeletonRowProps {
  className?: string;
}

export const OrderTableSkeletonRow: React.FC<OrderTableSkeletonRowProps> = memo(({
  className = "",
}) => (
  <tr className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${className}`}>
    {/* 1. Order Code */}
    <td className="p-3.5 whitespace-nowrap">
      <div className="h-4 w-24 rounded-md animate-shimmer" />
    </td>

    {/* 2. Customer */}
    <td className="p-3.5 whitespace-nowrap">
      <div className="flex items-center gap-2">
        <div className="h-4 w-28 rounded-md animate-shimmer" />
        <BadgeSkeleton width="w-10" height="h-4" />
      </div>
    </td>

    {/* 3. Phone */}
    <td className="p-3.5 whitespace-nowrap">
      <div className="h-4 w-24 rounded-md animate-shimmer" />
    </td>

    {/* 4. Grand Total */}
    <td className="p-3.5 whitespace-nowrap">
      <div className="h-4 w-16 rounded-md animate-shimmer" />
    </td>

    {/* 5. Payment Method & Status */}
    <td className="p-3.5 whitespace-nowrap">
      <div className="flex items-center gap-1.5">
        <div className="h-4 w-10 rounded-md animate-shimmer" />
        <BadgeSkeleton width="w-14" height="h-4" />
      </div>
    </td>

    {/* 6. Order Status */}
    <td className="p-3.5 whitespace-nowrap">
      <BadgeSkeleton width="w-20" height="h-5" />
    </td>

    {/* 7. Courier Cost */}
    <td className="p-3.5 whitespace-nowrap">
      <div className="h-4 w-12 rounded-md animate-shimmer" />
    </td>

    {/* 8. Net Profit */}
    <td className="p-3.5 whitespace-nowrap">
      <div className="h-4 w-14 rounded-md animate-shimmer" />
    </td>

    {/* 9. Date */}
    <td className="p-3.5 whitespace-nowrap">
      <div className="h-4 w-20 rounded-md animate-shimmer" />
    </td>

    {/* 10. Actions */}
    <td className="p-3.5 text-right whitespace-nowrap">
      <ActionSkeleton count={4} />
    </td>
  </tr>
));
OrderTableSkeletonRow.displayName = "OrderTableSkeletonRow";

export interface PaymentTableSkeletonRowProps {
  className?: string;
}

export const PaymentTableSkeletonRow: React.FC<PaymentTableSkeletonRowProps> = memo(({
  className = "",
}) => (
  <tr className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${className}`}>
    {/* 1. Payment ID */}
    <td className="p-3.5 whitespace-nowrap">
      <div className="h-4 w-20 rounded-md animate-shimmer" />
    </td>

    {/* 2. Order Number */}
    <td className="p-3.5 whitespace-nowrap">
      <div className="h-4 w-24 rounded-md animate-shimmer" />
    </td>

    {/* 3. Method */}
    <td className="p-3.5 whitespace-nowrap">
      <BadgeSkeleton width="w-12" height="h-4" />
    </td>

    {/* 4. Amount */}
    <td className="p-3.5 whitespace-nowrap">
      <div className="h-4 w-16 rounded-md animate-shimmer" />
    </td>

    {/* 5. Payment Collected */}
    <td className="p-3.5 whitespace-nowrap">
      <BadgeSkeleton width="w-16" height="h-5" />
    </td>

    {/* 6. Transaction Ref / Phone */}
    <td className="p-3.5 whitespace-nowrap">
      <div className="h-4 w-28 rounded-md animate-shimmer" />
    </td>

    {/* 7. Created Date */}
    <td className="p-3.5 whitespace-nowrap">
      <div className="h-4 w-20 rounded-md animate-shimmer" />
    </td>

    {/* 8. Actions */}
    <td className="p-3.5 text-right w-[200px] min-w-[200px] whitespace-nowrap">
      <ActionSkeleton count={4} />
    </td>
  </tr>
));
PaymentTableSkeletonRow.displayName = "PaymentTableSkeletonRow";

export interface CardSkeletonProps {
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = memo(({ className = "" }) => (
  <div className={`p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3 ${className}`}>
    <div className="flex items-center justify-between">
      <div className="w-8 h-8 rounded-xl animate-shimmer" />
      <BadgeSkeleton width="w-12" height="h-4" />
    </div>
    <div className="h-3 w-20 rounded-md animate-shimmer" />
    <div className="h-6 w-24 rounded-md animate-shimmer" />
  </div>
));
CardSkeleton.displayName = "CardSkeleton";

export interface SearchSkeletonProps {
  className?: string;
}

export const SearchSkeleton: React.FC<SearchSkeletonProps> = memo(({ className = "" }) => (
  <div className={`h-10 rounded-xl animate-shimmer w-full ${className}`} />
));
SearchSkeleton.displayName = "SearchSkeleton";

export interface TableSkeletonProps {
  rows?: number;
  headers?: string[];
  children?: React.ReactNode;
  className?: string;
  isOrderTable?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = memo(({
  rows = 10,
  headers = [
    "Order Number",
    "Customer",
    "Phone",
    "Grand Total",
    "Payment",
    "Order Status",
    "Date",
    "Actions",
  ],
  children,
  className = "",
  isOrderTable = true,
}) => (
  <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs overflow-hidden ${className}`}>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
        <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/90 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 z-10">
          <tr>
            {headers.map((h, idx) => (
              <th
                key={idx}
                className={`p-3.5 ${idx === headers.length - 1 ? "text-right" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {children
            ? children
            : Array.from({ length: rows }).map((_, i) =>
              isOrderTable ? (
                <OrderTableSkeletonRow key={i} />
              ) : (
                <TableSkeletonRow key={i} columns={headers.length} />
              )
            )}
        </tbody>
      </table>
    </div>
  </div>
));
TableSkeleton.displayName = "TableSkeleton";

