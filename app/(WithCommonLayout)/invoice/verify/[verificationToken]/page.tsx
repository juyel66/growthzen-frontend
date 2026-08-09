"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useVerifyInvoiceByTokenQuery } from "@/services/invoiceApi";
import { InvoiceCard } from "@/components/invoice/InvoiceCard";
import { AlertOctagon, Home, Loader2, ArrowLeft } from "lucide-react";

export default function PublicInvoiceVerificationPage() {
  const params = useParams();
  const token = (params?.verificationToken as string) || "";

  const { data: invoiceData, isLoading, isError } = useVerifyInvoiceByTokenQuery(token, {
    skip: !token,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 flex flex-col items-center justify-center font-sans">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full text-center space-y-4">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Verifying Tax Invoice...
          </h2>
          <p className="text-xs text-slate-500">
            Authenticating invoice token with GrowthZen Trends platform.
          </p>
        </div>
      </div>
    );
  }

  if (isError || !invoiceData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 flex flex-col items-center justify-center font-sans">
        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Invoice Not Found
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This invoice does not exist or the verification link is invalid. Please verify your invoice code or contact support.
            </p>
          </div>

          <Link href="/">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer">
              <Home className="w-4 h-4" />
              <span>Go to Homepage</span>
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-3xl mb-4 no-print flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to GrowthZen Store</span>
        </Link>
      </div>

      <InvoiceCard invoiceData={invoiceData} isVerifiedView={true} showPrintButton={true} />
    </div>
  );
}
