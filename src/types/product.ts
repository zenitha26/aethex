export interface ProductVariant {
  id: string;
  title: string;
  color?: string;
  image_url?: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  original_price?: number | null;
  image_url?: string;
  source?: string;
  external_id?: string;
  product_url?: string;
  stock?: number;
  variant_id?: string;
  variants?: ProductVariant[];
}
