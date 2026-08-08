'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const BannerNavigation = () => {
  const theme = useTheme();

  return (
    <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
      <button
        id="hero-banner-prev"
        aria-label="Previous slide"
        className="swiper-button-prev-custom w-10 h-10 rounded-full bg-white/80 hover:bg-white border flex items-center justify-center pointer-events-auto transition-all shadow-md active:scale-95 outline-none cursor-pointer text-slate-700 hover:text-slate-900"
        style={{
          borderColor: theme.borderColor,
        }}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        id="hero-banner-next"
        aria-label="Next slide"
        className="swiper-button-next-custom w-10 h-10 rounded-full bg-white/80 hover:bg-white border flex items-center justify-center pointer-events-auto transition-all shadow-md active:scale-95 outline-none cursor-pointer text-slate-700 hover:text-slate-900"
        style={{
          borderColor: theme.borderColor,
        }}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
export default BannerNavigation;

