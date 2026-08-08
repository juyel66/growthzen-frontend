'use client';

import React, { useState } from 'react';
import { useGetCategoriesQuery, useDeleteCategoryMutation } from '@/services/categoryApi';
import { Category } from '@/types/category';
import { RoleGuard } from '@/components/auth/AuthGuards';
import { Button } from '@/components/ui/button';
import CategorySearch from '@/components/admin/category/CategorySearch';
import CategoryFilters from '@/components/admin/category/CategoryFilters';
import CategoryTable from '@/components/admin/category/CategoryTable';
import CategoryModal from '@/components/admin/category/CategoryModal';
import CategoryDetailsDrawer from '@/components/admin/category/CategoryDetailsDrawer';
import { FolderTree, PlusCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminCategoriesPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN', 'seller', 'reseller']}>
      <AdminCategoriesContent />
    </RoleGuard>
  );
}

function AdminCategoriesContent() {
  const { data: categories, isLoading, isError, refetch } = useGetCategoriesQuery();
  const [deleteCategoryApi] = useDeleteCategoryMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [homepageFilter, setHomepageFilter] = useState('ALL');

  // Modal & Drawer States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleViewDetails = (cat: Category) => {
    setViewingCategory(cat);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (cat: Category) => {
    const confirm = await Swal.fire({
      title: 'Delete Category?',
      text: `Are you sure you want to delete "${cat.name}"? If products exist under this category, delete may fail.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
    });

    if (confirm.isConfirmed) {
      try {
        await deleteCategoryApi(cat.id).unwrap();
        Swal.fire({
          icon: 'success',
          title: 'Category Deleted',
          text: `"${cat.name}" has been deleted successfully.`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Cannot Delete Category',
          text:
            error?.data?.message ||
            'Failed to delete category. Ensure no products are currently associated with it.',
        });
      }
    }
  };

  // Client Filter Logic
  const filteredCategories = (categories || []).filter((cat) => {
    const nameMatch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const slugMatch = cat.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const searchMatch = nameMatch || slugMatch;

    const statusMatch = statusFilter === 'ALL' || cat.status === statusFilter;

    let homepageMatch = true;
    if (homepageFilter === 'YES') homepageMatch = Boolean(cat.showOnHomepage);
    if (homepageFilter === 'NO') homepageMatch = !cat.showOnHomepage;

    return searchMatch && statusMatch && homepageMatch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <FolderTree className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Category Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage product categories, subcategory hierarchies, banners, and default discounts
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreateModal}
          className="font-bold cursor-pointer shadow-md hover:shadow-lg transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Create Category
        </Button>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <CategorySearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <CategoryFilters
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          homepageFilter={homepageFilter}
          onHomepageChange={setHomepageFilter}
          onReset={() => {
            setSearchTerm('');
            setStatusFilter('ALL');
            setHomepageFilter('ALL');
          }}
        />
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <CategoryTable
          categories={filteredCategories}
          isLoading={isLoading}
          isError={isError}
          onRefetch={refetch}
          onViewDetails={handleViewDetails}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      </div>

      {/* Create / Edit Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialCategory={editingCategory}
      />

      {/* Category Details Drawer */}
      <CategoryDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        category={viewingCategory}
        onEdit={handleOpenEditModal}
      />
    </div>
  );
}

