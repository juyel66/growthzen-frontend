import { Product } from './product';

export interface WishlistItem {
  id: string; // Wishlist item ID
  product: Product;
  createdAt: string;
}

export interface Wishlist {
  id: string;
  items: WishlistItem[];
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}
