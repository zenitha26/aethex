export interface ProductVariant {
  id: string;
  title: string;
  color?: string;
  image_url?: string;
}

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  description?: string;
  price: number;
  original_price?: number | null;
  currency?: string;
  image_url?: string;
  gallery?: string[];
  features?: { title: string; desc: string }[];
  specs?: Record<string, string>;
  source?: string;
  external_id?: string;
  product_url?: string;
  stock?: number;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  isTopDeal?: boolean;
  isFastMoving?: boolean;
  variant_id?: string;
  variants?: ProductVariant[];
}

