import type { CategoryDef } from './types';

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'gaming',
    label: 'Gaming',
    icon: 'Gamepad2',
    subCategories: ['All', 'Mouse', 'Monitors', 'Storage', 'Chair', 'Video Games', 'Bluetooth Devices'],
  },
  {
    id: 'gadgets',
    label: 'Gadgets',
    icon: 'Smartphone',
    subCategories: ['All', 'Smart Gadgets', 'Kitchen Accessories', 'Dining', 'Room Accessories', 'Tech Tools'],
  },
  {
    id: 'fashion',
    label: 'Fashion & Lifestyle',
    icon: 'ShoppingBag',
    subCategories: ['All', 'Women Makeup', 'Skin Care', 'Women Undergarments', 'Hair Products', 'Home Decor', 'Women Dresses', 'Men Dresses', 'Kids Dresses', 'Shoes', 'Bags', 'Jewelry', 'Hats'],
  },
  {
    id: 'books',
    label: 'Stationery & Books',
    icon: 'BookOpen',
    subCategories: ['All', 'Novels', '1 to 10 Books', 'History Books', 'Games Book', 'Story Books'],
  },
  {
    id: 'fitness',
    label: 'Fitness',
    icon: 'Dumbbell',
    subCategories: ['All', 'Weights', 'Machines', 'Supplements', 'Tracking Device', 'Water Bottles', 'Home Workout'],
  },
];

export const SUB_CATEGORY_MAP: Record<string, string[]> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.id]: c.subCategories }),
  {}
);
