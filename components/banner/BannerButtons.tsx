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

const isExternalUrl = (url: string): boolean => {
  if (!url) return false;
  return /^https?:\/\//i.test(url.trim());
};

export const BannerButtons: React.FC<BannerButtonsProps> = ({
  primaryText,
  primaryUrl,
  secondaryText,
  secondaryUrl,
}) => {
  const pUrl = primaryUrl && primaryUrl.trim().length > 0 ? primaryUrl.trim() : '/shop';
  const pText = primaryText && primaryText.trim().length > 0 ? primaryText.trim() : 'Shop Now';

  const isPrimaryExternal = isExternalUrl(pUrl);

  let secondaryElement = null;
  if (secondaryText && secondaryUrl) {
    const isSecondaryExternal = isExternalUrl(secondaryUrl);
    if (isSecondaryExternal) {
      secondaryElement = (
        <a href={secondaryUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="large" className="px-8 font-semibold cursor-pointer">
            {secondaryText}
          </Button>
        </a>
      );
    } else {
      secondaryElement = (
        <Link href={secondaryUrl} passHref>
          <Button variant="outline" size="large" className="px-8 font-semibold cursor-pointer">
            {secondaryText}
          </Button>
        </Link>
      );
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3.5 mt-2 justify-start w-full mb-10">
      {/* Primary CTA Button */}
      {isPrimaryExternal ? (
        <a href={pUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="large" className="px-8 font-semibold shadow-sm cursor-pointer">
            {pText}
          </Button>
        </a>
      ) : (
        <Link href={pUrl} passHref>
          <Button variant="primary" size="large" className="px-8 font-semibold shadow-sm cursor-pointer">
            {pText}
          </Button>
        </Link>
      )}

      {/* Secondary Optional Button */}
      {secondaryElement}
    </div>
  );
};

export default BannerButtons;
