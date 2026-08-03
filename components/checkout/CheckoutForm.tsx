'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCartQuery } from '@/services/cartApi';
import { useGetMeQuery } from '@/services/authApi';
import { usePlaceOrderMutation, useGetCheckoutSummaryQuery } from '@/services/checkoutApi';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { PaymentMethod, CheckoutRequest } from '@/types/checkout';
import { ShippingZone } from '@/types/shipping';
import { Coupon } from '@/types/coupon';

import ShippingAddressForm, { ShippingFormValues } from './ShippingAddressForm';
import ShippingSelector from './ShippingSelector';
import PaymentMethodSelector from './PaymentMethodSelector';
import CheckoutSidebar from './CheckoutSidebar';
import { User as UserIcon, Mail, Phone as PhoneIcon } from 'lucide-react';
import Swal from 'sweetalert2';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(7, 'Enter a valid phone number'),
  recipientName: z.string().min(2, 'Recipient name is required'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  division: z.string().min(2, 'Division is required'),
  district: z.string().min(2, 'District is required'),
  area: z.string().min(2, 'Area is required'),
  addressLine: z.string().min(5, 'Street address is required'),
  postalCode: z.string().optional(),
  addressType: z.enum(['Home', 'Office', 'Other']),
  isDefault: z.boolean().optional(),
  shippingZone: z.enum(['inside_dhaka', 'outside_dhaka']),
  paymentMethod: z.enum(['COD', 'BKASH', 'NAGAD']),
});

type CheckoutFormSchema = z.infer<typeof checkoutSchema>;

