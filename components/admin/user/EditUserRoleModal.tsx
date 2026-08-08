"use client";

import React, { useState, useEffect } from "react";
import { UserManagementItem, UserRole } from "@/types/userManagement";
import { useUpdateUserRoleMutation } from "@/services/userManagementApi";
import { X, ShieldCheck, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

interface EditUserRoleModalProps {
  user: UserManagementItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditUserRoleModal: React.FC<EditUserRoleModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | string>("CUSTOMER");
  const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation();

  useEffect(() => {
    if (user) {
      setSelectedRole((user.role || "CUSTOMER").toUpperCase());
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateUserRole({ id: user.id, role: selectedRole }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Role Updated Successfully",
        text: `User ${user.name || user.email || user.id}'s role changed to ${selectedRole}.`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });

      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Role Update Failed",
        text: err?.data?.message || "Could not update user role. Please try again.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Edit User Role
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Target User
            </span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              {user.name || user.fullName || "User"}
            </p>
            <p className="text-xs text-slate-500 font-medium">{user.email || user.phone || user.id}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Select Platform Role *
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="CUSTOMER">Customer</option>
              <option value="RESELLER">Reseller</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl transition shadow-xs cursor-pointer"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Update Role</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
