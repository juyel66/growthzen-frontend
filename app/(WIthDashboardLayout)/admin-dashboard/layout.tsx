"use client";

import React from "react";
import { RoleGuard } from "@/components/auth/AuthGuards";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      {children}
    </RoleGuard>
  );
}
