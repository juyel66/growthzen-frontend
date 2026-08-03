'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { productFormSchema, ProductFormValues } from '@/lib/validations/product';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductByIdQuery,
} from '@/services/productApi';
import { getProductTitle, Product } from '@/types/product';
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
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export function mapProductToFormValues(prod: Product): ProductFormValues {
  let catId = '';
  if (typeof prod.categoryId === 'string' && prod.categoryId) {
    catId = prod.categoryId;
  } else if (prod.categoryDetails?.id) {
    catId = prod.categoryDetails.id;
  } else if (typeof prod.category === 'object' && prod.category?.id) {
    catId = prod.category.id;
  } else if (typeof prod.category === 'string') {
    catId = prod.category;
  }

  const rawThumbnail =
    (prod.thumbnailImage && typeof prod.thumbnailImage === 'string' && prod.thumbnailImage.trim()) ||
    (Array.isArray(prod.productImages) && prod.productImages.find((img) => img && typeof img === 'string' && img.trim())) ||
    (Array.isArray(prod.images) && prod.images.find((img) => img && typeof img === 'string' && img.trim())) ||
    '';

  const thumbnailImage =
    rawThumbnail && rawThumbnail !== 'undefined' && rawThumbnail !== 'null' ? rawThumbnail : '';

  const rawGallery: string[] = [];
  const candidateArrays = [prod.productImages, prod.images];
  candidateArrays.forEach((arr) => {
    if (Array.isArray(arr)) {
      arr.forEach((img) => {
        if (img && typeof img === 'string' && img.trim() && img !== 'undefined' && img !== 'null') {
          if (!rawGallery.includes(img)) {
            rawGallery.push(img);
          }
        }
      });
    }
  });

  return {
    title: getProductTitle(prod),
    shortDescription: prod.shortDescription || '',
    description: prod.description || '',
    categoryId: catId,
    productCode: prod.productCode || prod.sku || '',
    barcode: prod.barcode || '',
    costPrice: prod.costPrice ?? 0,
    customerSellPrice: prod.customerSellPrice ?? prod.price ?? 0,
    resellerPrice: prod.resellerPrice ?? 0,
    salePrice: prod.salePrice !== undefined && prod.salePrice !== null ? Number(prod.salePrice) : null,
    discountType: (prod.discountType as 'PERCENTAGE' | 'FIXED') || null,
    discountValue: prod.discountValue !== undefined && prod.discountValue !== null ? Number(prod.discountValue) : null,
    taxRate: prod.taxRate !== undefined && prod.taxRate !== null ? Number(prod.taxRate) : null,
    couponCode: prod.couponCode || '',
    attributes: Array.isArray(prod.attributes) ? prod.attributes : [],
    enableSize: Boolean(prod.enableSize),
    availableSizes: Array.isArray(prod.availableSizes) ? prod.availableSizes : [],
    status: (prod.status as 'ACTIVE' | 'INACTIVE' | 'DRAFT') || 'ACTIVE',
    thumbnailImage,
    productImages: rawGallery,
    productVideos: Array.isArray(prod.productVideos) ? prod.productVideos : [],
    isFeatured: Boolean(prod.isFeatured),
  };
}

