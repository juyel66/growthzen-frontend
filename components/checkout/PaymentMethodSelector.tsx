'use client';

import React from 'react';
import { PaymentMethod } from '@/types/checkout';
import { Banknote, ShieldCheck, Check, Lock } from 'lucide-react';

interface PaymentOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  badge?: string;
}

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const paymentOptions: PaymentOption[] = [
    {
      id: 'COD',
      name: 'Cash On Delivery',
      description: 'Pay with cash upon delivery at your doorstep.',
      icon: <Banknote className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      enabled: true,
    },
    {
      id: 'BKASH',
      name: 'bKash Mobile Banking',
      description: 'Fast digital payment via bKash gateway.',
      icon: <span className="font-bold text-xs text-rose-500">bKash</span>,
      enabled: true,
    },
    {
      id: 'NAGAD',
      name: 'Nagad Mobile Banking',
      description: 'Pay conveniently using Nagad wallet.',
      icon: <span className="font-bold text-xs text-orange-500">Nagad</span>,
      enabled: true,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Banknote className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Payment Method
        </h2>
        <span className="text-xs text-slate-400 font-medium">Step 4 of 4</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {paymentOptions.map((option) => {
          const isSelected = selectedMethod === option.id;
          const isEnabled = option.enabled;

          return (
            <div
              key={option.id}
              onClick={() => isEnabled && onSelectMethod(option.id)}
              className={`relative p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                !isEnabled
                  ? 'opacity-55 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 cursor-not-allowed'
                  : isSelected
                  ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20 shadow-sm cursor-pointer'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {option.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      {option.name}
                      {option.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-extrabold tracking-wide uppercase">
                          {option.badge}
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      {option.description}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    !isEnabled
                      ? 'border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800'
                      : isSelected
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 dark:border-slate-700 bg-transparent'
                  }`}
                >
                  {!isEnabled ? (
                    <Lock className="w-3 h-3 text-slate-400" />
                  ) : (
                    isSelected && <Check className="w-3 h-3 stroke-[3]" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
