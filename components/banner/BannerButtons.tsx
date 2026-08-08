'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface BannerButtonsProps {
  primaryText: string;
  primaryUrl: string;
  secondaryText?: string;
  secondaryUrl?: string;
}

export const BannerButtons: React.FC<BannerButtonsProps> = ({
  primaryText,
  primaryUrl,
  secondaryText = 'Learn More',
  secondaryUrl = '/about',
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3.5 mt-2 justify-start w-full">
      <Link href={primaryUrl} passHref>
        <Button variant="primary" size="large" className="px-8 font-semibold shadow-sm cursor-pointer">
          {primaryText}
        </Button>
      </Link>
      <Link href={secondaryUrl} passHref>
        <Button variant="outline" size="large" className="px-8 font-semibold cursor-pointer">
          {secondaryText}
        </Button>
      </Link>
    </div>
  );
};
export default BannerButtons;

