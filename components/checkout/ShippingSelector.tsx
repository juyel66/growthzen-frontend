'use client';

import React from 'react';
import { ShippingZone } from '@/types/shipping';
import { Truck, Check, Clock, AlertTriangle, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { useGetSettingsQuery } from '@/services/settingsApi';

interface ShippingOption {
  zone: ShippingZone;
  label: string;
  cost: number;
  estimatedDays: string;
  description: string;
}

interface ShippingSelectorProps {
  selectedZone: ShippingZone;
  onZoneChange: (zone: ShippingZone, cost: number) => void;
}

export const ShippingSelector: React.FC<ShippingSelectorProps> = ({
  selectedZone,
  onZoneChange,
}) => {
  const {
    data: settingsData,
    isLoading: isQueryLoading,
    isError,
    refetch,
  } = useGetSettingsQuery();

  const data = (settingsData as any)?.data || settingsData;
  const isLoading = isQueryLoading || (!settingsData && !isError);

  const delivery = data?.delivery || {};

  const rawFreeDeliveryEnabled = data?.freeDeliveryEnabled ?? delivery.freeDeliveryEnabled;
  const freeDeliveryEnabled =
    rawFreeDeliveryEnabled !== undefined
      ? Boolean(rawFreeDeliveryEnabled)
      : data?.freeShippingMinOrderAmount === -1;

  const rawDeliveryEnabled = data?.deliveryEnabled ?? delivery.deliveryEnabled;

  const deliveryEnabled =
    freeDeliveryEnabled || (rawDeliveryEnabled !== undefined ? Boolean(rawDeliveryEnabled) : true);

  const isDeliveryDisabled = !isLoading && !isError && !deliveryEnabled;
  const isFreeDeliveryActive = !isLoading && !isError && deliveryEnabled && freeDeliveryEnabled;

  const rawInsideCost =
    data?.insideDhakaCharge ??
    data?.insideDhakaDeliveryCharge ??
    delivery.insideDhakaCharge ??
    delivery.insideDhakaDeliveryCharge;

  const rawOutsideCost =
    data?.outsideDhakaCharge ??
    data?.outsideDhakaDeliveryCharge ??
    delivery.outsideDhakaCharge ??
    delivery.outsideDhakaDeliveryCharge;

  const configuredInsideCost = rawInsideCost !== undefined ? Number(rawInsideCost) : 0;
  const configuredOutsideCost = rawOutsideCost !== undefined ? Number(rawOutsideCost) : 0;

  const insideCost = isFreeDeliveryActive ? 0 : configuredInsideCost;
  const outsideCost = isFreeDeliveryActive ? 0 : configuredOutsideCost;

  const shippingOptions: ShippingOption[] = [
    {
      zone: 'inside_dhaka',
      label: 'Inside Dhaka',
      cost: insideCost,
      estimatedDays: '1-2 Days',
      description: 'Fast home delivery within Dhaka metropolitan area.',
    },
    {
      zone: 'outside_dhaka',
      label: 'Outside Dhaka',
      cost: outsideCost,
      estimatedDays: '3-5 Days',
      description: 'Standard courier delivery across all other districts.',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Delivery Method & Location
          </h2>
          {isFreeDeliveryActive && (
            <span className="ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60">
              <Sparkles className="w-3 h-3" /> Free Delivery Active
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400 font-medium">Step 3 of 4</span>
      </div>

      {isError ? (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>Unable to load delivery charges from server.</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        </div>
      ) : isDeliveryDisabled ? (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>Delivery services are currently disabled by store administration.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {shippingOptions.map((option) => {
            const isSelected = selectedZone === option.zone;
            return (
              <div
                key={option.zone}
                onClick={() => !isLoading && onZoneChange(option.zone, option.cost)}
                className={`relative p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isLoading
                    ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-wait'
                    : isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20 shadow-sm cursor-pointer'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {option.label}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {option.description}
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-700 bg-transparent'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{option.estimatedDays}</span>
                  </div>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {isLoading ? (
                      <span className="inline-flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...
                      </span>
                    ) : isFreeDeliveryActive ? (
                      <span className="text-emerald-600 dark:text-emerald-400 uppercase font-black text-sm tracking-wide">
                        FREE
                      </span>
                    ) : (
                      `৳${option.cost.toFixed(2)}`
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShippingSelector;
