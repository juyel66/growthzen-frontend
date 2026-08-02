'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Heart, ShoppingBag, User, ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { dummyCategories } from '@/constants/dummyCategories';
import SearchBox from './SearchBox';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const theme = useTheme();
  const pathname = usePathname();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/best-sellers', label: 'Best Sellers' },
    { href: '/offers', label: 'Offers' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 left-0 w-full max-w-[300px] bg-white z-50 shadow-2xl flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.borderColor }}>
              <span className="font-bold text-lg tracking-tight" style={{ color: theme.textColor }}>
                GrowthZen Trends
              </span>
              <button
                onClick={onClose}
                aria-label="Close navigation menu"
                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors outline-none cursor-pointer flex items-center justify-center"
                style={{ color: theme.textColor }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Search Bar */}
              <SearchBox onSearch={() => onClose()} className="w-full" />

              {/* Grid actions */}
              <div className="grid grid-cols-3 gap-2">
                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="flex flex-col items-center justify-center p-3 border rounded-xl hover:bg-slate-50 transition-colors"
                  style={{ borderColor: theme.borderColor }}
                >
                  <Heart className="w-5 h-5 mb-1" style={{ color: theme.textColor }} />
                  <span className="text-[10px] font-medium text-slate-500">Wishlist (3)</span>
                </Link>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="flex flex-col items-center justify-center p-3 border rounded-xl hover:bg-slate-50 transition-colors"
                  style={{ borderColor: theme.borderColor }}
                >
                  <ShoppingBag className="w-5 h-5 mb-1" style={{ color: theme.textColor }} />
                  <span className="text-[10px] font-medium text-slate-500">Cart (5)</span>
                </Link>
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex flex-col items-center justify-center p-3 border rounded-xl hover:bg-slate-50 transition-colors"
                  style={{ borderColor: theme.borderColor }}
                >
                  <User className="w-5 h-5 mb-1" style={{ color: theme.textColor }} />
                  <span className="text-[10px] font-medium text-slate-500">Account</span>
                </Link>
              </div>

              {/* Navigation Menu */}
              <nav className="flex flex-col space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1 block">
                  Menu
                </span>
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="py-2.5 px-3 rounded-lg text-sm font-medium transition-colors block"
                      style={{
                        backgroundColor: isActive ? `${theme.primaryColor}10` : 'transparent',
                        color: isActive ? theme.primaryColor : theme.textColor,
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Categories Collapsible */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1 block">
                  Categories
                </span>
                {dummyCategories.map((category) => {
                  const isExpanded = expandedCategory === category.id;
                  return (
                    <div key={category.id} className="border-b border-slate-50">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-50 transition-colors text-left outline-none cursor-pointer"
                      >
                        <span className="text-sm font-medium" style={{ color: theme.textColor }}>
                          {category.name}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="overflow-hidden bg-slate-50/50 rounded-lg pl-3 pr-2 ml-1 space-y-1 py-1.5"
                          >
                            {category.subcategories?.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/categories/${category.slug}/${sub.slug}`}
                                onClick={onClose}
                                className="block py-1.5 px-2.5 text-xs text-slate-600 hover:text-slate-900 transition-colors hover:bg-slate-100/50 rounded-sm"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-slate-50 flex items-center gap-2 text-xs text-slate-500 justify-center" style={{ borderColor: theme.borderColor }}>
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Support: +1 234 567 890</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default MobileMenu;
