'use client';

import React, { useState } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import { Category } from '@/types/category';
import { FolderTree, Tag, Eye, Edit3, Trash2, ChevronLeft, ChevronRight, Layers, Percent, Home, Sparkles } from 'lucide-react';

interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
  onRefetch: () => void;
  onViewDetails: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  isLoading,
  isError,
  onRefetch,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil((categories || []).length / itemsPerPage) || 1;
  const paginatedCategories = (categories || []).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span>Loading categories catalog from server...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-xs text-rose-500 flex flex-col items-center gap-2">
        <span>Failed to load categories list. Please try again.</span>
        <button
          onClick={onRefetch}
          className="font-bold underline text-slate-700 hover:text-slate-900 cursor-pointer"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col items-center gap-3">
        <FolderTree className="w-12 h-12 text-slate-300 dark:text-slate-700 stroke-[1.5]" />
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          No categories found
        </h3>
        <p className="text-xs text-slate-400 max-w-sm">
          No category records matching your active filters. Try adjusting search or create a new category.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-6">Category</th>
              <th className="py-3.5 px-4">Slug</th>
              <th className="py-3.5 px-4">Parent Category</th>
              <th className="py-3.5 px-4">Discount %</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Homepage</th>
              <th className="py-3.5 px-4">Sort Order</th>
              <th className="py-3.5 px-4">Created Date</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedCategories.map((cat) => {
              const parentName =
                typeof cat.parent === 'object' && cat.parent?.name
                  ? cat.parent.name
                  : typeof cat.parentCategory === 'object' && cat.parentCategory?.name
                  ? cat.parentCategory.name
                  : 'Root Category';

              return (
                <tr key={cat.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                  {/* Category Image & Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/80 dark:border-slate-700 flex-shrink-0">
                        {cat.image ? (
                          <SafeImage
                            src={cat.image}
                            alt={cat.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <FolderTree className="w-5 h-5 text-slate-400 absolute inset-0 m-auto" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => onViewDetails(cat)}
                        className="font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition text-left cursor-pointer"
                      >
                        {cat.name}
                      </button>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="py-4 px-4 font-mono text-slate-600 dark:text-slate-400 font-medium">
                    /{cat.slug}
                  </td>

                  {/* Parent Category */}
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      <Layers className="w-3 h-3 text-slate-400" />
                      {parentName}
                    </span>
                  </td>

                  {/* Discount % */}
                  <td className="py-4 px-4 font-extrabold text-slate-900 dark:text-white">
                    {cat.discountEnabled && (cat.discountPercentage || 0) > 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5" />
                        {cat.discountPercentage}% OFF
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">None</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                        cat.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200'
                      }`}
                    >
                      {cat.status || 'ACTIVE'}
                    </span>
                  </td>

                  {/* Homepage Badge */}
                  <td className="py-4 px-4">
                    {cat.showOnHomepage ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-md border border-amber-200">
                        <Home className="w-3 h-3 fill-amber-400" /> Homepage
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">No</span>
                    )}
                  </td>

                  {/* Sort Order */}
                  <td className="py-4 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {cat.sortOrder ?? 0}
                  </td>

                  {/* Created Date */}
                  <td className="py-4 px-4 text-slate-500 font-medium">
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onViewDetails(cat)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                        title="View category details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(cat)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 transition cursor-pointer"
                        title="Edit category"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(cat)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryTable;
