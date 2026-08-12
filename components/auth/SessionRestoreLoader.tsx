'use client';

import React from 'react';

interface SessionRestoreLoaderProps {
  message?: string;
}

export const SessionRestoreLoader: React.FC<SessionRestoreLoaderProps> = ({
  message = 'Restoring session...',
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md transition-opacity duration-300">
      <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-base font-bold tracking-wide text-white">
            GrowthZen Trends
          </span>
          <span className="text-xs font-medium text-emerald-400 animate-pulse">
            {message}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SessionRestoreLoader;

