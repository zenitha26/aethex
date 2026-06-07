import { createClient } from "./supabase/server";
import { supabaseAdmin } from "./supabase";
import { getShopifyProducts } from "./shopify";

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  source: string;
  stock: number;
  created_at: string;
  variant_id?: string;
}

export async function getProducts(): Promise<Product[]> {
  try {
    // 1. Try to fetch from Shopify (Source of Truth)
    const shopifyProducts = await getShopifyProducts();
    
    const mappedProducts: Product[] = shopifyProducts.map((p: any) => {
      // Safely extract data
      const price = p.priceRange?.minVariantPrice?.amount 
        ? parseFloat(p.priceRange.minVariantPrice.amount) 
        : 0;
      
      const image_url = p.images?.edges?.[0]?.node?.url || "";
      const variant_id = p.variants?.edges?.[0]?.node?.id || "";

      return {
        id: p.id,
        title: p.title,
        description: p.description,
        price,
        image_url,
        source: "shopify",
        stock: p.totalInventory || 0,
        variant_id, // useful for cart lines
        created_at: new Date().toISOString(),
      };
    });

    // 2. Asynchronously Sync to Supabase (Mirror)
    if (supabaseAdmin && mappedProducts.length > 0) {
      // Fire and forget upsert
      Promise.resolve().then(async () => {
        try {
          const upsertData = mappedProducts.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            price: p.price,
            image_url: p.image_url,
            source: p.source,
            stock: p.stock,
            updated_at: new Date().toISOString()
          }));
          
          const admin = supabaseAdmin;
          if (admin) {
            await admin.from("products").upsert(upsertData, { onConflict: "id" });
            console.log(`Synced ${upsertData.length} products to Supabase.`);
          }
        } catch (err) {
          console.error("Failed to background sync products to Supabase:", err);
        }
      });
    }

    return mappedProducts;

  } catch (err) {
    console.error("Shopify fetch failed, falling back to Supabase:", err);
    // 3. Fallback to Supabase if Shopify is down
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fallback to Supabase also failed:", error);
      return [];
    }

    return data.map(p => ({
      ...p,
      description: p.description ?? undefined,
      original_price: p.original_price ?? undefined,
      image_url: p.image_url ?? undefined
    })) as Product[];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  // First, check if we can get it from Shopify
  // For simplicity, we can fetch all and find, or just rely on Supabase for direct ID lookups if it's synced.
  // Let's rely on Supabase for the fast lookup, as it should be mirrored!
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Failed to fetch product ${id} from Supabase:`, error);
      return null;
    }

    const product = data;
    return {
      ...product,
      description: product.description ?? undefined,
      original_price: product.original_price ?? undefined,
      image_url: product.image_url ?? undefined
    } as Product;
  } catch (err) {
    console.error(`Failed to fetch product ${id}:`, err);
    return null;
  }
}
