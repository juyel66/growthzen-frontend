export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonUrl: string;
  badgeText?: string;
}

export const dummyBanners: Banner[] = [
  {
    id: 'banner-1',
    title: 'Premium Fashion Collection',
    subtitle: 'Discover the latest trends.',
    description: 'Elevate your daily wear with our handpicked premium garments. Enjoy flat 30% off across all items this season.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
    buttonText: 'Shop Now',
    buttonUrl: '/shop/fashion',
    badgeText: 'New Collection',
  },
  {
    id: 'banner-2',
    title: 'New Arrivals',
    subtitle: 'Fresh styles for every season.',
    description: 'Introducing our latest product additions. Experience the perfect blend of aesthetic design and top-tier quality.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    buttonText: 'Explore',
    buttonUrl: '/shop/new-arrivals',
    badgeText: 'Trending Now',
  },
  {
    id: 'banner-3',
    title: 'Mega Sale',
    subtitle: 'Save up to 50% today.',
    description: 'Do not miss out on our biggest sale of the year. Quality tech, beauty, and apparel items at half price for 48 hours.',
    image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1200&auto=format&fit=crop',
    buttonText: 'View Offers',
    buttonUrl: '/offers',
    badgeText: 'Limited Offer',
  },
  {
    id: 'banner-4',
    title: 'Best Sellers',
    subtitle: 'Customer favorite products.',
    description: 'Find out why thousands of shoppers love these curated best-selling items. Highly-rated essentials with fast shipping.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
    buttonText: 'Browse Now',
    buttonUrl: '/shop/best-sellers',
    badgeText: 'Top Rated',
  },
];
export default dummyBanners;
