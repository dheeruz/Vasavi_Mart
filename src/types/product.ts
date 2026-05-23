export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  description: string;
  rating?: number;
  reviews?: number;
  stock?: number;
  inStock: boolean;
  unit: string;
  discount?: number;
  isOrganic?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
}