interface ProductFormProps {
  productId?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({ productId }) => {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const {
    data: existingProduct,
    isLoading: isFetchingProduct,
    isError: isFetchError,
    refetch: refetchProduct,
  } = useGetProductByIdQuery(productId || '', {
    skip: !productId,
  });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const isMediaUploading = isImageUploading || isVideoUploading;

  const isLoading = isCreating || isUpdating || isMediaUploading;

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

  useEffect(() => {
    if (isEdit && existingProduct) {
      const newFormValues = mapProductToFormValues(existingProduct);
      const currentThumb = watch('thumbnailImage');
      const currentGallery = watch('productImages');

      // Preserve valid active images if refetched backend payload returns empty
      if (!newFormValues.thumbnailImage && currentThumb && currentThumb !== 'undefined' && currentThumb !== 'null') {
        newFormValues.thumbnailImage = currentThumb;
      }
      if (
        (!newFormValues.productImages || newFormValues.productImages.length === 0) &&
        Array.isArray(currentGallery) &&
        currentGallery.length > 0
      ) {
        newFormValues.productImages = currentGallery.filter(
          (img) => img && typeof img === 'string' && img.trim() && img !== 'undefined' && img !== 'null'
        );
      }

      reset(newFormValues);
    }
  }, [isEdit, existingProduct, reset, watch]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const hasDiscount = Boolean(
        data.discountType &&
          data.discountValue !== null &&
          data.discountValue !== undefined &&
          Number(data.discountValue) > 0
      );
      const discountType = hasDiscount ? data.discountType : null;
      const discountValue = hasDiscount ? Number(data.discountValue) : null;

      const salePrice =
        data.salePrice !== null &&
        data.salePrice !== undefined &&
        (data.salePrice as unknown as string) !== '' &&
        Number(data.salePrice) > 0
          ? Number(data.salePrice)
          : null;

      const taxRate =
        data.taxRate !== null &&
        data.taxRate !== undefined &&
        (data.taxRate as unknown as string) !== '' &&
        Number(data.taxRate) >= 0
          ? Number(data.taxRate)
          : null;

      // Build clean payload according to backend API specification
      const payload: any = {
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        categoryId: data.categoryId,
        productCode: data.productCode,
        barcode: data.barcode?.trim() ? data.barcode.trim() : null,
        costPrice: Number(data.costPrice),
        customerSellPrice: Number(data.customerSellPrice),
        resellerPrice: Number(data.resellerPrice),
        salePrice,
        discountType,
        discountValue,
        taxRate,
        couponCode: data.couponCode?.trim() ? data.couponCode.trim() : null,
        attributes: data.attributes && data.attributes.length > 0 ? data.attributes : [],
        enableSize: Boolean(data.enableSize),
        availableSizes: data.enableSize && data.availableSizes ? data.availableSizes : [],
        status: data.status || 'ACTIVE',
        thumbnailImage: data.thumbnailImage,
        productImages: data.productImages && data.productImages.length > 0 ? data.productImages : [],
        productVideos: data.productVideos && data.productVideos.length > 0 ? data.productVideos : [],
        isFeatured: Boolean(data.isFeatured),
      };

      if (isEdit && productId) {
        const updatedProduct = await updateProduct({ id: productId, body: payload }).unwrap();

        if (updatedProduct) {
          reset(mapProductToFormValues(updatedProduct));
          refetchProduct();
        }

        Swal.fire({
          icon: 'success',
          title: 'Product Updated Successfully!',
          text: `${data.title} has been updated in the enterprise catalog.`,
          confirmButtonText: 'View Product List',
        }).then(() => {
          router.push('/admin-dashboard/products');
        });
      } else {
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
      }
    } catch (error: any) {
      const status = error?.status;
      const serverMessage = error?.data?.message;

      let title = isEdit ? 'Failed to Update Product' : 'Failed to Create Product';
      let message = serverMessage || 'An unexpected error occurred while communicating with the server.';

      if (status === 400) {
        title = 'Validation Error';
        message = serverMessage || 'Please check form input fields for errors.';
      } else if (status === 401) {
        title = 'Unauthorized';
        message = 'Your session has expired. Please sign in again as an Administrator.';
      } else if (status === 403) {
        title = 'Access Denied';
        message = isEdit
          ? 'You do not have permission to update products.'
          : 'You do not have permission to create products.';
      } else if (status === 404) {
        title = 'Product Not Found';
        message = 'The product you are trying to edit was not found on the server.';
      } else if (status === 409) {
        title = 'Duplicate Product Code';
        message = 'A product with this product code / SKU already exists.';
      } else if (status === 422) {
        title = 'Unprocessable Entity';
        message = serverMessage || 'Product data could not be processed.';
      } else if (status === 500) {
        title = 'Server Error';
        message = serverMessage || 'Internal server error occurred while updating product.';
      }

      Swal.fire({
        icon: 'error',
        title,
        text: message,
      });
    }
  };

  if (isEdit && isFetchingProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 max-w-6xl mx-auto">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 dark:text-emerald-400" />
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Loading Product Information</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fetching product data from backend API...
          </p>
        </div>
      </div>
    );
  }

  if (isEdit && isFetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-3xl p-12 max-w-6xl mx-auto text-center">
        <AlertCircle className="w-12 h-12 text-rose-600 dark:text-rose-400" />
        <div>
          <h3 className="text-lg font-bold text-rose-800 dark:text-rose-200">Failed to Load Product</h3>
          <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
            Could not fetch product details from the backend server.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <button
            type="button"
            onClick={() => refetchProduct()}
            className="px-5 py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 transition cursor-pointer"
          >
            Retry Loading
          </button>
          <Link href="/admin-dashboard/products">
            <button
              type="button"
              className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-300 transition cursor-pointer"
            >
              Back to Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

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
            {isEdit ? 'Edit Product' : 'Add New Product'}
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
          <SubmitButton isLoading={isLoading} isEdit={isEdit} />
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
          <ImageUploader
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            onUploadingChange={setIsImageUploading}
          />
          <VideoUploader
            watch={watch}
            setValue={setValue}
            onUploadingChange={setIsVideoUploading}
          />
        </div>

        {/* Right 1 Column: Category, Status & Settings */}
        <div className="flex flex-col gap-6">
          <CategorySelector register={register} errors={errors} setValue={setValue} watch={watch} />
          <ProductStatus register={register} />
          <FeaturedSwitch register={register} />

          {/* Sticky Actions Sidebar Card */}
          <div className="sticky top-6 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {isEdit ? 'Update Actions' : 'Publish Actions'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isEdit
                ? 'Review changes to pricing, attributes, images and status before saving.'
                : 'Verify category selection, SKU code, and prices before publishing to the storefront.'}
            </p>
            <SubmitButton isLoading={isLoading} isEdit={isEdit} />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
