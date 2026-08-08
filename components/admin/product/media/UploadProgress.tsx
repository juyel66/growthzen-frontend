'use client';

import React from 'react';
import { Loader2, X, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatFileSize } from '@/constants/media';
import { UploadStatus } from '@/types/upload';

interface UploadProgressProps {
  fileName: string;
  fileSize?: number;
  progress: number;
  status: UploadStatus;
  error?: string;
  onCancel?: () => void;
  onRetry?: () => void;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  fileName,
  fileSize,
  progress,
  status,
  error,
  onCancel,
  onRetry,
}) => {
  return (
    <div className="flex flex-col gap-2 p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl shadow-2xs transition-all">
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {status === 'uploading' && (
            <Loader2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin shrink-0" />
          )}
          {status === 'completed' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          )}
          {(status === 'error' || status === 'cancelled') && (
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          )}

          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
              {fileName}
            </span>
            {fileSize && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {formatFileSize(fileSize)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {status === 'uploading' && (
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
              {Math.round(progress)}%
            </span>
          )}

          {status === 'uploading' && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="p-1 text-slate-400 hover:text-rose-500 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              title="Cancel Upload"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {(status === 'error' || status === 'cancelled') && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white font-bold text-[11px] rounded-lg flex items-center gap-1 cursor-pointer transition shadow-2xs"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      {status === 'uploading' && (
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-150 ease-out"
            style={{ width: `${Math.min(Math.max(progress, 2), 100)}%` }}
          />
        </div>
      )}

      {/* Error display */}
      {error && (status === 'error' || status === 'cancelled') && (
        <p className="text-[11px] font-medium text-rose-500 mt-0.5">{error}</p>
      )}
    </div>
  );
};

export default UploadProgress;

