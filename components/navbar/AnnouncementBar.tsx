'use client';

import React from 'react';
import { Phone, Truck, CreditCard, Flame } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import Container from './Container';

export const AnnouncementBar = () => {
  const theme = useTheme();

  return (
    <div
      className="text-xs py-2 transition-colors duration-300 font-medium z-50 relative"
      style={{
        backgroundColor: theme.primaryColor,
        color: '#ffffff',
      }}
    >
      <Container className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-center sm:text-left">
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6">
          <span className="inline-flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 shrink-0" />
            <span>Free Shipping Nationwide</span>
          </span>
          <span className="h-3 w-[1px] bg-white/30 hidden sm:inline-block" />
          <span className="inline-flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 shrink-0" />
            <span>Cash On Delivery Available</span>
          </span>
          <span className="h-3 w-[1px] bg-white/30 hidden md:inline-block" />
          <span className="inline-flex items-center gap-1 hidden md:inline-flex">
            <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
            <span>Special Offers Active</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 justify-center mt-1 sm:mt-0">
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <span>Support: <a href="tel:+1234567890" className="hover:underline font-semibold">+1 234 567 890</a></span>
        </div>
      </Container>
    </div>
  );
};
export default AnnouncementBar;

