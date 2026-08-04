"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useGetSettingsQuery, usePatchSettingsMutation } from "@/services/settingsApi";
import { uploadMediaFile } from "@/services/uploadService";
import {
  Save,
  Loader2,
  AlertTriangle,
  UploadCloud,
  CheckCircle,
  Building,
  CreditCard,
  Mail,
  Sliders,
  ShieldCheck,
  Globe,
} from "lucide-react";
import Swal from "sweetalert2";

export const SystemSettingsSection: React.FC = () => {
  const { data: settingsData, isLoading, isFetching, isError, refetch } = useGetSettingsQuery();
  const [patchSettingsMutation, { isLoading: isSaving }] = usePatchSettingsMutation();

  const [formState, setFormState] = useState<Record<string, any>>({});
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    if (settingsData) {
      // Clone exact object returned by backend API
      setFormState(JSON.parse(JSON.stringify(settingsData)));
    }
  }, [settingsData]);

  const updateNestedValue = (path: string[], value: any) => {
    setFormState((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      let current = next;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return next;
    });
  };

  const handleFileUpload = async (path: string[], file: File) => {
    const fieldKey = path.join(".");
    try {
      setUploadingField(fieldKey);
      const res = await uploadMediaFile(file);
      updateNestedValue(path, res.url);
      Swal.fire({
        icon: "success",
        title: "Image Uploaded",
        text: "Media uploaded and setting updated.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err?.message || "Could not upload image file.",
      });
    } finally {
      setUploadingField(null);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await patchSettingsMutation(formState).unwrap();
      Swal.fire({
        icon: "success",
        title: "Settings Saved",
        text: "System settings updated successfully via PATCH /settings.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });
      refetch();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: err?.data?.message || "Failed to update system settings.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto" />
        <h3 className="text-base font-bold text-rose-900 dark:text-rose-100">Failed to Load Settings</h3>
        <p className="text-xs text-rose-700 dark:text-rose-300">
          Could not fetch system settings from backend endpoint GET /settings.
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  // Format field labels nicely (e.g., storeEmail -> Store Email)
  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Render a field control based on its value and type
  const renderFieldInput = (key: string, value: any, path: string[]) => {
    const fieldKey = path.join(".");

    // Exclude read-only metadata fields
    if (["id", "createdAt", "updatedAt"].includes(key)) return null;

    // 1. Boolean Toggle / Switch
    if (typeof value === "boolean") {
      return (
        <div
          key={fieldKey}
          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80"
        >
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              {formatLabel(key)}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{fieldKey}</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => updateNestedValue(path, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      );
    }

    // 2. Image / Logo / Favicon Upload
    const isImageKey = ["logo", "favicon", "image", "avatar", "icon"].some((term) =>
      key.toLowerCase().includes(term)
    );

    if (isImageKey && (typeof value === "string" || value === null || value === undefined)) {
      return (
        <div key={fieldKey} className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>{formatLabel(key)}</span>
            <span className="text-[10px] text-slate-400 font-mono">{fieldKey}</span>
          </label>
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
              {value ? (
                <Image src={value} alt={key} fill className="object-contain p-1" />
              ) : (
                <span className="text-[10px] text-slate-400">No Image</span>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={value || ""}
                onChange={(e) => updateNestedValue(path, e.target.value)}
                placeholder={`URL for ${formatLabel(key)}`}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(path, f);
                  }}
                  className="hidden"
                  id={`file-${fieldKey}`}
                />
                <label
                  htmlFor={`file-${fieldKey}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 transition cursor-pointer"
                >
                  {uploadingField === fieldKey ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                  )}
                  <span>Upload Image</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 3. Number Field
    if (typeof value === "number") {
      return (
        <div key={fieldKey} className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>{formatLabel(key)}</span>
            <span className="text-[10px] text-slate-400 font-mono">{fieldKey}</span>
          </label>
          <input
            type="number"
            step="any"
            value={value ?? 0}
            onChange={(e) => updateNestedValue(path, parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      );
    }

    // 4. Standard Text / Email / Address String
    return (
      <div key={fieldKey} className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>{formatLabel(key)}</span>
          <span className="text-[10px] text-slate-400 font-mono">{fieldKey}</span>
        </label>
        {key.toLowerCase().includes("address") || key.toLowerCase().includes("description") ? (
          <textarea
            rows={2}
            value={value || ""}
            onChange={(e) => updateNestedValue(path, e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        ) : (
          <input
            type={key.toLowerCase().includes("email") ? "email" : "text"}
            value={value || ""}
            onChange={(e) => updateNestedValue(path, e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        )}
      </div>
    );
  };

  // Group top-level object blocks or render flat fields
  const topKeys = Object.keys(formState).filter(
    (k) => !["id", "createdAt", "updatedAt", "__v"].includes(k)
  );

  return (
    <form onSubmit={handleSaveSettings} className="space-y-6">
      {topKeys.length > 0 ? (
        topKeys.map((sectionKey) => {
          const sectionVal = formState[sectionKey];

          // If the section is a nested object (e.g. general, payment, features, etc.)
          if (
            sectionVal &&
            typeof sectionVal === "object" &&
            !Array.isArray(sectionVal)
          ) {
            const nestedKeys = Object.keys(sectionVal).filter(
              (k) => !["id", "createdAt", "updatedAt"].includes(k)
            );

            return (
              <div
                key={sectionKey}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    {formatLabel(sectionKey)}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nestedKeys.map((subKey) =>
                    renderFieldInput(subKey, sectionVal[subKey], [sectionKey, subKey])
                  )}
                </div>
              </div>
            );
          }

          // Direct top-level scalar field
          return (
            <div
              key={sectionKey}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs"
            >
              {renderFieldInput(sectionKey, sectionVal, [sectionKey])}
            </div>
          );
        })
      ) : (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-100 dark:border-slate-800 text-center text-slate-400">
          No configurable settings returned from backend.
        </div>
      )}

      {/* Save Settings Floating / Bottom Bar */}
      <div className="sticky bottom-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between">
        <div className="text-xs text-slate-500 font-medium">
          Changes will be committed via <span className="font-mono font-bold text-blue-600">PATCH /settings</span>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? "Saving..." : "Save System Settings"}</span>
        </button>
      </div>
    </form>
  );
};
