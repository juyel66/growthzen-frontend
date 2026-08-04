"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcon, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorBg: string;
  textColor: string;
  link: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  colorBg,
  textColor,
  link,
}) => {
  return (
    <Link href={link} className="block group">
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ duration: 0.15 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md dark:hover:border-slate-700 transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </span>
          <div className={`p-2 rounded-xl ${colorBg} ${textColor} transition-transform group-hover:scale-110`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-2 mt-3">
          <span className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {value}
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </motion.div>
    </Link>
  );
};
