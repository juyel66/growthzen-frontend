'use client';

import React, { useState, useEffect } from 'react';
import Container from './Container';
import Logo from './Logo';
import SearchBox from './SearchBox';
import NavMenu from './NavMenu';
import WishlistButton from './WishlistButton';
import CartButton from './CartButton';
import ProfileMenu from './ProfileMenu';
import HamburgerButton from './HamburgerButton';
import MobileMenu from './MobileMenu';
import AnnouncementBar from './AnnouncementBar';
import { useTheme } from '@/hooks/useTheme';

export const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full z-40 relative">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Sticky Navigation Wrapper */}
      <div
        className={`sticky top-0 w-full transition-all duration-300 z-40 ${
          isScrolled
            ? 'shadow-lg backdrop-blur-md bg-white/95 border-b py-2'
            : 'bg-white border-b py-3'
        }`}
        style={{
          borderColor: theme.borderColor,
        }}
      >
        <Container className="flex flex-col gap-2.5">
          {/* Main Action Line */}
          <div className="flex items-center justify-between gap-4 w-full">
            {/* Left Section: Mobile Hamburger Trigger + Company Logo */}
            <div className="flex items-center gap-1.5 md:gap-0">
              <HamburgerButton isOpen={isDrawerOpen} onClick={() => setIsDrawerOpen(true)} />
              <Logo />
            </div>

            {/* Middle Section: Integrated Search (Hidden on Mobile) */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <SearchBox />
            </div>

            {/* Right Section: Action Controls (Wishlist, Cart, Profile Dropdown) */}
            <div className="flex items-center gap-1 sm:gap-2">
              <WishlistButton />
              <CartButton />
              <ProfileMenu />
            </div>
          </div>

          {/* Nav Categories and Link bar (Hidden on Mobile) */}
          <div className="hidden md:flex items-center justify-center pt-2 border-t" style={{ borderColor: theme.borderColor + '20' }}>
            <NavMenu />
          </div>
        </Container>
      </div>

      {/* Mobile Drawer Menu */}
      <MobileMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </header>
  );
};
export default Navbar;

