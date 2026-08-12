"use client";

import React, { useState } from "react";
import { ExportFormat, ReportQueryParams } from "@/types/report";
import { downloadReportFile, ReportType } from "@/utils/exportReport";
import { Download, FileText, FileSpreadsheet, FileCode, Loader2, X } from "lucide-react";

interface ReportExportModalProps {
  reportType: ReportType;
  queryParams: ReportQueryParams;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  reportType,
  queryParams,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("csv");

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await downloadReportFile(reportType, selectedFormat, queryParams);
      setIsOpen(false);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span>Export Report</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 capitalize">
                  Export {reportType} Report
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                disabled={isExporting}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Select the file format to download the complete filtered dataset.
            </p>

            <div className="space-y-2 mb-6">
              {[
                {
                  id: "csv",
                  label: "CSV File (.csv)",
                  desc: "Raw tabular data formatted for spreadsheet tools",
                  icon: FileCode,
                },
                {
                  id: "xlsx",
                  label: "Excel Spreadsheet (.xlsx)",
                  desc: "Formatted workbook ready for Microsoft Excel",
                  icon: FileSpreadsheet,
                },
                {
                  id: "pdf",
                  label: "PDF Document (.pdf)",
                  desc: "Printable document layout format",
                  icon: FileText,
                },
              ].map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = selectedFormat === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setSelectedFormat(fmt.id as ExportFormat)}
                    disabled={isExporting}
                    className={`w-full flex items-start gap-3 p-3 text-left rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500/80 text-emerald-900 dark:text-emerald-200"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 mt-0.5 ${
                        isSelected
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-400"
                      }`}
                    />
                    <div>
                      <div className="text-xs font-bold">{fmt.label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {fmt.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isExporting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-500/20 disabled:opacity-60 transition-all cursor-pointer"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
