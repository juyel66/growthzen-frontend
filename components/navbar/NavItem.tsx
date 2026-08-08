'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';

interface NavItemProps {
  href: string;
  label: string;
  onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({ href, label, onClick }) => {
  const pathname = usePathname();
  const theme = useTheme();
  
  // Strict active comparison + subpath checks (except root)
  const isActive = pathname === href || (href !== '/' && pathname ? pathname.startsWith(href) : false);

  return (
    <Link
      href={href}
      onClick={onClick}
      className="relative py-2 px-3 text-sm font-medium transition-all hover:opacity-80 rounded-md outline-none block cursor-pointer"
      style={{
        color: isActive ? theme.primaryColor : theme.textColor,
      }}
    >
      <span>{label}</span>
      {isActive && (
        <span
          className="absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full animate-fade-in"
          style={{
            backgroundColor: theme.primaryColor,
          }}
        />
      )}
    </Link>
  );
};
export default NavItem;

