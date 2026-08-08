'use client';

import React from 'react';
import { ShippingZone } from '@/types/shipping';
import { Truck, Check, Clock } from 'lucide-react';
import { useGetShippingQuery } from '@/services/shippingApi';

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
  const { data: shippingData } = useGetShippingQuery();

  // Parse costs from backend API or standard defaults if custom endpoint data returned
  let insideCost = 60;
  let outsideCost = 120;

  if (shippingData && typeof shippingData === 'object' && !Array.isArray(shippingData)) {
    if (typeof shippingData.insideDhakaCost === 'number') insideCost = shippingData.insideDhakaCost;
    if (typeof shippingData.outsideDhakaCost === 'number') outsideCost = shippingData.outsideDhakaCost;
  }

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
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Delivery Method & Location
        </h2>
        <span className="text-xs text-slate-400 font-medium">Step 3 of 4</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {shippingOptions.map((option) => {
          const isSelected = selectedZone === option.zone;
          return (
            <div
              key={option.zone}
              onClick={() => onZoneChange(option.zone, option.cost)}
              className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
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
                  ${option.cost.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShippingSelector;

