'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatImageUrl } from '@/utils/imageUrl';

interface BannerImageProps {
  src: string;
  alt: string;
}

export const BannerImage: React.FC<BannerImageProps> = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);
  const formattedUrl = formatImageUrl(src);

  // Fallback image if source is empty or fails to load
  const finalSrc = hasError || !formattedUrl
    ? 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop'
    : formattedUrl;

  const imageAlt = alt && alt.trim().length > 0 ? alt : 'Hero Store Banner';

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
          src={finalSrc}
          alt={imageAlt}
          fill
          priority
          unoptimized={finalSrc.startsWith('http://localhost') || finalSrc.startsWith('http://127.0.0.1')}
          onError={() => setHasError(true)}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </motion.div>
    </div>
  );
};

export default BannerImage;
