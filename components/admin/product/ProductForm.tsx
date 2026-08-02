'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { productFormSchema, ProductFormValues } from '@/lib/validations/product';
import { useCreateProductMutation } from '@/services/productApi';
import CategorySelector from './CategorySelector';
import ProductBasicInfo from './ProductBasicInfo';
import PricingSection from './PricingSection';
import AttributeManager from './AttributeManager';
import SizeManager from './SizeManager';
import ImageUploader from './ImageUploader';
import VideoUploader from './VideoUploader';
import ProductStatus from './ProductStatus';
import FeaturedSwitch from './FeaturedSwitch';
import SubmitButton from './SubmitButton';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const ProductForm: React.FC = () => {
  const router = useRouter();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: {
      title: '',
      shortDescription: '',
      description: '',
      categoryId: '',
      productCode: '',
      barcode: '',
      costPrice: 0,
      customerSellPrice: 0,
      resellerPrice: 0,
      salePrice: null,
      discountType: null,
      discountValue: null,
      taxRate: null,
      couponCode: '',
      attributes: [],
      enableSize: false,
      availableSizes: [],
      status: 'ACTIVE',
      thumbnailImage: '',
      productImages: [],
      productVideos: [],
      isFeatured: false,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      // Build clean payload according to backend API specification
      const payload: any = {
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        categoryId: data.categoryId,
        productCode: data.productCode,
        barcode: data.barcode || null,
        costPrice: Number(data.costPrice),
        customerSellPrice: Number(data.customerSellPrice),
        resellerPrice: Number(data.resellerPrice),
        salePrice: data.salePrice ? Number(data.salePrice) : null,
        discountType: data.discountType || null,
        discountValue: data.discountValue ? Number(data.discountValue) : null,
        taxRate: data.taxRate ? Number(data.taxRate) : null,
        couponCode: data.couponCode || null,
        attributes: data.attributes && data.attributes.length > 0 ? data.attributes : [],
        enableSize: Boolean(data.enableSize),
        availableSizes: data.enableSize && data.availableSizes ? data.availableSizes : [],
        status: data.status || 'ACTIVE',
        thumbnailImage: data.thumbnailImage,
        productImages: data.productImages && data.productImages.length > 0 ? data.productImages : [],
        productVideos: data.productVideos && data.productVideos.length > 0 ? data.productVideos : [],
        isFeatured: Boolean(data.isFeatured),
      };

      await createProduct(payload).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'Product Published Successfully!',
        text: `${data.title} has been created and added to the enterprise catalog.`,
        confirmButtonText: 'View Product List',
        showCancelButton: true,
        cancelButtonText: 'Add Another Product',
      }).then((result) => {
        reset();
        if (result.isConfirmed) {
          router.push('/admin-dashboard/products');
        }
      });
    } catch (error: any) {
      const status = error?.status;
      const serverMessage = error?.data?.message;

      let title = 'Failed to Create Product';
      let message = serverMessage || 'An unexpected error occurred while communicating with the server.';

      if (status === 400) {
        title = 'Validation Error';
        message = serverMessage || 'Please check form input fields for errors.';
      } else if (status === 401) {
        title = 'Unauthorized';
        message = 'Your session has expired. Please sign in again as an Administrator.';
      } else if (status === 403) {
        title = 'Access Denied';
        message = 'You do not have permission to create products.';
      } else if (status === 409) {
        title = 'Duplicate Product Code';
        message = 'A product with this product code / SKU already exists.';
      } else if (status === 422) {
        title = 'Unprocessable Entity';
        message = serverMessage || 'Product data could not be processed.';
      }

      Swal.fire({
        icon: 'error',
        title,
        text: message,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-12">
      {/* Top Header Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col gap-1">
          <Link
            href="/admin-dashboard/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Products Catalog
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Add New Product
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin-dashboard/products">
            <button
              type="button"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
          </Link>
          <SubmitButton isLoading={isLoading} />
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Main Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ProductBasicInfo register={register} errors={errors} />
          <PricingSection register={register} errors={errors} watch={watch} />
          <AttributeManager control={control} register={register} errors={errors} />
          <SizeManager register={register} errors={errors} watch={watch} setValue={setValue} />
          <ImageUploader register={register} errors={errors} watch={watch} setValue={setValue} />
          <VideoUploader watch={watch} setValue={setValue} />
        </div>

        {/* Right 1 Column: Category, Status & Settings */}
        <div className="flex flex-col gap-6">
          <CategorySelector register={register} errors={errors} setValue={setValue} watch={watch} />
          <ProductStatus register={register} />
          <FeaturedSwitch register={register} />

          {/* Sticky Actions Sidebar Card */}
          <div className="sticky top-6 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Publish Actions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Verify category selection, SKU code, and prices before publishing to the storefront.
            </p>
            <SubmitButton isLoading={isLoading} />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
