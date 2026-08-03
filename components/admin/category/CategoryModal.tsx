'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categoryFormSchema, CategoryFormValues } from '@/lib/validations/category';
import { Category } from '@/types/category';
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation } from '@/services/categoryApi';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { X, FolderTree, Layers, Percent, Sparkles, Image as ImageIcon, Globe, CheckCircle2 } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';
import Swal from 'sweetalert2';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: Category | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  initialCategory,
}) => {
  const isEditing = Boolean(initialCategory);
  const { data: categories } = useGetCategoriesQuery();

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema) as any,
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      image: '',
      parentCategoryId: null,
      discountPercentage: 0,
      discountEnabled: false,
      sortOrder: 0,
      showOnHomepage: false,
      status: 'ACTIVE',
      metaTitle: '',
      metaDescription: '',
    },
  });

  const categoryName = watch('name');
  const imageUrl = watch('image');
  const discountEnabled = watch('discountEnabled');
  const discountPercentage = watch('discountPercentage');

  // Auto-generate slug from Category Name if not manually edited
  useEffect(() => {
    if (!isEditing && !isSlugManuallyEdited && categoryName) {
      const generatedSlug = categoryName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [categoryName, isEditing, isSlugManuallyEdited, setValue]);

  // Populate initial values when editing
  useEffect(() => {
    if (initialCategory && isOpen) {
      reset({
        name: initialCategory.name || '',
        slug: initialCategory.slug || '',
        description: initialCategory.description || '',
        image: initialCategory.image || '',
        parentCategoryId:
          typeof initialCategory.parentCategoryId === 'string'
            ? initialCategory.parentCategoryId
            : typeof initialCategory.parent === 'object' && initialCategory.parent?.id
            ? initialCategory.parent.id
            : null,
        discountPercentage: initialCategory.discountPercentage || 0,
        discountEnabled: Boolean(initialCategory.discountEnabled),
        sortOrder: initialCategory.sortOrder || 0,
        showOnHomepage: Boolean(initialCategory.showOnHomepage),
        status: initialCategory.status || 'ACTIVE',
        metaTitle: initialCategory.metaTitle || '',
        metaDescription: initialCategory.metaDescription || '',
      });
      setIsSlugManuallyEdited(true);
    } else if (!isOpen) {
      reset({
        name: '',
        slug: '',
        description: '',
        image: '',
        parentCategoryId: null,
        discountPercentage: 0,
        discountEnabled: false,
        sortOrder: 0,
        showOnHomepage: false,
        status: 'ACTIVE',
        metaTitle: '',
        metaDescription: '',
      });
      setIsSlugManuallyEdited(false);
    }
  }, [initialCategory, isOpen, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      const payload: any = {
        name: data.name,
        slug: data.slug || undefined,
        description: data.description || null,
        image: data.image || null,
        parentCategoryId: data.parentCategoryId || null,
        discountPercentage: Number(data.discountPercentage || 0),
        discountEnabled: Boolean(data.discountEnabled),
        sortOrder: Number(data.sortOrder || 0),
        showOnHomepage: Boolean(data.showOnHomepage),
        status: data.status || 'ACTIVE',
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
      };

      if (isEditing && initialCategory) {
        await updateCategory({ id: initialCategory.id, body: payload }).unwrap();
        Swal.fire({
          icon: 'success',
          title: 'Category Updated!',
          text: `"${data.name}" has been updated successfully.`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        await createCategory(payload).unwrap();
        Swal.fire({
          icon: 'success',
          title: 'Category Created!',
          text: `"${data.name}" has been added to the catalog.`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
        });
      }

      onClose();
    } catch (error: any) {
      const status = error?.status;
      const message =
        error?.data?.message ||
        (status === 409
          ? 'A category with this name or slug already exists.'
          : status === 400
          ? 'Validation error. Please check your form input.'
          : 'Failed to save category. Please try again.');

      Swal.fire({
        icon: 'error',
        title: isEditing ? 'Update Failed' : 'Creation Failed',
        text: message,
      });
    }
  };

  if (!isOpen) return null;

  const availableParentCategories = (categories || []).filter(
    (cat) => !initialCategory || cat.id !== initialCategory.id
  );

  const isLoading = isCreating || isUpdating;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <FolderTree className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {isEditing ? 'Edit Category' : 'Create New Category'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isEditing ? 'Modify category specifications and discounts' : 'Add a new product category to your catalog'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Name */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Category Name *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. Electronics, Fashion, Wireless Accessories"
                  className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                    errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
                  }`}
                />
                {errors.name && <span className="text-xs text-rose-500 font-semibold">{errors.name.message}</span>}
              </div>

              {/* Slug */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Category Slug (URL Handle)</span>
                  <span className="text-[11px] font-normal text-slate-400">Auto-generated from name</span>
                </label>
                <input
                  type="text"
                  {...register('slug', {
                    onChange: () => setIsSlugManuallyEdited(true),
                  })}
                  placeholder="e.g. wireless-accessories"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
                {errors.slug && <span className="text-xs text-rose-500 font-semibold">{errors.slug.message}</span>}
              </div>

              {/* Parent Category Selector */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-500" /> Parent Category
                </label>
                <select
                  {...register('parentCategoryId')}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer"
                >
                  <option value="">None (Root Level Category)</option>
                  {availableParentCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.slug})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400">Select parent category to build hierarchical subcategories</span>
              </div>

              {/* Image Input & Preview */}
              <div className="flex flex-col gap-2 md:col-span-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-500" /> Category Banner/Thumbnail Image URL
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    {...register('image')}
                    placeholder="https://res.cloudinary.com/.../category.png"
                    className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                  {imageUrl && (
                    <div className="relative w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                      <SafeImage src={imageUrl} alt="Category preview" fill sizes="44px" className="object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  {...register('description')}
                  placeholder="Optional brief overview of products under this category..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Category Default Discount Section */}
              <div className="flex flex-col gap-3 md:col-span-2 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Enable Category Default Discount
                    </span>
                  </div>
                  <label className="relative inline-block w-10 h-5 transition duration-200 ease-in-out cursor-pointer select-none">
                    <input type="checkbox" {...register('discountEnabled')} className="opacity-0 w-0 h-0 peer" />
                    <span className="absolute inset-0 rounded-full bg-slate-300 dark:bg-slate-700 peer-checked:bg-emerald-600 transition-colors duration-200" />
                    <span className="absolute left-1 top-1 w-3 h-3 rounded-full bg-white transition-transform duration-200 transform peer-checked:translate-x-5" />
                  </label>
                </div>

                {discountEnabled && (
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Default Discount Percentage (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        {...register('discountPercentage')}
                        placeholder="e.g. 15"
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    {discountPercentage > 0 && (
                      <div className="px-3 py-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs rounded-xl self-end">
                        {discountPercentage}% OFF Live
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Status, Homepage & Sort Order Settings */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Category Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer"
                >
                  <option value="ACTIVE">ACTIVE (Visible in Storefront)</option>
                  <option value="INACTIVE">INACTIVE (Hidden from Public)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Sort Order Priority
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('sortOrder')}
                  placeholder="0"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Show on Homepage Toggle */}
              <div className="flex items-center justify-between md:col-span-2 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Show Category Showcase on Homepage
                  </span>
                </div>
                <label className="relative inline-block w-10 h-5 transition duration-200 ease-in-out cursor-pointer select-none">
                  <input type="checkbox" {...register('showOnHomepage')} className="opacity-0 w-0 h-0 peer" />
                  <span className="absolute inset-0 rounded-full bg-slate-300 dark:bg-slate-700 peer-checked:bg-amber-500 transition-colors duration-200" />
                  <span className="absolute left-1 top-1 w-3 h-3 rounded-full bg-white transition-transform duration-200 transform peer-checked:translate-x-5" />
                </label>
              </div>

              {/* SEO Meta Information */}
              <div className="flex flex-col gap-3 md:col-span-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-500" /> SEO Optimization Tags (Optional)
                </span>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    {...register('metaTitle')}
                    placeholder="Search engine title..."
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    {...register('metaDescription')}
                    placeholder="Search engine meta description..."
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-950/40">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                disabled={isLoading}
                className="font-bold cursor-pointer shadow-md hover:shadow-lg transition-all"
              >
                {!isLoading && <CheckCircle2 className="w-4 h-4 mr-1.5" />}
                {isLoading ? 'Saving Category...' : isEditing ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CategoryModal;
