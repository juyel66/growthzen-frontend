"use client";

import React, { useEffect } from "react";
import { useForm, Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateCouponMutation,
  useUpdateCouponMutation,
} from "@/services/couponApi";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import { useGetProductsQuery } from "@/services/productApi";
import { Coupon, CreateCouponInput } from "@/types/coupon";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import {
  X,
  Tag,
  Calendar,
  DollarSign,
  Percent,
  Layers,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";

const couponFormSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3, "Code must be at least 3 characters")
      .max(50, "Code cannot exceed 50 characters")
      .regex(
        /^[A-Za-z0-9_-]+$/,
        "Code can only contain letters, numbers, hyphens, and underscores"
      ),
    description: z.string().trim().max(1000).optional(),
    discountType: z.enum(["PERCENTAGE", "FIXED"]),
    discountValue: z.coerce
      .number({ invalid_type_error: "Discount value must be a number" })
      .positive("Discount value must be greater than 0"),
    scope: z.enum(["ENTIRE_ORDER", "SPECIFIC_PRODUCT", "SPECIFIC_CATEGORY"]),
    productIds: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    startsAt: z.string().min(1, "Start date is required"),
    expiresAt: z.string().min(1, "Expiry date is required"),
    maximumUsage: z.coerce
      .number()
      .int()
      .positive("Usage limit must be a positive integer")
      .optional()
      .nullable(),
    perUserUsageLimit: z.coerce
      .number()
      .int()
      .positive("Per user limit must be a positive integer")
      .optional()
      .nullable(),
    minimumOrderAmount: z.coerce
      .number()
      .nonnegative("Minimum order amount cannot be negative")
      .optional()
      .nullable(),
    maximumDiscount: z.coerce
      .number()
      .nonnegative("Maximum discount cannot be negative")
      .optional()
      .nullable(),
    isActive: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.discountType === "PERCENTAGE" && data.discountValue > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message: "Percentage discount cannot exceed 100%",
      });
    }

    if (
      data.discountType === "FIXED" &&
      data.maximumDiscount &&
      data.discountValue > data.maximumDiscount
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message: "Fixed discount cannot exceed Maximum Discount cap",
      });
    }

    if (data.startsAt && data.expiresAt) {
      const start = new Date(data.startsAt);
      const expiry = new Date(data.expiresAt);
      if (expiry <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["expiresAt"],
          message: "Expiry date must be strictly after Start date",
        });
      }
    }

    if (data.scope === "SPECIFIC_PRODUCT" && (!data.productIds || data.productIds.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["productIds"],
        message: "At least one product must be selected for SPECIFIC_PRODUCT scope",
      });
    }

    if (data.scope === "SPECIFIC_CATEGORY" && (!data.categories || data.categories.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["categories"],
        message: "At least one category must be selected for SPECIFIC_CATEGORY scope",
      });
    }
  });

type CouponFormData = z.infer<typeof couponFormSchema>;

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponToEdit?: Coupon | null;
}

