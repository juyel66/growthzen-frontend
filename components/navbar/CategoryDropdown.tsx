'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronDown, Sparkles, FolderTree, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useGetCategoriesQuery } from '@/services/categoryApi';
import { Category, SubCategoryInfo } from '@/types/category';

export const CategoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const { data: rawCategories = [], isLoading } = useGetCategoriesQuery();

  // Process and filter active backend categories
  const categoryTree = useMemo(() => {
    if (!Array.isArray(rawCategories) || rawCategories.length === 0) return [];

    const activeCategories = rawCategories.filter((cat) => cat.status !== 'INACTIVE');
    if (activeCategories.length === 0) return [];

    // Find parent categories
    const parents = activeCategories.filter(
      (cat) => !cat.parentCategoryId && !cat.parent && !cat.parentCategory
    );

    if (parents.length > 0) {
      return parents.map((parent) => {
        const subsFromArr = (parent.subCategories || parent.subcategories || []) as (SubCategoryInfo | Category)[];
        const childrenByParentId = activeCategories.filter(
          (c) =>
            c.parentCategoryId === parent.id ||
            (typeof c.parent === 'object' && c.parent?.id === parent.id) ||
            (typeof c.parentCategory === 'object' && c.parentCategory?.id === parent.id)
        );

        const subsMap = new Map<string, { id: string; name: string; slug: string }>();
        subsFromArr.forEach((s) => subsMap.set(s.id, { id: s.id, name: s.name, slug: s.slug }));
        childrenByParentId.forEach((c) => subsMap.set(c.id, { id: c.id, name: c.name, slug: c.slug }));

        return {
          id: parent.id,
          name: parent.name,
          slug: parent.slug,
          subcategoriesList: Array.from(subsMap.values()),
        };
      });
    }

    // Fallback if flat categories
    return activeCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      subcategoriesList: (cat.subCategories || cat.subcategories || []) as { id: string; name: string; slug: string }[],
    }));
  }, [rawCategories]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 py-2 px-3 text-sm font-medium transition-colors hover:opacity-80 outline-none select-none rounded-md cursor-pointer"
        style={{
          color: theme.textColor,
        }}
      >
        <span>Categories</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 mt-1 w-[620px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
            style={{
              borderColor: theme.borderColor,
            }}
          >
            <div className="p-6 flex flex-col gap-5">
              {isLoading ? (
                <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <span>Loading categories...</span>
                </div>
              ) : categoryTree.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                  <FolderTree className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                  <span>No categories available</span>
                  <Link
                    href="/shop"
                    onClick={() => setIsOpen(false)}
                    className="text-emerald-600 font-bold hover:underline mt-1"
                  >
                    Browse All Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6 max-h-[380px] overflow-y-auto pr-1">
                  {categoryTree.map((cat) => (
                    <div key={cat.id} className="space-y-2.5">
                      <Link
                        href={`/categories/${cat.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="font-bold text-sm text-slate-800 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors block leading-tight"
                      >
                        {cat.name}
                      </Link>
                      {cat.subcategoriesList.length > 0 && (
                        <ul className="space-y-1.5 border-l border-slate-100 dark:border-slate-800 pl-3 ml-0.5">
                          {cat.subcategoriesList.map((sub) => (
                            <li key={sub.id}>
                              <Link
                                href={`/categories/${sub.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="text-xs text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors block py-0.5 hover:underline"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Banner / All Categories Footer */}
              <div
                className="rounded-xl p-3.5 flex items-center justify-between mt-1 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Explore all categories in GrowthZen Store catalog
                  </span>
                </div>
                <Link
                  href="/categories"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0 flex items-center gap-1"
                >
                  View All Categories <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryDropdown;