export const CheckoutForm: React.FC = () => {
  const router = useRouter();

  // RTK Query Hooks & State
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: fetchedUser } = useGetMeQuery();
  const user = fetchedUser || currentUser;

  const { data: cart } = useGetCartQuery();
  const [placeOrder, { isLoading: isSubmitting }] = usePlaceOrderMutation();

  // Local state for shipping & coupon
  const [shippingZone, setShippingZone] = useState<ShippingZone>('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  const { data: checkoutSummary } = useGetCheckoutSummaryQuery({
    deliveryArea: shippingZone === 'inside_dhaka' ? 'INSIDE_DHAKA' : 'OUTSIDE_DHAKA',
  });

  const cartItems = cart?.items || [];

  const subtotal = checkoutSummary?.subtotal ?? cart?.summary?.subtotal ?? 0;
  const categoryDiscount = checkoutSummary?.discount ?? cart?.summary?.discount ?? 0;
  const shippingFee = checkoutSummary?.shippingCharge ?? (shippingZone === 'inside_dhaka' ? 60 : 120);
  const tax = cart?.summary?.tax ?? 0;
  const grandTotal = checkoutSummary?.grandTotal ?? Math.max(0, subtotal - categoryDiscount + shippingFee + tax);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: user?.name || '',
      customerEmail: user?.email || '',
      customerPhone: user?.phone || '',
      recipientName: user?.name || '',
      phone: user?.phone || '',
      division: 'Dhaka',
      district: 'Dhaka',
      area: '',
      addressLine: '',
      postalCode: '',
      addressType: 'Home',
      isDefault: false,
      shippingZone: 'inside_dhaka',
      paymentMethod: 'COD',
    },
  });

  // Prefill user info when fetched
  useEffect(() => {
    if (user) {
      if (user.name) {
        setValue('customerName', user.name);
        setValue('recipientName', user.name);
      }
      if (user.email) setValue('customerEmail', user.email);
      if (user.phone) {
        setValue('customerPhone', user.phone);
        setValue('phone', user.phone);
      }
    }
  }, [user, setValue]);

  const handleZoneChange = (zone: ShippingZone) => {
    setShippingZone(zone);
    setValue('shippingZone', zone);
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setValue('paymentMethod', method);
  };

  const handleCouponApplied = (coupon: Coupon, discountAmount: number) => {
    setAppliedCoupon(coupon);
    setCouponDiscount(discountAmount);
  };

  const handleCouponRemoved = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const onSubmit = async (data: CheckoutFormSchema) => {
    if (cartItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Cart',
        text: 'Your cart is empty. Please add items before checking out.',
      });
      return;
    }

    const name = (data.recipientName || data.customerName || user?.name || '').trim();
    const phone = (data.phone || data.customerPhone || user?.phone || '').trim();

    const addressParts = [data.addressLine, data.area, data.district, data.division].filter(Boolean);
    let fullAddress = addressParts.join(', ').trim();
    if (fullAddress.length < 10) {
      fullAddress = `${fullAddress}, Bangladesh`;
    }

    const deliveryArea: 'INSIDE_DHAKA' | 'OUTSIDE_DHAKA' =
      data.shippingZone === 'outside_dhaka' || shippingZone === 'outside_dhaka'
        ? 'OUTSIDE_DHAKA'
        : 'INSIDE_DHAKA';

    const rawMethod = (data.paymentMethod || paymentMethod || 'COD').toUpperCase();
    const validMethods: PaymentMethod[] = ['COD', 'BKASH', 'NAGAD'];
    const uppercasePaymentMethod: PaymentMethod = validMethods.includes(rawMethod as PaymentMethod)
      ? (rawMethod as PaymentMethod)
      : 'COD';

    const checkoutPayload: CheckoutRequest = {
      customerName: name,
      customerPhone: phone,
      address: fullAddress,
      deliveryArea,
      paymentMethod: uppercasePaymentMethod,
    };

    if (appliedCoupon?.code?.trim()) {
      checkoutPayload.couponCode = appliedCoupon.code.trim();
    }

    try {
      const response = await placeOrder(checkoutPayload).unwrap();
      const orderId = response.orderId || response.data?.orderNumber || response.data?.orderId || response.data?.id || 'ORD-' + Date.now();

      Swal.fire({
        icon: 'success',
        title: 'Order Placed Successfully!',
        text: `Thank you for your order! Your order ID is ${orderId}.`,
        confirmButtonText: 'View Order Details',
        confirmButtonColor: '#059669',
      }).then(() => {
        router.push(`/order/success?orderId=${encodeURIComponent(orderId)}`);
      });
    } catch (err: unknown) {
      const error = err as { status?: number; data?: { message?: string } };
      const status = error?.status;
      const errorMessage =
        error?.data?.message ||
        (status === 401
          ? 'Session expired. Please log in to complete checkout.'
          : status === 400
          ? 'Invalid order details. Please check form fields.'
          : status === 409
          ? 'Stock changed while ordering. Please review your cart.'
          : 'Failed to place order. Please try again.');

      Swal.fire({
        icon: 'error',
        title: status === 401 ? 'Authentication Error' : 'Checkout Failed',
        text: errorMessage,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Customer Info, Shipping Form, Shipping Selector, Payment Selection */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* 1. Customer Information Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Customer Information
            </h2>
            <span className="text-xs text-slate-400 font-medium">Step 1 of 4</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Customer Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5 text-slate-400" /> Full Name
              </label>
              <input
                type="text"
                readOnly
                {...register('customerName')}
                className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm font-semibold cursor-not-allowed"
              />
            </div>

            {/* Customer Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
              </label>
              <input
                type="email"
                readOnly
                {...register('customerEmail')}
                className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm font-semibold cursor-not-allowed"
              />
            </div>

            {/* Customer Phone (Editable) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <PhoneIcon className="w-3.5 h-3.5 text-slate-400" /> Account Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                {...register('customerPhone')}
                className={`h-11 px-4 rounded-xl border text-sm font-medium bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.customerPhone
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-800 focus:border-emerald-600 focus:ring-emerald-500/20'
                }`}
              />
              {errors.customerPhone && (
                <span className="text-[11px] text-rose-500 font-semibold">{errors.customerPhone.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Shipping Address Form */}
        <ShippingAddressForm
          register={register as unknown as React.ComponentProps<typeof ShippingAddressForm>['register']}
          errors={errors as unknown as React.ComponentProps<typeof ShippingAddressForm>['errors']}
          setValue={setValue as unknown as React.ComponentProps<typeof ShippingAddressForm>['setValue']}
          watch={watch as unknown as React.ComponentProps<typeof ShippingAddressForm>['watch']}
        />

        {/* 3. Delivery Method / Shipping Selector */}
        <ShippingSelector
          selectedZone={shippingZone}
          onZoneChange={handleZoneChange}
        />

        {/* 4. Payment Method Selector */}
        <PaymentMethodSelector
          selectedMethod={paymentMethod}
          onSelectMethod={handlePaymentMethodChange}
        />
      </div>

      {/* Right Column: Sticky Sidebar with Order Summary, Coupon, Submit CTA */}
      <div className="lg:col-span-1">
        <CheckoutSidebar
          items={cartItems}
          subtotal={subtotal}
          shippingFee={shippingFee}
          coupon={appliedCoupon}
          couponDiscount={couponDiscount}
          categoryDiscount={categoryDiscount}
          tax={tax}
          grandTotal={grandTotal}
          isLoading={isSubmitting}
          onCouponApplied={handleCouponApplied}
          onCouponRemoved={handleCouponRemoved}
        />
      </div>
    </form>
  );
};

export default CheckoutForm;
