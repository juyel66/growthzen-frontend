"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetInvoiceByOrderIdQuery } from "@/services/invoiceApi";
import { SharedInvoiceRenderer } from "@/components/invoice/SharedInvoiceRenderer";
import { PrivateRoute } from "@/components/auth/AuthGuards";
import { Loader2, AlertOctagon, ShieldAlert, ArrowLeft } from "lucide-react";

export default function UserInvoiceDetailPage() {
  return (
    <PrivateRoute>
      <UserInvoiceDetailContent />
    </PrivateRoute>
  );
}

function UserInvoiceDetailContent() {
  const params = useParams();
  const invoiceId = (params?.id as string) || "";

  const { data: invoiceData, isLoading, isError, error } = useGetInvoiceByOrderIdQuery(invoiceId, {
    skip: !invoiceId,
  });

  const err = error as any;
  const isForbidden = err?.status === 403 || err?.data?.statusCode === 403 || err?.data?.message?.toLowerCase().includes("permission");

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
          Loading Invoice Details...
        </h2>
      </div>
    );
  }

  if (isForbidden) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-rose-100 dark:border-rose-950 shadow-xl max-w-md w-full text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-rose-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Access Denied (403)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You do not have permission to view this invoice. Reseller invoices are strictly restricted to their original owners.
            </p>
          </div>

          <Link
            href="/user-dashboard/invoices"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to My Invoices</span>
          </Link>
        </div>
      </div>
    );
  }

  if (isError || !invoiceData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Invoice Not Found
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {err?.data?.message || "The requested invoice could not be located or is not yet eligible for printing."}
            </p>
          </div>

          <Link
            href="/user-dashboard/invoices"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Invoices</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      <SharedInvoiceRenderer invoiceData={invoiceData} backUrl="/user-dashboard/invoices" />
    </div>
  );
}
