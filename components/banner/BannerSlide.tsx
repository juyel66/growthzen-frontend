'use client';

import React from 'react';
import { Banner } from '@/constants/dummyBanners';
import BannerContent from './BannerContent';
import BannerImage from './BannerImage';

interface BannerSlideProps {
  banner: Banner;
}

export const BannerSlide: React.FC<BannerSlideProps> = ({ banner }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center py-4 sm:py-8 md:py-12">
      {/* Mobile: Image on top (order-1), Text below (order-2). Desktop: Text Left, Image Right. */}
      <div className="order-2 md:order-1 md:col-span-6 flex items-center justify-start">
        <BannerContent
          title={banner.title}
          subtitle={banner.subtitle}
          description={banner.description}
          buttonText={banner.buttonText}
          buttonUrl={banner.buttonUrl}
          badgeText={banner.badgeText}
        />
      </div>

      <div className="order-1 md:order-2 md:col-span-6 w-full">
        <BannerImage src={banner.image} alt={banner.title} />
      </div>
    </div>
  );
};
export default BannerSlide;
