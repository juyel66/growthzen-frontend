import React from 'react';
import HeroBanner from '@/components/banner/HeroBanner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Container from '@/components/navbar/Container';

const Page = () => {
  return (
    <div className="w-full flex flex-col gap-10">
      {/* Premium Hero Banner */}
      <HeroBanner />
      
      {/* Secondary content for homepage demo */}
      <Container className="py-12 flex flex-col items-center gap-4 text-center">
        <h3 className="text-2xl font-bold text-slate-800">Ready for Backend Integration</h3>
        <p className="text-slate-500 max-w-md text-sm leading-relaxed">
          The core foundations (Redux, RTK Query, Theme settings, Responsive mega-menu Navbar, and Swiper Banner) are fully integrated.
        </p>
        <Link href="/user-dashboard/dashboard" passHref>
          <Button variant="primary" size="medium" className="cursor-pointer">
            Go to Dashboard
          </Button>
        </Link>
      </Container>
    </div>
  );
};

export default Page;