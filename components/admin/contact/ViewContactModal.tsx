"use client";

import React, { useEffect } from "react";
import { ContactMessage } from "@/types/contactMessage";
import { useUpdateContactMessageStatusMutation } from "@/services/contactMessageApi";
import {
  X,
  User,
  Mail,
  Calendar,
  Clock,
  MessageSquare,
  MailCheck,
  MailWarning,
  Trash2,
  Tag,
} from "lucide-react";
import Swal from "sweetalert2";

interface ViewContactModalProps {
  message: ContactMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteMessage?: (message: ContactMessage) => void;
}

export function ViewContactModal({
  message,
  isOpen,
  onClose,
  onDeleteMessage,
}: ViewContactModalProps) {
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateContactMessageStatusMutation();

  // Auto-mark as READ if currently UNREAD when viewed
  useEffect(() => {
    if (isOpen && message && (message.status || "").toUpperCase() === "UNREAD") {
      updateStatus({ id: message.id, status: "READ" })
        .unwrap()
        .catch(() => {
          // Silent fail for status auto-update on open
        });
    }
  }, [isOpen, message, updateStatus]);

  if (!isOpen || !message) return null;

  const isUnread = (message.status || "").toUpperCase() === "UNREAD";

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("en-US", {
        weekday: "short",
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

  const handleManualStatusToggle = async () => {
    const nextStatus = isUnread ? "READ" : "UNREAD";
    try {
      await updateStatus({ id: message.id, status: nextStatus }).unwrap();
      Swal.fire({
        icon: "success",
        title: `Marked as ${nextStatus}`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Status Update Failed",
        text: "Could not update status via backend API.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center border border-blue-100 dark:border-blue-900/50">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Contact Message Details
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Submitted inquiry details
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            {/* Name */}
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Name
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {message.name || "N/A"}
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Email Address
                </span>
                <a
                  href={`mailto:${message.email}`}
                  className="font-extrabold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {message.email}
                </a>
              </div>
            </div>

            {/* Submitted Date */}
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Submitted Date
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {formatDate(message.createdAt)}
                </span>
              </div>
            </div>

            {/* Updated Date */}
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Updated Date
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {formatDate(message.updatedAt || message.createdAt)}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-start gap-3 sm:col-span-2">
              <Tag className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Status
                </span>
                <div className="mt-1">
                  {isUnread ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      UNREAD
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      READ
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Subject Field */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Subject
            </span>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 font-extrabold text-slate-900 dark:text-white">
              {message.subject || "(No Subject Provided)"}
            </div>
          </div>

          {/* Full Message Body */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Full Message
            </span>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {message.message}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <button
            type="button"
            disabled={isUpdatingStatus}
            onClick={handleManualStatusToggle}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer disabled:opacity-50"
          >
            {isUnread ? (
              <>
                <MailCheck className="w-4 h-4 text-emerald-600" />
                <span>Mark as Read</span>
              </>
            ) : (
              <>
                <MailWarning className="w-4 h-4 text-amber-600" />
                <span>Mark as Unread</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            {onDeleteMessage && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDeleteMessage(message);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-900/50 font-bold text-xs transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
