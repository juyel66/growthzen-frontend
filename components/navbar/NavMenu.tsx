'use client';

import React from 'react';
import NavItem from './NavItem';
import CategoryDropdown from './CategoryDropdown';

export const NavMenu = () => {
  return (
    <nav className="hidden md:flex items-center gap-1.5" aria-label="Primary navigation menu">
      <NavItem href="/" label="Home" />
      <NavItem href="/shop" label="Shop" />
      <CategoryDropdown />
      <NavItem href="/best-sellers" label="Best Sellers" />
      <NavItem href="/offers" label="Offers" />
      <NavItem href="/about" label="About" />
      <NavItem href="/contact" label="Contact" />
    </nav>
  );
};
export default NavMenu;

