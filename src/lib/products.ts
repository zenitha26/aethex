import { Product } from "../types/product";
import { mockProducts } from "./mockData";

export async function getProducts(): Promise<Product[]> {
  // Bypassing Shopify/Supabase to run fully local/monolithic
  return mockProducts;
}

export async function getProductById(id: string): Promise<Product | null> {
  // Bypassing Shopify/Supabase direct queries
  return mockProducts.find((p) => p.id === id) || null;
}