'use client';

import React from 'react';
import SafeImage from '@/components/ui/SafeImage';
import { Category } from '@/types/category';
import { AnimatePresence, motion } from 'framer-motion';
import { X, FolderTree, Tag, Percent, Home, Calendar, Globe, Sparkles, Layers } from 'lucide-react';

interface CategoryDetailsDrawerProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (category: Category) => void;
}

export const CategoryDetailsDrawer: React.FC<CategoryDetailsDrawerProps> = ({
  category,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!category) return null;

  const parentName =
    typeof category.parent === 'object' && category.parent?.name
      ? category.parent.name
      : typeof category.parentCategory === 'object' && category.parentCategory?.name
      ? category.parentCategory.name
      : 'Root Category (None)';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 cursor-pointer"
          />

          {/* Side Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
              <div className="flex items-center gap-2 font-extrabold text-base text-slate-900 dark:text-white">
                <FolderTree className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Category Details
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {/* Image Preview & Name */}
              <div className="flex flex-col items-center text-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="relative w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/80 dark:border-slate-700 flex-shrink-0 shadow-xs">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <FolderTree className="w-10 h-10 text-slate-400 absolute inset-0 m-auto" />
                  )}
                </div>

                <div className="flex flex-col items-center gap-1">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {category.name}
                  </h2>
                  <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-lg border border-emerald-200/60">
                    <Tag className="w-3 h-3" /> /{category.slug}
                  </span>
                </div>
              </div>

              {/* Status Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Status</span>
                  <span
                    className={`font-extrabold text-xs inline-block ${
                      category.status === 'ACTIVE' ? 'text-emerald-600' : 'text-slate-500'
                    }`}
                  >
                    {category.status || 'ACTIVE'}
                  </span>
                </div>

                <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Homepage</span>
                  <span className="font-extrabold text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    <Home className="w-3.5 h-3.5 text-amber-500" />
                    {category.showOnHomepage ? 'Featured on Home' : 'Hidden'}
                  </span>
                </div>
              </div>

              {/* Specifications List */}
              <div className="flex flex-col gap-4 text-xs">
                {/* Parent Category */}
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" /> Parent Category
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{parentName}</span>
                </div>

                {/* Default Discount */}
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-500 flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-slate-400" /> Category Discount
                  </span>
                  <span className="font-extrabold text-emerald-600">
                    {category.discountEnabled && (category.discountPercentage || 0) > 0
                      ? `${category.discountPercentage}% OFF`
                      : 'No Discount'}
                  </span>
                </div>

                {/* Sort Order */}
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-slate-400" /> Sort Order
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{category.sortOrder ?? 0}</span>
                </div>

                {/* Description */}
                {category.description && (
                  <div className="flex flex-col gap-1.5 py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-500">Description</span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      {category.description}
                    </p>
                  </div>
                )}

                {/* SEO Meta Information */}
                {(category.metaTitle || category.metaDescription) && (
                  <div className="flex flex-col gap-2 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-emerald-500" /> SEO Metadata
                    </span>
                    {category.metaTitle && (
                      <div>
                        <span className="font-bold text-slate-400 block text-[10px]">Meta Title</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{category.metaTitle}</span>
                      </div>
                    )}
                    {category.metaDescription && (
                      <div>
                        <span className="font-bold text-slate-400 block text-[10px]">Meta Description</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{category.metaDescription}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Created & Updated Dates */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Created: {new Date(category.createdAt).toLocaleDateString()}
                  </span>
                  <span>Updated: {new Date(category.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-950/40">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(category);
                }}
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-xs cursor-pointer"
              >
                Edit Category
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CategoryDetailsDrawer;
