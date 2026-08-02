export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories?: Subcategory[];
}

export const dummyCategories: Category[] = [
  {
    id: 'cat-fashion',
    name: 'Fashion',
    slug: 'fashion',
    subcategories: [
      { id: 'sub-men', name: "Men's Clothing", slug: 'mens-clothing' },
      { id: 'sub-women', name: "Women's Clothing", slug: 'womens-clothing' },
      { id: 'sub-shoes', name: 'Shoes & Footwear', slug: 'shoes-footwear' },
      { id: 'sub-acc', name: 'Accessories', slug: 'accessories' },
    ],
  },
  {
    id: 'cat-electronics',
    name: 'Electronics',
    slug: 'electronics',
    subcategories: [
      { id: 'sub-phones', name: 'Phones & Tablets', slug: 'phones-tablets' },
      { id: 'sub-laptops', name: 'Laptops & Computers', slug: 'laptops-computers' },
      { id: 'sub-audio', name: 'Audio & Speakers', slug: 'audio-speakers' },
      { id: 'sub-smart', name: 'Smart Home Devices', slug: 'smart-home-devices' },
    ],
  },
  {
    id: 'cat-beauty',
    name: 'Beauty',
    slug: 'beauty',
    subcategories: [
      { id: 'sub-skin', name: 'Skincare', slug: 'skincare' },
      { id: 'sub-makeup', name: 'Makeup', slug: 'makeup' },
      { id: 'sub-hair', name: 'Haircare', slug: 'haircare' },
      { id: 'sub-fragrance', name: 'Fragrances', slug: 'fragrances' },
    ],
  },
  {
    id: 'cat-sports',
    name: 'Sports',
    slug: 'sports',
    subcategories: [
      { id: 'sub-fitness', name: 'Fitness Equipment', slug: 'fitness-equipment' },
      { id: 'sub-wear', name: 'Athletic Wear', slug: 'athletic-wear' },
      { id: 'sub-outdoor', name: 'Outdoor Recreation', slug: 'outdoor-recreation' },
    ],
  },
  {
    id: 'cat-books',
    name: 'Books',
    slug: 'books',
    subcategories: [
      { id: 'sub-fiction', name: 'Fiction', slug: 'fiction' },
      { id: 'sub-nonfiction', name: 'Non-Fiction', slug: 'non-fiction' },
      { id: 'sub-scifi', name: 'Sci-Fi & Fantasy', slug: 'sci-fi-fantasy' },
      { id: 'sub-selfhelp', name: 'Self-Help & Business', slug: 'self-help-business' },
    ],
  },
];
export default dummyCategories;
