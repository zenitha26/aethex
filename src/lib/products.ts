import { Product } from "../types/product";
import { mockProducts } from "./mockData";

export async function getProducts(): Promise<Product[]> {
  // Bypassing Shopify/Supabase to run fully local/monolithic
  return mockProducts;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!id) return null;
  const decoded = decodeURIComponent(id).trim().toLowerCase();
  return (
    mockProducts.find((p) => {
      if (p.id.toLowerCase() === decoded) return true;
      if (p.sku && p.sku.toLowerCase() === decoded) return true;
      if (p.external_id && p.external_id.toLowerCase() === decoded) return true;
      if (p.handle && p.handle.toLowerCase() === decoded) return true;
      // also match partial id without prefix if needed e.g. "a711"
      if (p.id.toLowerCase().replace(/^aethex-/, '') === decoded) return true;
      return false;
    }) || null
  );
}