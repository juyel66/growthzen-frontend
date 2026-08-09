"use client";

import React from "react";
import { ContactMessage } from "@/types/contactMessage";
import {
  Eye,
  Trash2,
  MailCheck,
  MailWarning,
  MessageSquare,
  Clock,
  User,
  Mail,
  AlertCircle,
} from "lucide-react";

interface ContactTableProps {
  messages: ContactMessage[];
  isLoading: boolean;
  isUpdatingId?: string | null;
  isDeletingId?: string | null;
  hasActiveFilters: boolean;
  onViewMessage: (message: ContactMessage) => void;
  onToggleStatus: (message: ContactMessage) => void;
  onDeleteMessage: (message: ContactMessage) => void;
}

export function ContactTable({
  messages,
  isLoading,
  isUpdatingId,
  isDeletingId,
  hasActiveFilters,
  onViewMessage,
  onToggleStatus,
  onDeleteMessage,
}: ContactTableProps) {
  // Format ISO Date into readable text
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Skeleton Loading State
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-14 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Empty State
  if (messages.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs p-12 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-100 dark:border-slate-700">
          {hasActiveFilters ? (
            <AlertCircle className="w-7 h-7 text-amber-500" />
          ) : (
            <MessageSquare className="w-7 h-7 text-blue-500" />
          )}
        </div>
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
          {hasActiveFilters
            ? "No messages found matching your filters."
            : "No contact messages yet."}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
          {hasActiveFilters
            ? "Try resetting your search query, status, or date range filter to see available messages."
            : "Customer submissions through the storefront contact form will appear here."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs overflow-hidden">
      {/* Desktop / Tablet Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-5">Sender</th>
              <th className="py-3.5 px-4">Subject</th>
              <th className="py-3.5 px-4">Message Preview</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Submitted</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {messages.map((msg) => {
              const isUnread = (msg.status || "").toUpperCase() === "UNREAD";
              const isUpdating = isUpdatingId === msg.id;
              const isDeleting = isDeletingId === msg.id;

              return (
                <tr
                  key={msg.id}
                  className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 ${
                    isUnread
                      ? "bg-amber-50/30 dark:bg-amber-950/20 font-semibold"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {/* Sender Info */}
                  <td className="py-4 px-5">
                    <div className="flex flex-col">
                      <span
                        className={`font-bold ${
                          isUnread
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {msg.name || "Anonymous Sender"}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        {msg.email}
                      </span>
                    </div>
                  </td>

                  {/* Subject */}
                  <td className="py-4 px-4 max-w-[180px] truncate">
                    <span
                      className={`font-bold ${
                        isUnread
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                      title={msg.subject || "No Subject"}
                    >
                      {msg.subject || "(No Subject)"}
                    </span>
                  </td>

                  {/* Message Preview */}
                  <td className="py-4 px-4 max-w-[280px]">
                    <p className="line-clamp-2 text-slate-500 dark:text-slate-400 text-xs">
                      {msg.message}
                    </p>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {isUnread ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900/60 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        UNREAD
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        READ
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400 text-[11px]">
                    {formatDate(msg.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Action */}
                      <button
                        type="button"
                        onClick={() => onViewMessage(msg)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition cursor-pointer"
                        title="View Full Message"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Toggle Read/Unread Status */}
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => onToggleStatus(msg)}
                        className={`p-1.5 rounded-lg transition cursor-pointer disabled:opacity-50 ${
                          isUnread
                            ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                            : "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
                        }`}
                        title={isUnread ? "Mark as Read" : "Mark as Unread"}
                      >
                        {isUnread ? (
                          <MailCheck className="w-4 h-4" />
                        ) : (
                          <MailWarning className="w-4 h-4" />
                        )}
                      </button>

                      {/* Delete Action */}
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => onDeleteMessage(msg)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition cursor-pointer disabled:opacity-50"
                        title="Delete Message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card / List Layout */}
      <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {messages.map((msg) => {
          const isUnread = (msg.status || "").toUpperCase() === "UNREAD";
          const isUpdating = isUpdatingId === msg.id;
          const isDeleting = isDeletingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`p-4 flex flex-col gap-3 ${
                isUnread ? "bg-amber-50/40 dark:bg-amber-950/20" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm">
                    <User className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>{msg.name || "Anonymous Sender"}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3 shrink-0" />
                    <span>{msg.email}</span>
                  </div>
                </div>

                {isUnread ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    UNREAD
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    READ
                  </span>
                )}
              </div>

              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Subject: {msg.subject || "(No Subject)"}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mt-1 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {msg.message}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(msg.createdAt)}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onViewMessage(msg)}
                    className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-lg font-bold text-xs flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>

                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onToggleStatus(msg)}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold"
                  >
                    {isUnread ? "Mark Read" : "Mark Unread"}
                  </button>

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => onDeleteMessage(msg)}
                    className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
