"use client";

import React from "react";
import Image from "next/image";
import { BannerItem } from "@/types/settings";
import { Eye, Edit3, Trash2, Link as LinkIcon, Layers } from "lucide-react";

interface BannerCardListProps {
  banners: BannerItem[];
  onPreview: (banner: BannerItem) => void;
  onEdit: (banner: BannerItem) => void;
  onDelete: (banner: BannerItem) => void;
  isDeletingId?: string | null;
}

export const BannerCardList: React.FC<BannerCardListProps> = ({
  banners,
  onPreview,
  onEdit,
  onDelete,
  isDeletingId,
}) => {
  if (banners.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-100 dark:border-slate-800 text-center text-slate-400">
        No banners available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {banners.map((item) => {
        const isActive = item.isActive !== false;
        const isDeleting = isDeletingId === item.id;
        const buttonUrl = item.buttonUrl || item.buttonLink || "#";

        return (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
          >
            {/* Banner Image Preview */}
            <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  No Image Available
                </div>
              )}

              {/* Order & Status Badges Overlay */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-black rounded-lg bg-slate-900/80 backdrop-blur-md text-white border border-white/20 shadow-md">
                  Order #{item.displayOrder ?? 0}
                </span>
                {isActive ? (
                  <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-lg bg-emerald-500/90 text-white uppercase tracking-wider shadow-md">
                    Active
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-lg bg-slate-500/90 text-white uppercase tracking-wider shadow-md">
                    Inactive
                  </span>
                )}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 line-clamp-1">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                    {item.subtitle}
                  </p>
                )}
                {item.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 pt-1">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Button Info & URL */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                {item.buttonText ? (
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold border border-blue-200/60">
                    CTA: {item.buttonText}
                  </span>
                ) : (
                  <span className="text-slate-400 italic">No CTA Button</span>
                )}

                <a
                  href={buttonUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-mono text-[11px] text-slate-500 hover:text-blue-600 truncate max-w-[120px]"
                >
                  <LinkIcon className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{buttonUrl}</span>
                </a>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => onPreview(item)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => onEdit(item)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition cursor-pointer shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                disabled={isDeleting}
                onClick={() => onDelete(item)}
                className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400 disabled:opacity-40 transition cursor-pointer"
                title="Delete Banner"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

