'use client';

import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import StorefrontFooter from '@/components/footer/StorefrontFooter';
import NotFoundContent from '@/components/common/NotFoundContent';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <NotFoundContent />
      </main>
      <StorefrontFooter />
    </div>
  );
}
