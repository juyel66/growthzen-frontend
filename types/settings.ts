export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  [key: string]: any;
}

export interface PaymentSettings {
  stripeEnabled?: boolean;
  paypalEnabled?: boolean;
  codEnabled?: boolean;
  [key: string]: any;
}

export interface GeneralSettings {
  siteName?: string;
  storeName?: string;
  storeEmail?: string;
  supportEmail?: string;
  supportPhone?: string;
  businessAddress?: string;
  currency?: string;
  currencySymbol?: string;
  timezone?: string;
  taxRate?: number;
  defaultShipping?: number;
  orderPrefix?: string;
  invoicePrefix?: string;
  logo?: string;
  favicon?: string;
  [key: string]: any;
}

export interface SystemFeatures {
  maintenanceMode?: boolean;
  autoApproveReviews?: boolean;
  allowGuestCheckout?: boolean;
  enableCoupons?: boolean;
  enableWishlist?: boolean;
  enableReviews?: boolean;
  lowStockThreshold?: number;
  [key: string]: any;
}

export interface Settings {
  id?: string;
  general?: GeneralSettings;
  theme?: ThemeSettings;
  payment?: PaymentSettings;
  features?: SystemFeatures;
  smtp?: Record<string, any>;
  updatedAt?: string;
  [key: string]: any;
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonLink?: string;
  displayOrder?: number;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBannerInput {
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  buttonText?: string;
  buttonUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateBannerInput extends Partial<CreateBannerInput> {}

export interface CategoryDiscountItem {
  categoryId: string;
  categoryName?: string;
  categoryImage?: string;
  discountPercentage: number;
  isDiscountEnabled: boolean;
  updatedAt?: string;
  category?: {
    id?: string;
    name?: string;
    image?: string;
    thumbnail?: string;
  };
}

export interface UpdateCategoryDiscountInput {
  discountPercentage: number;
  isDiscountEnabled: boolean;
}
