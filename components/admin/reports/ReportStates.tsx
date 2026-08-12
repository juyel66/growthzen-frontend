"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Layers } from "lucide-react";
import { ReportCardsSkeleton, ReportChartSkeleton, ReportTableSkeleton } from "./ReportSkeletons";

export const ReportSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <ReportCardsSkeleton />
      <ReportChartSkeleton />
      <ReportTableSkeleton />
    </div>
  );
};

interface ReportErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ReportErrorState: React.FC<ReportErrorStateProps> = ({
  message = "Failed to load report data from server.",
  onRetry,
}) => {
  return (
    <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-8 text-center my-6">
      <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
      <h3 className="text-base font-bold text-rose-900 dark:text-rose-200">
        Report Generation Error
      </h3>
      <p className="text-xs text-rose-700 dark:text-rose-400 mt-1 max-w-md mx-auto">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Loading Report
        </button>
      )}
    </div>
  );
};

interface ReportEmptyStateProps {
  title?: string;
  message?: string;
}

export const ReportEmptyState: React.FC<ReportEmptyStateProps> = ({
  title = "No report data available for this period.",
  message = "Try selecting a broader date range or clearing specific filter criteria.",
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-100 dark:border-slate-800 text-center my-6">
      <Layers className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
        {title}
      </h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
        {message}
      </p>
    </div>
  );
};
