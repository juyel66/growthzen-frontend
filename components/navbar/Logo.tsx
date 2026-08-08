'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center shrink-0" aria-label="GrowthZen Trends Home">
      <div className="relative w-[150px] h-[38px] md:w-[180px] md:h-[45px]">
        <Image
          src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1785603633/ChatGPT_Image_Aug_1_2026_10_56_41_PM_1_vd6zar.png"
          alt="GrowthZen Trends Logo"
          fill
          priority
          sizes="(max-width: 768px) 150px, 180px"
          className="object-contain"
        />
      </div>
    </Link>
  );
};
export default Logo;