export const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  onClose,
  couponToEdit,
}) => {
  const isEditing = Boolean(couponToEdit);

  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const isLoading = isCreating || isUpdating;

  // Auxiliary data queries
  const { data: categoriesList = [] } = useGetCategoriesQuery(undefined, { skip: !isOpen });
  const { data: productsList = [] } = useGetProductsQuery({ limit: 100 }, { skip: !isOpen });

  const formatDateForInput = (dateStr?: string | Date) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 16);
  };

  const getDefaultStartDate = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  const getDefaultExpiryDate = () => {
    const now = new Date();
    now.setDate(now.getDate() + 30);
    return now.toISOString().slice(0, 16);
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponFormSchema) as Resolver<CouponFormData>,
    defaultValues: {
      code: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 10,
      scope: "ENTIRE_ORDER",
      productIds: [],
      categories: [],
      startsAt: getDefaultStartDate(),
      expiresAt: getDefaultExpiryDate(),
      maximumUsage: null,
      perUserUsageLimit: 1,
      minimumOrderAmount: null,
      maximumDiscount: null,
      isActive: true,
    },
  });

  const selectedDiscountType = watch("discountType");
  const selectedScope = watch("scope");
  const selectedProductIds = watch("productIds") || [];
  const selectedCategories = watch("categories") || [];

  useEffect(() => {
    if (isOpen) {
      if (couponToEdit) {
        const discType =
          couponToEdit.discountType?.toUpperCase() === "FIXED" ? "FIXED" : "PERCENTAGE";
        const scopeVal =
          couponToEdit.scope === "SPECIFIC_PRODUCT"
            ? "SPECIFIC_PRODUCT"
            : couponToEdit.scope === "SPECIFIC_CATEGORY" || couponToEdit.scope === "category"
            ? "SPECIFIC_CATEGORY"
            : "ENTIRE_ORDER";

        reset({
          code: couponToEdit.code,
          description: couponToEdit.description || "",
          discountType: discType,
          discountValue: couponToEdit.discountValue,
          scope: scopeVal,
          productIds: couponToEdit.productIds || [],
          categories: couponToEdit.categories || (couponToEdit.categoryName ? [couponToEdit.categoryName] : []),
          startsAt: formatDateForInput(couponToEdit.startsAt || couponToEdit.createdAt),
          expiresAt: formatDateForInput(couponToEdit.expiresAt || couponToEdit.expiryDate || getDefaultExpiryDate()),
          maximumUsage: couponToEdit.maximumUsage ?? null,
          perUserUsageLimit: couponToEdit.perUserUsageLimit ?? 1,
          minimumOrderAmount: couponToEdit.minimumOrderAmount ?? couponToEdit.minOrderValue ?? null,
          maximumDiscount: couponToEdit.maximumDiscount ?? couponToEdit.maxDiscount ?? null,
          isActive: couponToEdit.isActive ?? true,
        });
      } else {
        reset({
          code: "",
          description: "",
          discountType: "PERCENTAGE",
          discountValue: 10,
          scope: "ENTIRE_ORDER",
          productIds: [],
          categories: [],
          startsAt: getDefaultStartDate(),
          expiresAt: getDefaultExpiryDate(),
          maximumUsage: null,
          perUserUsageLimit: 1,
          minimumOrderAmount: null,
          maximumDiscount: null,
          isActive: true,
        });
      }
    }
  }, [isOpen, couponToEdit, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CouponFormData) => {
    const payload: CreateCouponInput = {
      code: data.code.trim().toUpperCase(),
      description: data.description || undefined,
      discountType: data.discountType,
      discountValue: Number(data.discountValue),
      scope: data.scope,
      productIds: data.scope === "SPECIFIC_PRODUCT" ? data.productIds : [],
      categories: data.scope === "SPECIFIC_CATEGORY" ? data.categories : [],
      startsAt: new Date(data.startsAt).toISOString(),
      expiresAt: new Date(data.expiresAt).toISOString(),
      maximumUsage: data.maximumUsage ? Number(data.maximumUsage) : null,
      perUserUsageLimit: data.perUserUsageLimit ? Number(data.perUserUsageLimit) : null,
      minimumOrderAmount: data.minimumOrderAmount ? Number(data.minimumOrderAmount) : null,
      maximumDiscount: data.maximumDiscount ? Number(data.maximumDiscount) : null,
      isActive: data.isActive,
    };

    try {
      if (isEditing && couponToEdit?.id) {
        await updateCoupon({ id: couponToEdit.id, data: payload }).unwrap();
        Swal.fire({
          icon: "success",
          title: "Coupon Updated",
          text: `Coupon ${payload.code} has been updated successfully!`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        await createCoupon(payload).unwrap();
        Swal.fire({
          icon: "success",
          title: "Coupon Created",
          text: `Coupon ${payload.code} created successfully!`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      }
      onClose();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      const msg = error?.data?.message || "Failed to save coupon. Please check inputs.";
      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text: msg,
      });
    }
  };

  const toggleCategory = (catName: string) => {
    const current = [...selectedCategories];
    const index = current.indexOf(catName);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(catName);
    }
    setValue("categories", current, { shouldValidate: true });
  };

  const toggleProduct = (prodId: string) => {
    const current = [...selectedProductIds];
    const index = current.indexOf(prodId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(prodId);
    }
    setValue("productIds", current, { shouldValidate: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                {isEditing ? "Edit Coupon" : "Create New Coupon"}
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEditing
                  ? "Update parameters for existing promotional coupon"
                  : "Set up a new discount promotion for your store"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto pr-2">
          {/* Row 1: Code & Active Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                Coupon Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. SUMMER20"
                {...register("code")}
                onChange={(e) => setValue("code", e.target.value.toUpperCase())}
                className={`h-11 px-4 rounded-xl border text-sm font-bold tracking-wider uppercase bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition ${
                  errors.code
                    ? "border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-200 dark:border-slate-800 focus:border-blue-600 focus:ring-blue-500/20"
                }`}
              />
              {errors.code && (
                <span className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.code.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5 justify-end">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Status Toggle
              </label>
              <label className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {watch("isActive") ? "Active" : "Inactive"}
                </span>
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Row 2: Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Description <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 20% discount on all fashion items above $100"
              {...register("description")}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition resize-none"
            />
            {errors.description && (
              <span className="text-[11px] text-rose-500 font-semibold">{errors.description.message}</span>
            )}
          </div>

          {/* Row 3: Discount Type & Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                Discount Type <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setValue("discountType", "PERCENTAGE", { shouldValidate: true })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                    selectedDiscountType === "PERCENTAGE"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" /> Percentage
                </button>
                <button
                  type="button"
                  onClick={() => setValue("discountType", "FIXED", { shouldValidate: true })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                    selectedDiscountType === "FIXED"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" /> Fixed Amount
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Discount Value <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  placeholder={selectedDiscountType === "PERCENTAGE" ? "20" : "50"}
                  {...register("discountValue")}
                  className={`w-full h-11 pl-4 pr-10 rounded-xl border text-sm font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition ${
                    errors.discountValue
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-200 dark:border-slate-800 focus:border-blue-600 focus:ring-blue-500/20"
                  }`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
                  {selectedDiscountType === "PERCENTAGE" ? "%" : "$"}
                </span>
              </div>
              {errors.discountValue && (
                <span className="text-[11px] text-rose-500 font-semibold">{errors.discountValue.message}</span>
              )}
            </div>
          </div>

          {/* Row 4: Minimum Order & Maximum Discount Caps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Min Order Amount ($) <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 100"
                {...register("minimumOrderAmount")}
                className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition"
              />
              {errors.minimumOrderAmount && (
                <span className="text-[11px] text-rose-500 font-semibold">{errors.minimumOrderAmount.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Max Discount Cap ($) <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 50"
                {...register("maximumDiscount")}
                className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition"
              />
              {errors.maximumDiscount && (
                <span className="text-[11px] text-rose-500 font-semibold">{errors.maximumDiscount.message}</span>
              )}
            </div>
          </div>

          {/* Row 5: Usage Limits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Total Usage Limit <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 500"
                {...register("maximumUsage")}
                className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition"
              />
              {errors.maximumUsage && (
                <span className="text-[11px] text-rose-500 font-semibold">{errors.maximumUsage.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Per-User Usage Limit <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 1"
                {...register("perUserUsageLimit")}
                className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition"
              />
              {errors.perUserUsageLimit && (
                <span className="text-[11px] text-rose-500 font-semibold">{errors.perUserUsageLimit.message}</span>
              )}
            </div>
          </div>

          {/* Row 6: Scope Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-500" /> Promotion Scope
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setValue("scope", "ENTIRE_ORDER", { shouldValidate: true })}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  selectedScope === "ENTIRE_ORDER"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 shadow-xs"
                    : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                }`}
              >
                Entire Order
              </button>
              <button
                type="button"
                onClick={() => setValue("scope", "SPECIFIC_CATEGORY", { shouldValidate: true })}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  selectedScope === "SPECIFIC_CATEGORY"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 shadow-xs"
                    : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                }`}
              >
                Categories
              </button>
              <button
                type="button"
                onClick={() => setValue("scope", "SPECIFIC_PRODUCT", { shouldValidate: true })}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  selectedScope === "SPECIFIC_PRODUCT"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 shadow-xs"
                    : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                }`}
              >
                Products
              </button>
            </div>
          </div>

          {/* Conditional Scope Target Selectors */}
          {selectedScope === "SPECIFIC_CATEGORY" && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Select Applicable Categories:
              </span>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
                {categoriesList.map((cat: Category) => {
                  const catName = cat.name;
                  const isSel = selectedCategories.includes(catName);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(catName)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border cursor-pointer ${
                        isSel
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      {catName}
                    </button>
                  );
                })}
              </div>
              {errors.categories && (
                <span className="text-[11px] text-rose-500 font-semibold">{errors.categories.message}</span>
              )}
            </div>
          )}

          {selectedScope === "SPECIFIC_PRODUCT" && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Select Applicable Products:
              </span>
              <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
                {productsList.map((prod: Product) => {
                  const isSel = selectedProductIds.includes(prod.id);
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => toggleProduct(prod.id)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition border flex items-center justify-between cursor-pointer ${
                        isSel
                          ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      <span className="line-clamp-1">{prod.title || prod.name}</span>
                      <span className="font-mono text-[10px] text-slate-400">SKU: {prod.productCode || prod.id.slice(0, 8)}</span>
                    </button>
                  );
                })}
              </div>
              {errors.productIds && (
                <span className="text-[11px] text-rose-500 font-semibold">{errors.productIds.message}</span>
              )}
            </div>
          )}

          {/* Row 7: Validity Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500" /> Start Date & Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                {...register("startsAt")}
                className={`h-11 px-3 rounded-xl border text-xs font-semibold bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition ${
                  errors.startsAt
                    ? "border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-200 dark:border-slate-800 focus:border-blue-600 focus:ring-blue-500/20"
                }`}
              />
              {errors.startsAt && (
                <span className="text-[11px] text-rose-500 font-semibold">{errors.startsAt.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-rose-500" /> Expiry Date & Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                {...register("expiresAt")}
                className={`h-11 px-3 rounded-xl border text-xs font-semibold bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition ${
                  errors.expiresAt
                    ? "border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-200 dark:border-slate-800 focus:border-blue-600 focus:ring-blue-500/20"
                }`}
              />
              {errors.expiresAt && (
                <span className="text-[11px] text-rose-500 font-semibold">{errors.expiresAt.message}</span>
              )}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEditing ? "Update Coupon" : "Save Coupon"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponModal;
