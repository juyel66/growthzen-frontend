'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import { useGetProductsQuery, useDeleteProductMutation } from '@/services/productApi';
import { getProductTitle, getProductCategoryName, getProductMainImage, getProductDisplayPrice, getProductFinalPrice } from '@/types/product';
import { RoleGuard } from '@/components/auth/AuthGuards';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Trash2, Eye, Pencil, Package, Sparkles, Tag } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminProductsPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN', 'seller', 'reseller']}>
      <AdminProductsContent />
    </RoleGuard>
  );
}

function AdminProductsContent() {
  const { data: products, isLoading, isError, refetch } = useGetProductsQuery();
  const [deleteProductApi] = useDeleteProductMutation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id: string, title: string) => {
    const confirm = await Swal.fire({
      title: 'Delete Product?',
      text: `Are you sure you want to remove "${title}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
    });

    if (confirm.isConfirmed) {
      try {
        await deleteProductApi(id).unwrap();
        Swal.fire({
          icon: 'success',
          title: 'Product Deleted',
          text: `"${title}" has been removed from the catalog.`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Deletion Failed',
          text: error?.data?.message || 'Failed to delete product.',
        });
      }
    }
  };

  const filteredProducts = (products || []).filter((p) => {
    const titleStr = getProductTitle(p).toLowerCase();
    const categoryStr = getProductCategoryName(p).toLowerCase();
    const codeStr = (p.productCode || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return titleStr.includes(searchLower) || categoryStr.includes(searchLower) || codeStr.includes(searchLower);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Products Catalog
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage, edit, filter, and add new products to your store
          </p>
        </div>

        <Link href="/admin-dashboard/products/add">
          <Button variant="primary" size="md" className="font-bold cursor-pointer shadow-md hover:shadow-lg transition">
            <PlusCircle className="w-4 h-4 mr-2" /> Add New Product
          </Button>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, SKU, or category..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Showing {filteredProducts.length} products
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            Loading enterprise product catalog...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-xs text-rose-500 flex flex-col items-center gap-2">
            <span>Failed to load products list from backend server.</span>
            <button
              onClick={() => refetch()}
              className="font-bold underline text-slate-700 hover:text-slate-900"
            >
              Retry Loading
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <Package className="w-12 h-12 text-slate-300 dark:text-slate-700 stroke-[1.5]" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No products found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm">
              {searchTerm ? 'No products matching your search term.' : 'Get started by creating your first product.'}
            </p>
            <Link href="/admin-dashboard/products/add">
              <Button variant="primary" size="sm" className="mt-2 font-bold cursor-pointer">
                <PlusCircle className="w-4 h-4 mr-1.5" /> Add Product Now
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-4">SKU Code</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Sell Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProducts.map((p) => {
                  const title = getProductTitle(p);
                  const categoryName = getProductCategoryName(p);
                  const mainImg = getProductMainImage(p);
                  const price = getProductFinalPrice(p);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      {/* Title & Image */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/80 dark:border-slate-700 flex-shrink-0">
                            <SafeImage
                              src={mainImg}
                              alt={title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                              {title}
                            </span>
                            {p.isFeatured && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                                <Sparkles className="w-3 h-3 fill-amber-400" /> Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-4 px-4 font-mono font-medium text-slate-600 dark:text-slate-400">
                        {p.productCode || 'N/A'}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                          <Tag className="w-3 h-3 text-slate-400" />
                          {categoryName}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 font-extrabold text-slate-900 dark:text-white">
                        ৳{getProductDisplayPrice(p).toFixed(2)}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                            p.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200'
                              : p.status === 'DRAFT'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200'
                          }`}
                        >
                          {p.status || 'ACTIVE'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/products/${p.slug || p.id}`} target="_blank">
                            <button
                              type="button"
                              className="p-1.5 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                              title="View product in storefront"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>
                          <Link href={`/admin-dashboard/products/edit/${p.id}`}>
                            <button
                              type="button"
                              className="p-1.5 text-slate-400 hover:text-amber-600 transition cursor-pointer"
                              title="Edit product"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, title)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
