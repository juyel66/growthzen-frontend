'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface BannerImageProps {
  src: string;
  alt: string;
}

export const BannerImage: React.FC<BannerImageProps> = ({ src, alt }) => {
  return (
    <div className="relative w-full h-[280px] sm:h-[380px] md:h-[450px] rounded-2xl overflow-hidden shadow-md group">
      {/* Dynamic gradient overlay to ensure image blends elegantly in card */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="w-full h-full relative"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </motion.div>
    </div>
  );
};
export default BannerImage;
