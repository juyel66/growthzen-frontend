'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCartQuery, cartApi } from '@/services/cartApi';
import { useGetMeQuery } from '@/services/authApi';
import { usePlaceOrderMutation, useGetCheckoutSummaryQuery, checkoutApi } from '@/services/checkoutApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectCurrentUser, selectIsAuthenticated, selectIsReseller } from '@/features/auth/authSlice';

import { PaymentMethod, CheckoutRequest } from '@/types/checkout';
import { ShippingZone } from '@/types/shipping';
import { Coupon } from '@/types/coupon';
import { Product, getProductDisplayPrice } from '@/types/product';
import { CartItem } from '@/types/cart';
import { getBuyNowItem, clearBuyNowItem, BuyNowSessionItem } from '@/hooks/useProtectedAction';

import ShippingAddressForm from './ShippingAddressForm';
import ShippingSelector from './ShippingSelector';
import PaymentMethodSelector from './PaymentMethodSelector';
import CheckoutSidebar from './CheckoutSidebar';
import { useGetSettingsQuery } from '@/services/settingsApi';
import { User as UserIcon, Mail, Phone as PhoneIcon, UserCheck, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';

import { isValidBDMobileNumber, normalizeBDMobileNumber } from '@/utils/phoneValidation';


const bdPhoneSchema = z
  .string()
  .min(1, 'Mobile number is required')
  .refine((val) => isValidBDMobileNumber(val), {
    message: 'Enter a valid Bangladeshi mobile number (e.g. 01700000000)',
  });

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Full name is required'),
  customerEmail: z
    .string()
    .transform((v) => v.trim())
    .refine((val) => val === '' || z.string().email().safeParse(val).success, {
      message: 'Invalid email address',
    })
    .optional(),
  customerPhone: bdPhoneSchema,
  recipientName: z.string().min(2, 'Recipient name is required'),
  phone: bdPhoneSchema,
  division: z.string().min(2, 'Division is required'),
  district: z.string().min(2, 'District is required'),
  upazila: z.string().min(2, 'Upazila is required'),
  area: z.string().optional(),
  addressLine: z.string().min(5, 'Full address is required'),
  shippingType: z.string().min(1, 'Shipping type is required'),
  orderNotes: z.string().optional(),
  postalCode: z.string().optional(),
  addressType: z.enum(['Home', 'Office', 'Other']),
  isDefault: z.boolean().optional(),
  shippingZone: z.enum(['inside_dhaka', 'outside_dhaka']),
  paymentMethod: z.enum(['COD', 'BKASH', 'NAGAD']),
});

type CheckoutFormSchema = z.infer<typeof checkoutSchema>;

