'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { dummyCategories } from '@/constants/dummyCategories';

export const CategoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        aria-haspopup="true"
        aria-expanded={isOpen}
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
            className="absolute left-0 mt-1 w-[600px] bg-white border rounded-xl shadow-xl z-50 overflow-hidden"
            style={{
              borderColor: theme.borderColor,
            }}
          >
            <div className="grid grid-cols-3 gap-6 p-6">
              {dummyCategories.slice(0, 3).map((category) => (
                <div key={category.id} className="space-y-3">
                  <Link
                    href={`/categories/${category.slug}`}
                    className="font-bold text-sm hover:underline block"
                    style={{
                      color: theme.textColor,
                    }}
                  >
                    {category.name}
                  </Link>
                  <ul className="space-y-1.5 border-l pl-3 ml-0.5" style={{ borderColor: theme.borderColor }}>
                    {category.subcategories?.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={`/categories/${category.slug}/${sub.slug}`}
                          className="text-xs text-slate-500 hover:text-slate-900 transition-colors block py-0.5 hover:underline"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="col-span-3 grid grid-cols-2 gap-6 pt-3 border-t" style={{ borderColor: theme.borderColor }}>
                {dummyCategories.slice(3).map((category) => (
                  <div key={category.id} className="space-y-3">
                    <Link
                      href={`/categories/${category.slug}`}
                      className="font-bold text-sm hover:underline block"
                      style={{
                        color: theme.textColor,
                      }}
                    >
                      {category.name}
                    </Link>
                    <ul className="space-y-1.5 border-l pl-3 ml-0.5" style={{ borderColor: theme.borderColor }}>
                      {category.subcategories?.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            href={`/categories/${category.slug}/${sub.slug}`}
                            className="text-xs text-slate-500 hover:text-slate-900 transition-colors block py-0.5 hover:underline"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Promo Banner inside dropdown */}
              <div
                className="col-span-3 rounded-lg p-3.5 flex items-center justify-between mt-2"
                style={{
                  backgroundColor: `${theme.primaryColor}10`, // 10% opacity primary color
                  border: `1px dashed ${theme.primaryColor}`,
                }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0" style={{ color: theme.primaryColor }} />
                  <span className="text-xs font-semibold" style={{ color: theme.textColor }}>
                    New Arrivals: Trending Electronics & Fashion!
                  </span>
                </div>
                <Link
                  href="/shop"
                  className="text-xs font-bold hover:underline shrink-0"
                  style={{ color: theme.primaryColor }}
                >
                  Shop Now &rarr;
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

