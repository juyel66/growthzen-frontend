import { Product } from './product';

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}
