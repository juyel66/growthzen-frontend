'use client';

import React from 'react';
import { useTheme } from '@/hooks/useTheme';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  ariaLabel?: string;
}

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  isOpen,
  onClick,
  ariaLabel = 'Toggle navigation menu',
}) => {
  const theme = useTheme();

  return (
    <button
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label={ariaLabel}
      className="flex flex-col justify-center items-center w-9 h-9 rounded-md transition-all hover:bg-slate-100/80 outline-none relative cursor-pointer md:hidden"
    >
      <div className="flex flex-col justify-between w-5 h-3.5">
        <span
          className={`h-0.5 w-full rounded-sm transition-all duration-300 transform origin-left ${
            isOpen ? 'rotate-45 translate-x-[2px]' : ''
          }`}
          style={{ backgroundColor: theme.textColor }}
        />
        <span
          className={`h-0.5 w-full rounded-sm transition-all duration-300 ${
            isOpen ? 'opacity-0 scale-0' : 'opacity-100'
          }`}
          style={{ backgroundColor: theme.textColor }}
        />
        <span
          className={`h-0.5 w-full rounded-sm transition-all duration-300 transform origin-left ${
            isOpen ? '-rotate-45 translate-x-[2px]' : ''
          }`}
          style={{ backgroundColor: theme.textColor }}
        />
      </div>
    </button>
  );
};
export default HamburgerButton;
