'use client';

import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, DollarSign, Save, Loader2, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { useGetDeliverySettingsQuery, useUpdateDeliverySettingsMutation } from '@/services/settingsApi';
import Swal from 'sweetalert2';

export const DeliveryManagementSection: React.FC = () => {
  const { data: settingsData, isLoading, refetch } = useGetDeliverySettingsQuery();
  const [updateDeliverySettings, { isLoading: isSaving }] = useUpdateDeliverySettingsMutation();

  const [deliveryEnabled, setDeliveryEnabled] = useState<boolean>(true);
  const [freeDeliveryEnabled, setFreeDeliveryEnabled] = useState<boolean>(false);
  const [insideDhakaCharge, setInsideDhakaCharge] = useState<number>(60);
  const [outsideDhakaCharge, setOutsideDhakaCharge] = useState<number>(120);
  const [estimatedDays, setEstimatedDays] = useState<number>(3);

  useEffect(() => {
    if (settingsData) {
      const data = (settingsData as any).data || settingsData;
      const delEnabled = data.deliveryEnabled ?? true;
      const freeDelEnabled = data.freeDeliveryEnabled ?? (data.freeShippingMinOrderAmount === -1);

      const insideCost =
        data.insideDhakaCharge ??
        data.insideDhakaDeliveryCharge ??
        60;

      const outsideCost =
        data.outsideDhakaCharge ??
        data.outsideDhakaDeliveryCharge ??
        120;

      const days = data.estimatedDeliveryDays ?? 3;

      setDeliveryEnabled(Boolean(delEnabled));
      setFreeDeliveryEnabled(Boolean(freeDelEnabled));
      setInsideDhakaCharge(Number(insideCost));
      setOutsideDhakaCharge(Number(outsideCost));
      setEstimatedDays(Number(days));
    }
  }, [settingsData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      deliveryEnabled,
      freeDeliveryEnabled,
      insideDhakaCharge: Number(insideDhakaCharge),
      outsideDhakaCharge: Number(outsideDhakaCharge),
      insideDhakaDeliveryCharge: Number(insideDhakaCharge),
      outsideDhakaDeliveryCharge: Number(outsideDhakaCharge),
      estimatedDeliveryDays: Number(estimatedDays),
    };

    try {
      const response = await updateDeliverySettings(payload).unwrap();
      const updated = (response as any)?.data || response;

      if (updated && typeof updated === 'object') {
        const delEnabled = updated.deliveryEnabled ?? deliveryEnabled;
        const freeDelEnabled = updated.freeDeliveryEnabled ?? freeDeliveryEnabled;

        const insideCost =
          updated.insideDhakaCharge ??
          updated.insideDhakaDeliveryCharge ??
          insideDhakaCharge;

        const outsideCost =
          updated.outsideDhakaCharge ??
          updated.outsideDhakaDeliveryCharge ??
          outsideDhakaCharge;

        const days = updated.estimatedDeliveryDays ?? estimatedDays;

        setDeliveryEnabled(Boolean(delEnabled));
        setFreeDeliveryEnabled(Boolean(freeDelEnabled));
        setInsideDhakaCharge(Number(insideCost));
        setOutsideDhakaCharge(Number(outsideCost));
        setEstimatedDays(Number(days));
      }

      await refetch();

      Swal.fire({
        icon: 'success',
        title: 'Saved Successfully',
        text: 'Delivery management settings updated and persisted.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3500,
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Update Settings',
        text: err?.data?.message || err?.message || 'Could not save delivery configuration.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <span className="text-xs font-bold text-slate-500">Loading delivery configuration...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/50">
              <Truck className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Delivery Charge Management
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure global store delivery status, free shipping offers, and zone rates.
              </p>
            </div>
          </div>

          {/* Status Indicator Badge */}
          <div className="self-start sm:self-auto">
            {!deliveryEnabled ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-extrabold text-xs border border-rose-200">
                <AlertTriangle className="w-4 h-4" /> Delivery Disabled
              </span>
            ) : freeDeliveryEnabled ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs border border-emerald-200">
                <CheckCircle className="w-4 h-4" /> FREE DELIVERY ACTIVE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-extrabold text-xs border border-blue-200">
                <ShieldCheck className="w-4 h-4" /> Normal Charges Active
              </span>
            )}
          </div>
        </div>

        {/* Toggles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery Status Toggle */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                Delivery Status
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Enable or disable delivery services storefront-wide.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setDeliveryEnabled(!deliveryEnabled)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                deliveryEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  deliveryEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Free Delivery Toggle */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                Free Delivery Offer
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Waive delivery charges for all checkout orders when ON.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const nextVal = !freeDeliveryEnabled;
                setFreeDeliveryEnabled(nextVal);
                if (nextVal && !deliveryEnabled) {
                  setDeliveryEnabled(true);
                }
              }}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                freeDeliveryEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  freeDeliveryEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Zone Charges Config Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
            Delivery Rates & Timelines
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Inside Dhaka */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Inside Dhaka Charge (৳)
              </label>
              <input
                type="number"
                min={0}
                disabled={!deliveryEnabled}
                value={insideDhakaCharge}
                onChange={(e) => setInsideDhakaCharge(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 text-sm font-bold"
              />
            </div>

            {/* Outside Dhaka */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Outside Dhaka Charge (৳)
              </label>
              <input
                type="number"
                min={0}
                disabled={!deliveryEnabled}
                value={outsideDhakaCharge}
                onChange={(e) => setOutsideDhakaCharge(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 text-sm font-bold"
              />
            </div>

            {/* Estimated Days */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-emerald-600" /> Estimated Delivery Days
              </label>
              <input
                type="number"
                min={1}
                disabled={!deliveryEnabled}
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 text-sm font-bold"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default DeliveryManagementSection;
