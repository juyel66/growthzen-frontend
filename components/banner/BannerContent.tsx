'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import BannerButtons from './BannerButtons';

interface BannerContentProps {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  badgeText?: string;
}

export const BannerContent: React.FC<BannerContentProps> = ({
  title,
  subtitle,
  description,
  buttonText,
  buttonUrl,
  badgeText,
}) => {
  const theme = useTheme();

  // Staggered transitions variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col justify-center items-start space-y-4 max-w-xl text-left"
    >
      {badgeText && (
        <motion.span
          variants={itemVariants}
          className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest px-3.5 py-1 rounded-full select-none"
          style={{
            backgroundColor: `${theme.primaryColor}15`,
            color: theme.primaryColor,
          }}
        >
          {badgeText}
        </motion.span>
      )}

      <motion.h2
        variants={itemVariants}
        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-slate-900"
      >
        {title}
      </motion.h2>

      <motion.p
        variants={itemVariants}
        className="text-base sm:text-lg font-semibold"
        style={{ color: theme.primaryColor }}
      >
        {subtitle}
      </motion.p>

      <motion.p
        variants={itemVariants}
        className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md"
      >
        {description}
      </motion.p>

      <motion.div variants={itemVariants} className="w-full">
        <BannerButtons
          primaryText={buttonText}
          primaryUrl={buttonUrl}
          secondaryText="Explore Collection"
          secondaryUrl="/shop"
        />
      </motion.div>
    </motion.div>
  );
};
export default BannerContent;