export const CheckoutForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Authentication & Profile State
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: fetchedUser } = useGetMeQuery(undefined, { skip: !isAuthenticated });
  const user = fetchedUser || currentUser;

  // Buy Now item state (for guests or direct single item buy now)
  const [buyNowItem, setBuyNowItem] = useState<BuyNowSessionItem | null>(null);

  useEffect(() => {
    const item = getBuyNowItem();
    if (item) {
      setBuyNowItem(item);
    }
  }, []);

  // Cart Query skipped for guests unless authenticated
  const { data: cart } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const [placeOrder, { isLoading: isSubmitting }] = usePlaceOrderMutation();

  // Local state for shipping & payment
  const [shippingZone, setShippingZone] = useState<ShippingZone>('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormSchema>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      customerName: user?.name || '',
      customerEmail: user?.email || '',
      customerPhone: user?.phone || '',
      recipientName: user?.name || '',
      phone: user?.phone || '',
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: '',
      area: '',
      addressLine: '',
      shippingType: 'Standard Shipping',
      orderNotes: '',
      postalCode: '',
      addressType: 'Home',
      isDefault: false,
      shippingZone: 'inside_dhaka',
      paymentMethod: 'COD',
    },
  });

  const watchShippingZone = watch('shippingZone');
  const activeZone: ShippingZone = (watchShippingZone || shippingZone || 'inside_dhaka') as ShippingZone;

  // Summary Query only run for authenticated user with cart items
  const { data: checkoutSummary } = useGetCheckoutSummaryQuery(
    { deliveryArea: activeZone === 'inside_dhaka' ? 'INSIDE_DHAKA' : 'OUTSIDE_DHAKA' },
    { skip: !isAuthenticated || Boolean(buyNowItem) }
  );

  // Auto-sync backend applied coupon from checkoutSummary
  useEffect(() => {
    if (checkoutSummary?.appliedCoupon && !appliedCoupon) {
      const disc = checkoutSummary.appliedCoupon.discountAmount ?? 0;
      setAppliedCoupon({
        id: checkoutSummary.appliedCoupon.id,
        code: checkoutSummary.appliedCoupon.code,
        discountType: 'FIXED',
        discountValue: disc,
        isActive: true,
      });
      setCouponDiscount(disc);
    }
  }, [checkoutSummary, appliedCoupon]);

  // Construct active items list for Checkout
  const checkoutItems: CartItem[] = buyNowItem
    ? [
      {
        id: `buynow-${buyNowItem.productId}`,
        cartId: 'buynow',
        productId: buyNowItem.productId,
        quantity: buyNowItem.quantity,
        unitPrice: buyNowItem.price,
        totalPrice: buyNowItem.price * buyNowItem.quantity,
        size: buyNowItem.selectedSize ?? null,
        product: {
          id: buyNowItem.productId,
          title: buyNowItem.title,
          name: buyNowItem.title,
          displayPrice: buyNowItem.price,
          customerSellPrice: buyNowItem.price,
          price: buyNowItem.price,
          productCode: buyNowItem.productCode || '',
          slug: buyNowItem.slug || buyNowItem.productId,
          images: buyNowItem.image ? [{ id: '1', url: buyNowItem.image, isPrimary: true }] : [],
        } as unknown as Product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    : cart?.items || [];

  const isReseller = useAppSelector(selectIsReseller);

  // Totals calculations - reactive single source of truth for shipping fee & grand total
  const calculatedSubtotal = checkoutItems.reduce((sum, item) => {
    const price = item.unitPrice ?? item.price ?? (item.product ? getProductDisplayPrice(item.product, isReseller) : 0);
    return sum + price * item.quantity;
  }, 0);


  const subtotal = checkoutSummary?.subtotal ?? calculatedSubtotal;
  const categoryDiscount = checkoutSummary?.discount ?? cart?.summary?.discount ?? 0;

  // Dynamic delivery charge calculation from backend settings API
  const { data: settingsData } = useGetSettingsQuery();
  const data = (settingsData as any)?.data || settingsData;
  const delivery = data?.delivery || {};

  const rawFreeDeliveryEnabled = data?.freeDeliveryEnabled ?? delivery.freeDeliveryEnabled;
  const freeDeliveryEnabled =
    rawFreeDeliveryEnabled !== undefined
      ? Boolean(rawFreeDeliveryEnabled)
      : data?.freeShippingMinOrderAmount === -1;

  const rawDeliveryEnabled = data?.deliveryEnabled ?? delivery.deliveryEnabled;

  // Free delivery means delivery service IS available.
  // Delivery is only disabled if freeDeliveryEnabled is false AND rawDeliveryEnabled is explicitly false.
  const deliveryEnabled =
    freeDeliveryEnabled || (rawDeliveryEnabled !== undefined ? Boolean(rawDeliveryEnabled) : true);

  const insideCost = Number(
    data?.insideDhakaCharge ??
    data?.insideDhakaDeliveryCharge ??
    delivery.insideDhakaCharge ??
    delivery.insideDhakaDeliveryCharge ??
    60
  );
  const outsideCost = Number(
    data?.outsideDhakaCharge ??
    data?.outsideDhakaDeliveryCharge ??
    delivery.outsideDhakaCharge ??
    delivery.outsideDhakaDeliveryCharge ??
    120
  );

  let shippingFee = 0;
  let isFreeDelivery = false;

  if (!deliveryEnabled) {
    // Delivery disabled -> cost = 0, isFreeDelivery = false
    shippingFee = 0;
    isFreeDelivery = false;
  } else if (freeDeliveryEnabled) {
    // Delivery enabled + Free Delivery -> cost = 0, isFreeDelivery = true
    shippingFee = 0;
    isFreeDelivery = true;
  } else {
    // Delivery enabled + Normal Delivery -> cost = configured charge
    shippingFee = activeZone === 'outside_dhaka' ? outsideCost : insideCost;
    isFreeDelivery = false;
  }

  const tax = cart?.summary?.tax ?? 0;
  const grandTotal = Math.max(0, subtotal - categoryDiscount - couponDiscount + shippingFee + tax);

  // Keep fields linked & prefill profile when logged in
  const watchCustomerName = watch('customerName');
  const watchCustomerPhone = watch('customerPhone');

  useEffect(() => {
    if (watchCustomerName && !watch('recipientName')) {
      setValue('recipientName', watchCustomerName);
    }
  }, [watchCustomerName, setValue, watch]);

  useEffect(() => {
    if (watchCustomerPhone && !watch('phone')) {
      setValue('phone', watchCustomerPhone);
    }
  }, [watchCustomerPhone, setValue, watch]);

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
    setValue('shippingZone', zone, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setValue('paymentMethod', method, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
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
    if (checkoutItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Items to Checkout',
        text: 'Your order has no items. Please select a product or add items to cart.',
      });
      return;
    }

    const name = (data.customerName || data.recipientName || 'Customer').trim();
    const phone = normalizeBDMobileNumber(data.customerPhone || data.phone || '');
    const recipientPhone = normalizeBDMobileNumber(data.phone || data.customerPhone || '');
    const email = (data.customerEmail || '').trim();

    if (!phone) {
      Swal.fire({
        icon: 'error',
        title: 'Mobile Phone Required',
        text: 'Mobile phone number is mandatory for placing an order.',
      });
      return;
    }

    const fullAddress = `${data.addressLine}, ${data.upazila}, ${data.district}, ${data.division}`.trim();

    const deliveryArea: 'INSIDE_DHAKA' | 'OUTSIDE_DHAKA' =
      data.shippingZone === 'outside_dhaka' || shippingZone === 'outside_dhaka'
        ? 'OUTSIDE_DHAKA'
        : 'INSIDE_DHAKA';

    const rawMethod = (data.paymentMethod || paymentMethod || 'COD').toUpperCase();
    const validMethods: PaymentMethod[] = ['COD', 'BKASH', 'NAGAD'];
    const uppercasePaymentMethod: PaymentMethod = validMethods.includes(rawMethod as PaymentMethod)
      ? (rawMethod as PaymentMethod)
      : 'COD';

    // Products payload
    const productsPayload = checkoutItems
      .map((item) => {
        const id = item.productId || item.product?.id;
        if (!id) return null;
        return {
          productId: id,
          quantity: item.quantity,
          size: item.size || null,
        };
      })
      .filter((item): item is { productId: string; quantity: number; size: string | null } => Boolean(item));

    const checkoutPayload: CheckoutRequest = {
      products: productsPayload,
      customerName: name,
      customerPhone: phone,
      customerEmail: email || undefined,
      userEmail: email || undefined,
      guestName: name,
      guestPhone: phone,
      guestEmail: email || undefined,
      guestAddress: data.addressLine,
      guestDivision: data.division,
      guestDistrict: data.district,
      guestUpazila: data.upazila,
      shippingType: data.shippingType,
      address: fullAddress,
      deliveryArea,
      paymentMethod: uppercasePaymentMethod,
      orderNotes: data.orderNotes || undefined,
    };

    if (appliedCoupon?.code?.trim()) {
      checkoutPayload.couponCode = appliedCoupon.code.trim();
    }

    try {
      const response = await placeOrder(checkoutPayload).unwrap();
      const orderId =
        response.orderId ||
        response.data?.orderCode ||
        response.data?.orderNumber ||
        response.data?.orderId ||
        response.data?.id ||
        'ORD-' + Date.now();

      clearBuyNowItem();

      // 1. Invalidate Cart & Checkout RTK Query cache
      dispatch(cartApi.util.invalidateTags(['Cart']));
      dispatch(checkoutApi.util.invalidateTags(['Checkout']));

      // 2. Refetch cart immediately
      dispatch(cartApi.endpoints.getCart.initiate(undefined, { subscribe: false, forceRefetch: true }));

      // 3. Clear guest cart from localStorage/sessionStorage
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.removeItem('growthzen_buy_now_item');
          sessionStorage.removeItem('growthzen_pending_action');
          sessionStorage.removeItem('buy_now_item');

          localStorage.removeItem('growthzen_guest_cart');
          localStorage.removeItem('growthzen_cart');
          localStorage.removeItem('guest_cart');
          localStorage.removeItem('cart');
        } catch {
          // ignore
        }
      }

      Swal.fire({
        icon: 'success',
        title: 'Order Placed Successfully!',
        text: `Thank you for your order! Your order ID is #${orderId}.`,
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
        (status === 400
          ? 'Invalid order details. Please check mobile number and address fields.'
          : status === 409
            ? 'Stock changed while ordering. Please review your cart.'
            : 'Failed to place order. Please try again.');

      Swal.fire({
        icon: 'error',
        title: 'Checkout Failed',
        text: errorMessage,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Customer Info, Shipping Form, Shipping Selector, Payment Selection */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* 1. Customer Contact Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Customer Contact Information
            </h2>
            {isAuthenticated ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
                <UserCheck className="w-3.5 h-3.5" /> Logged In User
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900">
                <ShieldCheck className="w-3.5 h-3.5" /> Guest Checkout
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Customer Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5 text-slate-400" /> Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Full Name"
                {...register('customerName')}
                className={`h-11 px-4 rounded-xl border text-sm font-medium bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.customerName
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-800 focus:border-emerald-600 focus:ring-emerald-500/20'
                  }`}
              />
              {errors.customerName && (
                <span className="text-[11px] text-rose-500 font-semibold">{errors.customerName.message}</span>
              )}
            </div>

            {/* Customer Phone (Mandatory) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <PhoneIcon className="w-3.5 h-3.5 text-slate-400" /> Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                {...register('customerPhone')}
                className={`h-11 px-4 rounded-xl border text-sm font-medium bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.customerPhone
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-800 focus:border-emerald-600 focus:ring-emerald-500/20'
                  }`}
              />
              {errors.customerPhone && (
                <span className="text-[11px] text-rose-500 font-semibold">{errors.customerPhone.message}</span>
              )}
            </div>

            {/* Customer Email (Optional) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                placeholder="example@domain.com"
                {...register('customerEmail')}
                className={`h-11 px-4 rounded-xl border text-sm font-medium bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.customerEmail
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-800 focus:border-emerald-600 focus:ring-emerald-500/20'
                  }`}
              />
              {errors.customerEmail && (
                <span className="text-[11px] text-rose-500 font-semibold">{errors.customerEmail.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Shipping Address & Details Form */}
        <ShippingAddressForm
          register={register as unknown as React.ComponentProps<typeof ShippingAddressForm>['register']}
          errors={errors as unknown as React.ComponentProps<typeof ShippingAddressForm>['errors']}
          setValue={setValue as unknown as React.ComponentProps<typeof ShippingAddressForm>['setValue']}
          watch={watch as unknown as React.ComponentProps<typeof ShippingAddressForm>['watch']}
        />

        {/* 3. Delivery Area / Zone Selector */}
        <ShippingSelector
          selectedZone={activeZone}
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
          items={checkoutItems}
          subtotal={subtotal}
          shippingFee={shippingFee}
          coupon={appliedCoupon}
          couponDiscount={couponDiscount}
          categoryDiscount={categoryDiscount}
          tax={tax}
          grandTotal={grandTotal}
          isLoading={isSubmitting}
          deliveryEnabled={deliveryEnabled}
          isFreeDelivery={isFreeDelivery}
          onCouponApplied={handleCouponApplied}
          onCouponRemoved={handleCouponRemoved}
        />
      </div>
    </form>
  );
};

export default CheckoutForm;


