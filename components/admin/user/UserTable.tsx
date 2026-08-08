"use client";

import React from "react";
import { UserManagementItem } from "@/types/userManagement";
import { Eye, Edit2, Trash2, Users, ShieldCheck, UserCheck } from "lucide-react";
import { OrderTableSkeletonRow } from "@/components/ui/TableSkeleton";

interface UserTableProps {
  users: UserManagementItem[];
  onViewUser: (user: UserManagementItem) => void;
  onEditUserRole: (user: UserManagementItem) => void;
  onDeleteUser: (user: UserManagementItem) => void;
  isLoading?: boolean;
  isDeletingId?: string | null;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getRoleBadge = (roleStr?: string) => {
  const role = (roleStr || "CUSTOMER").toUpperCase();
  if (role === "SUPER_ADMIN") {
    return (
      <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200">
        Super Admin
      </span>
    );
  }
  if (role === "ADMIN") {
    return (
      <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200">
        Admin
      </span>
    );
  }
  if (role === "RESELLER") {
    return (
      <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200">
        Reseller
      </span>
    );
  }
  return (
    <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
      Customer
    </span>
  );
};

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onViewUser,
  onEditUserRole,
  onDeleteUser,
  isLoading = false,
  isDeletingId = null,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/90 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 z-10">
            <tr>
              <th className="p-3.5">User</th>
              <th className="p-3.5">Email</th>
              <th className="p-3.5">Phone</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5">Created Date</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, idx) => (
                <OrderTableSkeletonRow key={idx} />
              ))
            ) : users.length > 0 ? (
              users.map((user) => {
                const displayName = user.name || user.fullName || "Unnamed User";
                const avatarUrl = user.avatar || user.avatarUrl || user.profileImage;
                const isDeleting = isDeletingId === user.id;

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* User Info */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={displayName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-200 dark:border-blue-900 flex-shrink-0">
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-900 dark:text-slate-100">
                            {displayName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">ID: {user.id.slice(0, 8)}...</span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {user.email || "--"}
                    </td>

                    {/* Phone */}
                    <td className="p-3.5 font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {user.phone || user.phoneNumber || "--"}
                    </td>

                    {/* Role */}
                    <td className="p-3.5 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>

                    {/* Created Date */}
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View */}
                        <button
                          onClick={() => onViewUser(user)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="View User Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Role */}
                        <button
                          onClick={() => onEditUserRole(user)}
                          className="p-1.5 rounded-lg border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-950/40 hover:bg-purple-100 transition cursor-pointer"
                          title="Edit User Role"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => onDeleteUser(user)}
                          disabled={isDeleting}
                          className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/40 hover:bg-rose-100 disabled:opacity-40 transition cursor-pointer"
                          title="Delete User"
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
                <td colSpan={6} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      No Users Found
                    </span>
                    <span className="text-xs text-slate-400">
                      Try adjusting your search or role filters.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
