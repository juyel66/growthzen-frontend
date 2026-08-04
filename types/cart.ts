import { Product } from './product';

export interface CartItem {
  id: string; // Cart item ID
  cartId?: string;
  productId?: string;
  quantity: number;
  unitPrice: number;
  unitDiscount?: number;
  lineSubtotal?: number;
  lineDiscount?: number;
  lineTotal?: number;
  totalPrice?: number;
  price?: number;
  size?: string | null;
  product: Product;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartSummary {
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
  discount: number;
  grandTotal: number;
  tax?: number;
  shipping?: number;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  summary?: CartSummary;
  totalQuantity?: number;
  totalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddCartItemInput {
  productId: string;
  quantity?: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}
