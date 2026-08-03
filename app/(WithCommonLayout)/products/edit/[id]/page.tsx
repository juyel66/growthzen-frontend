'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/components/admin/product/ProductForm';
import { RoleGuard } from '@/components/auth/AuthGuards';

export default function DirectEditProductPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

  return (
    <RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN', 'seller', 'reseller']}>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <ProductForm productId={id} />
      </div>
    </RoleGuard>
  );
}
