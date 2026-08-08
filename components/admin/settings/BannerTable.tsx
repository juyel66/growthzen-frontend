"use client";

import React from "react";
import Image from "next/image";
import { BannerItem } from "@/types/settings";
import { Eye, Edit3, Trash2, Link as LinkIcon, Layers } from "lucide-react";

interface BannerTableProps {
  banners: BannerItem[];
  onPreview: (banner: BannerItem) => void;
  onEdit: (banner: BannerItem) => void;
  onDelete: (banner: BannerItem) => void;
  isDeletingId?: string | null;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const BannerTable: React.FC<BannerTableProps> = ({
  banners,
  onPreview,
  onEdit,
  onDelete,
  isDeletingId,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="p-3.5">Banner Image</th>
              <th className="p-3.5">Title</th>
              <th className="p-3.5">Subtitle</th>
              <th className="p-3.5">Button Text</th>
              <th className="p-3.5">Button Link</th>
              <th className="p-3.5 text-center">Order</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Created Date</th>
              <th className="p-3.5 text-right w-[160px] min-w-[160px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {banners.length > 0 ? (
              banners.map((item) => {
                const isActive = item.isActive !== false;
                const isDeleting = isDeletingId === item.id;
                const buttonUrl = item.buttonUrl || item.buttonLink || "#";

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Banner Thumbnail */}
                    <td className="p-3.5">
                      <div
                        onClick={() => onPreview(item)}
                        className="w-24 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700 cursor-pointer group shadow-2xs"
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title || "Banner"}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            No Img
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>
                    </td>

                    {/* Title */}
                    <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100 max-w-[180px] truncate">
                      {item.title}
                    </td>

                    {/* Subtitle */}
                    <td className="p-3.5 text-slate-500 dark:text-slate-400 max-w-[180px] truncate">
                      {item.subtitle || "-"}
                    </td>

                    {/* Button Text */}
                    <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                      {item.buttonText ? (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {item.buttonText}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* Button Link */}
                    <td className="p-3.5 max-w-[160px] truncate">
                      <a
                        href={buttonUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <LinkIcon className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{buttonUrl}</span>
                      </a>
                    </td>

                    {/* Display Order */}
                    <td className="p-3.5 text-center font-black">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200/60 font-mono text-xs">
                        {item.displayOrder ?? 0}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="p-3.5">
                      {isActive ? (
                        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-md border tracking-wide uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60">
                          Active
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-md border tracking-wide uppercase bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200">
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right whitespace-nowrap w-[160px] min-w-[160px]">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPreview(item)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400 transition cursor-pointer"
                          title="Preview Banner"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 transition cursor-pointer"
                          title="Edit Banner"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          disabled={isDeleting}
                          onClick={() => onDelete(item)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400 disabled:opacity-40 transition cursor-pointer"
                          title="Delete Banner (Soft Delete)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="p-10 text-center text-slate-400">
                  No banners created yet. Click &quot;Create New Banner&quot; above to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

