'use client';

import React from 'react';
import BannerContent from './BannerContent';
import BannerImage from './BannerImage';
import { BannerItem } from '@/types/settings';
import { Banner } from '@/constants/dummyBanners';

export interface BannerSlideProps {
  banner: BannerItem | Banner;
  isFirstSlide?: boolean;
}

export const BannerSlide: React.FC<BannerSlideProps> = ({ banner, isFirstSlide = false }) => {
  const title = banner.title || 'Welcome to GrowthZen';
  const subtitle = banner.subtitle || '';
  const description = (banner as any).description || '';
  const buttonText = banner.buttonText || 'Shop Now';
  const buttonUrl = banner.buttonUrl || (banner as any).buttonLink || '/shop';
  const badgeText = (banner as any).badgeText || (subtitle && subtitle.length < 35 ? subtitle : undefined);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center py-4 sm:py-8 md:py-10">
      {/* Mobile: Image on top (order-1), Text below (order-2). Desktop: Text Left, Image Right. */}
      <div className="order-2 md:order-1 md:col-span-6 flex items-center justify-start">
        <BannerContent
          title={title}
          subtitle={subtitle}
          description={description}
          buttonText={buttonText}
          buttonUrl={buttonUrl}
          badgeText={badgeText}
          isFirstSlide={isFirstSlide}
        />
      </div>

      <div className="order-1 md:order-2 md:col-span-6 w-full">
        <BannerImage src={banner.image || ''} alt={title} />
      </div>
    </div>
  );
};

export default BannerSlide;
