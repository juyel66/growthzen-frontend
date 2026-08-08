'use client';

import React from 'react';
import ProductForm from '@/components/admin/product/ProductForm';
import { RoleGuard } from '@/components/auth/AuthGuards';

export default function AddProductPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN', 'seller', 'reseller']}>
      <div className="p-4 sm:p-6 lg:p-8">
        <ProductForm />
      </div>
    </RoleGuard>
  );
}

