"use client";

import React from "react";
import { PrivateRoute } from "@/components/auth/AuthGuards";
import { MyInvoicesList } from "@/components/invoice/MyInvoicesList";

export default function MyInvoicesPage() {
  return (
    <PrivateRoute>
      <MyInvoicesList />
    </PrivateRoute>
  );
}
