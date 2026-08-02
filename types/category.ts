export interface ParentCategoryInfo {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentCategoryId?: string | null;
  parentCategory?: ParentCategoryInfo | Category | null;
  parent?: ParentCategoryInfo | Category | null;
  discountPercentage?: number;
  discountEnabled?: boolean;
  sortOrder?: number;
  showOnHomepage?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
  metaTitle?: string | null;
  metaDescription?: string | null;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
  parentCategoryId?: string | null;
  discountPercentage?: number;
  discountEnabled?: boolean;
  sortOrder?: number;
  showOnHomepage?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
  parentCategoryId?: string | null;
  discountPercentage?: number;
  discountEnabled?: boolean;
  sortOrder?: number;
  showOnHomepage?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  sortBy?: 'name' | 'createdAt' | 'sortOrder' | 'discountPercentage';
  sortOrder?: 'asc' | 'desc';
}
