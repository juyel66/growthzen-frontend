'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, Keyboard } from 'swiper/modules';
import SwiperClass from 'swiper';
import { useTheme } from '@/hooks/useTheme';
import { useBackground } from '@/hooks/useBackground';
import { dummyBanners } from '@/constants/dummyBanners';
import Container from '../navbar/Container';
import BannerSlide from './BannerSlide';
import BannerNavigation from './BannerNavigation';
import BannerPagination from './BannerPagination';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export const HeroBanner = () => {
  const theme = useTheme();
  const background = useBackground();
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  // Read from dummyBanners. Later can swap out with settings API.
  const banners = dummyBanners;

  return (
    <section
      className="w-full relative transition-colors duration-500 overflow-hidden"
      style={{
        backgroundColor: background.heroBackground,
      }}
    >
      {/* Styles for dynamic pagination bullets matching primary theme color */}
      <style dangerouslySetInnerHTML={{ __html: `
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
          onMouseEnter={() => swiper?.autoplay.stop()}
          onMouseLeave={() => swiper?.autoplay.start()}
        >
          <Swiper
            onSwiper={setSwiper}
            modules={[Autoplay, Pagination, Navigation, Keyboard]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
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
            {banners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <BannerSlide banner={banner} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Custom Navigation Arrows (Shown on Hover) */}
        <div className="opacity-0 group-hover/swiper:opacity-100 transition-opacity duration-300 hidden md:block">
          <BannerNavigation />
        </div>

        {/* Custom Pagination Bullets */}
        <BannerPagination />
      </Container>
    </section>
  );
};
export default HeroBanner;
