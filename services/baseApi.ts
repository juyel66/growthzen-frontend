import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth',
    'Categories',
    'Products',
    'Cart',
    'Wishlist',
    'Checkout',
    'Orders',
    'Payments',
    'Shipping',
    'Coupons',
    'Dashboard',
    'Reports',
    'Settings',
    'Banners',
    'CategoryDiscounts',
    'Reviews',
    'Users',
    'ContactMessages',
  ],
  endpoints: () => ({}),
});
