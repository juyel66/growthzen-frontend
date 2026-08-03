'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { formatImageUrl } from '@/types/product';

export interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined;
  fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = '/placeholder-product.png',
  alt = 'Image',
  className = '',
  unoptimized,
  onError,
  ...props
}) => {
  const formattedInitial = formatImageUrl(src, fallbackSrc);
  const [imgSrc, setImgSrc] = useState<string>(formattedInitial);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const updated = formatImageUrl(src, fallbackSrc);
    setImgSrc(updated);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
    if (onError) {
      onError(e);
    }
  };

  const isUnoptimized =
    unoptimized !== undefined
      ? unoptimized
      : typeof imgSrc === 'string' &&
        (imgSrc.startsWith('blob:') ||
          imgSrc.startsWith('data:') ||
          (imgSrc.startsWith('http') && !imgSrc.includes('cloudinary') && !imgSrc.includes('unsplash')));

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      unoptimized={isUnoptimized}
    />
  );
};

export default SafeImage;
