export interface Product {
  id: string;
  title: string;
  image: string;
  affiliateLink: string;
  category: string;
  subCategory: string;
  originalPrice: number;
  discountedPrice: number;
}

export interface CategoryDef {
  id: string;
  label: string;
  icon: string;
  subCategories: string[];
}
