"use client";

import React from "react";
import { useGetUserByIdQuery } from "@/services/userManagementApi";
import { UserManagementItem } from "@/types/userManagement";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser, selectUserRole } from "@/features/auth/authSlice";
import { isProtectedSuperAdmin } from "@/constants/protectedUsers";
import { X, User as UserIcon, Mail, Phone, ShieldCheck, Calendar, Hash, Loader2, AlertTriangle } from "lucide-react";

interface ViewUserModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewUserModal: React.FC<ViewUserModalProps> = ({
  userId,
  isOpen,
  onClose,
}) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const userRoleState = useAppSelector(selectUserRole);
  const currentUserRole = (currentUser?.role || userRoleState || "").toUpperCase();

  const { data: fetchedUser, isLoading, isError } = useGetUserByIdQuery(userId || "", {
    skip: !isOpen || !userId,
  });

  if (!isOpen || !userId) return null;

  const user = fetchedUser;
  const isProtectedTarget = Boolean(user && isProtectedSuperAdmin(user.email, user.role));
  const isForbiddenForAdmin = currentUserRole === "ADMIN" && isProtectedTarget;

  const displayName = user?.name || user?.fullName || "N/A";
  const avatarUrl = user?.avatar || user?.avatarUrl || user?.profileImage;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "--";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleBadge = (roleStr?: string) => {
    const role = (roleStr || "CUSTOMER").toUpperCase();
    if (role === "SUPER_ADMIN") {
      return (
        <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200">
          Super Admin
        </span>
      );
    }
    if (role === "ADMIN") {
      return (
        <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200">
          Admin
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200">
        Customer
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              User Profile Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="text-xs font-semibold text-slate-500">Loading user profile...</span>
            </div>
          ) : isForbiddenForAdmin ? (
            <div className="py-8 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Access Restricted</p>
              <p className="text-xs text-slate-400">Super Admin user profile details cannot be accessed.</p>
            </div>
          ) : isError || !user ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-sm font-bold text-rose-600">Failed to load user details.</p>
              <p className="text-xs text-slate-400">Please check network or backend user APIs.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* User Avatar Header */}
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-xs"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-extrabold text-xl flex items-center justify-center border-2 border-blue-500 shadow-xs">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="space-y-1">
                  <h4 className="text-base font-black text-slate-900 dark:text-slate-100 leading-tight">
                    {displayName}
                  </h4>
                  <div>{getRoleBadge(user.role)}</div>
                </div>
              </div>

              {/* Profile Data List */}
              <div className="space-y-3.5 text-xs">
                {/* Full Name */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-500">
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">Full Name</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{displayName}</span>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">Email</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{user.email || "--"}</span>
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">Phone</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{user.phone || user.phoneNumber || "--"}</span>
                </div>

                {/* Role */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">Role</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 uppercase">{user.role}</span>
                </div>

                {/* Created Date */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">Created Date</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{formatDate(user.createdAt)}</span>
                </div>

                {/* User ID */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Hash className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">User ID</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">{user.id}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
