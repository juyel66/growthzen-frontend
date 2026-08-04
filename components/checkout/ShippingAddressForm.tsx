'use client';

import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { AddressType } from '@/types/shipping';
import { MapPin, Phone, User, Home, Briefcase, Tag, Check, Truck, FileText } from 'lucide-react';

export interface ShippingFormValues {
  recipientName: string;
  phone: string;
  division: string;
  district: string;
  upazila: string;
  area?: string;
  addressLine: string;
  shippingType: string;
  orderNotes?: string;
  postalCode?: string;
  addressType: AddressType;
  isDefault?: boolean;
}

interface ShippingAddressFormProps {
  register: UseFormRegister<ShippingFormValues>;
  errors: FieldErrors<ShippingFormValues>;
  setValue: UseFormSetValue<ShippingFormValues>;
  watch: UseFormWatch<ShippingFormValues>;
}

const ADDRESS_TYPES: { type: AddressType; label: string; icon: React.ReactNode }[] = [
  { type: 'Home', label: 'Home', icon: <Home className="w-3.5 h-3.5" /> },
  { type: 'Office', label: 'Office', icon: <Briefcase className="w-3.5 h-3.5" /> },
  { type: 'Other', label: 'Other', icon: <Tag className="w-3.5 h-3.5" /> },
];

export const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  register,
  errors,
  setValue,
  watch,
}) => {
  const currentAddressType = watch('addressType') || 'Home';
  const currentShippingType = watch('shippingType') || 'Standard Shipping';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Shipping Address & Delivery Details
        </h2>
        <span className="text-xs text-slate-400 font-medium">Step 2 of 4</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recipient Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" /> Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Recipient Full Name"
            {...register('recipientName', { required: 'Full name is required' })}
            className={`h-11 px-4 rounded-xl border text-sm font-medium bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
              errors.recipientName
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 focus:border-emerald-600 focus:ring-emerald-500/20'
            }`}
          />
          {errors.recipientName && (
            <span className="text-[11px] text-rose-500 font-semibold">{errors.recipientName.message}</span>
          )}
        </div>

        {/* Recipient Phone (Mandatory) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400" /> Mobile Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="01XXXXXXXXX"
            {...register('phone', {
              required: 'Mobile number is required',
              pattern: {
                value: /^(\+?88)?01[3-9]\d{8}$/,
                message: 'Enter a valid Bangladeshi mobile number (11 digits)',
              },
            })}
            className={`h-11 px-4 rounded-xl border text-sm font-medium bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
              errors.phone
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 focus:border-emerald-600 focus:ring-emerald-500/20'
            }`}
          />
          {errors.phone && (
            <span className="text-[11px] text-rose-500 font-semibold">{errors.phone.message}</span>
          )}
        </div>

        {/* Division */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Division <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Dhaka, Chittagong, Rajshahi"
            {...register('division', { required: 'Division is required' })}
            className={`h-11 px-4 rounded-xl border text-sm font-medium bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
              errors.division
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 focus:border-emerald-600 focus:ring-emerald-500/20'
            }`}
          />
          {errors.division && (
            <span className="text-[11px] text-rose-500 font-semibold">{errors.division.message}</span>
          )}
        </div>

        {/* District */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            District <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Dhaka, Gazipur, Narayanganj"
            {...register('district', { required: 'District is required' })}
            className={`h-11 px-4 rounded-xl border text-sm font-medium bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
              errors.district
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 focus:border-emerald-600 focus:ring-emerald-500/20'
            }`}
          />
          {errors.district && (
            <span className="text-[11px] text-rose-500 font-semibold">{errors.district.message}</span>
          )}
        </div>

        {/* Upazila / Thana */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Upazila / Thana <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Dhanmondi, Savar, Uttara"
            {...register('upazila', { required: 'Upazila is required' })}
            className={`h-11 px-4 rounded-xl border text-sm font-medium bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
              errors.upazila
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 focus:border-emerald-600 focus:ring-emerald-500/20'
            }`}
          />
          {errors.upazila && (
            <span className="text-[11px] text-rose-500 font-semibold">{errors.upazila.message}</span>
          )}
        </div>

        {/* Shipping Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-slate-400" /> Shipping Type <span className="text-rose-500">*</span>
          </label>
          <select
            {...register('shippingType', { required: 'Shipping type is required' })}
            className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-medium bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
          >
            <option value="Standard Shipping">Standard Home Delivery (2-4 Days)</option>
            <option value="Express Shipping">Express Fast Delivery (24-48 Hours)</option>
          </select>
          {errors.shippingType && (
            <span className="text-[11px] text-rose-500 font-semibold">{errors.shippingType.message}</span>
          )}
        </div>

        {/* Detailed Street Address */}
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Full Address / Street & House No. <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            placeholder="House #12, Road #4, Block #B, Flat 3A..."
            {...register('addressLine', { required: 'Full address is required' })}
            className={`px-4 py-2.5 rounded-xl border text-sm font-medium bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all resize-none ${
              errors.addressLine
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 focus:border-emerald-600 focus:ring-emerald-500/20'
            }`}
          />
          {errors.addressLine && (
            <span className="text-[11px] text-rose-500 font-semibold">{errors.addressLine.message}</span>
          )}
        </div>

        {/* Optional Order Notes */}
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-slate-400" /> Order Notes <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="Special instructions for courier, preferred delivery time, call before delivery, etc."
            {...register('orderNotes')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-medium bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
          />
        </div>

        {/* Address Type Selector */}
        <div className="sm:col-span-2 flex flex-col gap-2 pt-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Address Label</span>
          <div className="flex items-center gap-3">
            {ADDRESS_TYPES.map(({ type, label, icon }) => {
              const isSelected = currentAddressType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setValue('addressType', type, { shouldValidate: true })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddressForm;

