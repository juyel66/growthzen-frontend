import React from 'react';
import HeroBanner from '@/components/banner/HeroBanner';
import FeaturedProductsSection from '@/components/product/FeaturedProductsSection';

const Page = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Hero Banner */}
      <HeroBanner />
      
      {/* Featured Products Section */}
      <FeaturedProductsSection />
    </div>
  );
};

export default Page;
