import { Category } from './category';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  sku: string;
  quantity: number;
  images: string[];
  category: Category;
  categoryId: string;
  isFeatured: boolean;
  isActive: boolean;
  ratingsAverage?: number;
  ratingsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
}
