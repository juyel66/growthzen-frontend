"use client";

import React from "react";
import { ContactMessageStats } from "@/types/contactMessage";
import { MessageSquare, MailWarning, MailCheck, CalendarDays, Sparkles } from "lucide-react";

interface ContactSummaryCardsProps {
  stats?: ContactMessageStats;
  isLoading?: boolean;
  activeStatusFilter?: string;
  onSelectStatusFilter?: (status: string) => void;
}

export function ContactSummaryCards({
  stats,
  isLoading = false,
  activeStatusFilter = "ALL",
  onSelectStatusFilter,
}: ContactSummaryCardsProps) {
  const cards = [
    {
      id: "ALL",
      title: "Total Messages",
      value: stats?.totalMessages ?? 0,
      icon: MessageSquare,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      borderColor: "border-blue-200 dark:border-blue-900/50",
      badgeText: "All inquiries",
    },
    {
      id: "UNREAD",
      title: "Unread Messages",
      value: stats?.unreadMessages ?? 0,
      icon: MailWarning,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/50",
      borderColor: "border-amber-200 dark:border-amber-900/50",
      badgeText: "Needs attention",
      highlight: (stats?.unreadMessages ?? 0) > 0,
    },
    {
      id: "READ",
      title: "Read Messages",
      value: stats?.readMessages ?? 0,
      icon: MailCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
      borderColor: "border-emerald-200 dark:border-emerald-900/50",
      badgeText: "Processed",
    },
    {
      id: "TODAY",
      title: "Today's Messages",
      value: stats?.todayMessages ?? 0,
      icon: CalendarDays,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
      borderColor: "border-purple-200 dark:border-purple-900/50",
      badgeText: "Last 24 hours",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs animate-pulse flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
            <div className="h-7 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-3 w-20 bg-slate-150 dark:bg-slate-850 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeStatusFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatusFilter && card.id !== "TODAY" && onSelectStatusFilter(card.id)}
            className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 text-left transition-all duration-200 flex flex-col justify-between gap-3 shadow-2xs relative overflow-hidden group ${
              isActive
                ? "ring-2 ring-blue-500 border-blue-500 dark:border-blue-500 shadow-sm"
                : "hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div
                className={`w-10 h-10 rounded-xl ${card.bgColor} ${card.color} border ${card.borderColor} flex items-center justify-center transition-transform group-hover:scale-105`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {card.value.toLocaleString()}
                </span>
                {card.highlight && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    <Sparkles className="w-3 h-3" />
                    Action Needed
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {card.badgeText}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
