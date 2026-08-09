import React from 'react';
import HeroBanner from '@/components/banner/HeroBanner';
import FeaturedProductsSection from '@/components/product/FeaturedProductsSection';
import BestSellersHomeSection from '@/components/product/BestSellersHomeSection';
import OffersHomeSection from '@/components/product/OffersHomeSection';

const Page = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Hero Banner */}
      <HeroBanner />
      
      {/* Featured Products Section */}
      <FeaturedProductsSection />

      {/* Best Sellers Section */}
      <BestSellersHomeSection />

      {/* Offers & Deals Section */}
      <OffersHomeSection />
    </div>
  );
};

export default Page;
