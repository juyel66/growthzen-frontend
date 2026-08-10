'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, Keyboard } from 'swiper/modules';
import SwiperClass from 'swiper';
import { useTheme } from '@/hooks/useTheme';
import { useBackground } from '@/hooks/useBackground';
import { dummyBanners } from '@/constants/dummyBanners';
import { useGetBannersQuery } from '@/services/settingsApi';
import { BannerItem } from '@/types/settings';
import Container from '../navbar/Container';
import BannerSlide from './BannerSlide';
import BannerNavigation from './BannerNavigation';
import BannerPagination from './BannerPagination';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HeroSkeleton = () => {
  const background = useBackground();
  return (
    <section
      className="w-full relative transition-colors duration-500 overflow-hidden"
      style={{ backgroundColor: background.heroBackground }}
    >
      <Container className="py-4 sm:py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center animate-pulse">
          <div className="order-2 md:order-1 md:col-span-6 flex flex-col justify-center space-y-4">
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-32" />
            <div className="h-10 sm:h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl w-4/5" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/2" />
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full max-w-sm" />
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-36" />
          </div>
          <div className="order-1 md:order-2 md:col-span-6 w-full">
            <div className="w-full h-[280px] sm:h-[380px] md:h-[450px] bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        </div>
      </Container>
    </section>
  );
};

export const HeroBanner: React.FC = () => {
  const theme = useTheme();
  const background = useBackground();
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  const { data: rawBanners, isLoading, isError, error } = useGetBannersQuery();

  // Log API errors only in development environment
  useEffect(() => {
    if (isError && process.env.NODE_ENV === 'development') {
      console.error('[HeroBanner] Failed to fetch homepage banners:', error);
    }
  }, [isError, error]);

  // Filter, sort, and fallback banner selection
  const banners = useMemo(() => {
    if (!rawBanners || !Array.isArray(rawBanners) || rawBanners.length === 0) {
      return dummyBanners;
    }

    const active = rawBanners
      .filter((b: BannerItem) => b && b.isActive !== false && !(b as any).isDeleted)
      .sort((a: BannerItem, b: BannerItem) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

    if (active.length === 0) {
      return dummyBanners;
    }

    return active;
  }, [rawBanners]);

  // Loading skeleton to eliminate Cumulative Layout Shift (CLS)
  if (isLoading) {
    return <HeroSkeleton />;
  }

  return (
    <section
      className="w-full relative transition-colors duration-500 overflow-hidden"
      style={{
        backgroundColor: background.heroBackground,
      }}
    >
      {/* Styles for dynamic pagination bullets matching primary theme color */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .swiper-pagination-custom .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background-color: #94a3b8;
          opacity: 0.4;
          border-radius: 9999px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          pointer-events: auto;
        }
        .swiper-pagination-custom .swiper-pagination-bullet-active {
          width: 22px;
          background-color: ${theme.primaryColor};
          opacity: 1;
        }
      `}} />

      <Container className="relative group/swiper">
        <div
          onMouseEnter={() => swiper?.autoplay?.stop()}
          onMouseLeave={() => swiper?.autoplay?.start()}
        >
          <Swiper
            onSwiper={setSwiper}
            modules={[Autoplay, Pagination, Navigation, Keyboard]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={banners.length > 1}
            keyboard={{
              enabled: true,
            }}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            pagination={{
              el: '.swiper-pagination-custom',
              clickable: true,
            }}
            spaceBetween={50}
            slidesPerView={1}
            className="w-full"
          >
            {banners.map((banner: any, index: number) => (
              <SwiperSlide key={banner.id || `banner-slide-${index}`}>
                <BannerSlide banner={banner} isFirstSlide={index === 0} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Custom Navigation Arrows (Shown on Hover when multiple slides exist) */}
        {banners.length > 1 && (
          <div className="opacity-0 group-hover/swiper:opacity-100 transition-opacity duration-300 hidden md:block">
            <BannerNavigation />
          </div>
        )}

        {/* Custom Pagination Bullets */}
        {banners.length > 1 && <BannerPagination />}
      </Container>
    </section>
  );
};
export default HeroBanner;
