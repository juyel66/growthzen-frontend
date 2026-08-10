"use client";

import React from "react";
import Image from "next/image";
import { BannerItem } from "@/types/settings";
import { formatImageUrl } from "@/utils/imageUrl";
import { X, ExternalLink, Calendar, Hash, CheckCircle2, XCircle } from "lucide-react";

interface BannerLightboxModalProps {
  banner: BannerItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BannerLightboxModal: React.FC<BannerLightboxModalProps> = ({
  banner,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !banner) return null;

  const isActive = banner.isActive !== false;
  const buttonUrl = banner.buttonUrl || banner.buttonLink || "#";
  const imgUrl = formatImageUrl(banner.image);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-black text-xs">
              Order #{banner.displayOrder ?? 0}
            </span>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Banner Lightbox & Live Simulation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Banner Hero Render */}
          <div className="relative rounded-3xl overflow-hidden min-h-[300px] bg-slate-950 text-white flex flex-col justify-end p-8 sm:p-12 shadow-2xl border border-slate-800">
            {imgUrl ? (
              <Image
                src={imgUrl}
                alt={banner.title}
                fill
                unoptimized={imgUrl.startsWith("http://localhost") || imgUrl.startsWith("http://127.0.0.1")}
                className="object-cover opacity-70"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                No Banner Image
              </div>
            )}

            <div className="relative z-10 space-y-3 max-w-lg">
              {banner.subtitle && (
                <span className="inline-block px-3.5 py-1 rounded-full bg-blue-600/90 text-white text-[11px] font-extrabold uppercase tracking-widest">
                  {banner.subtitle}
                </span>
              )}
              <h1 className="text-3xl font-black text-white leading-tight">
                {banner.title}
              </h1>
              {banner.description && (
                <p className="text-sm text-slate-200">{banner.description}</p>
              )}
              {banner.buttonText && (
                <div className="pt-2">
                  <a
                    href={buttonUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg transition"
                  >
                    <span>{banner.buttonText}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Status</span>
              <div className="flex items-center gap-1.5 font-bold text-xs">
                {isActive ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Active Banner</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">Inactive</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Button Link</span>
              <div className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 truncate">
                {buttonUrl}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Display Order</span>
              <div className="font-mono text-xs font-extrabold text-slate-800 dark:text-slate-200">
                Sequence Rank #{banner.displayOrder ?? 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

