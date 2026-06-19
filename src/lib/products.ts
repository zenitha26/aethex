import { createClient } from "./supabase/server";
import { supabaseAdmin } from "./supabase";
import { getShopifyProducts } from "./shopify";

import { Product, ProductVariant } from "../types/product";

function mapShopifyProduct(p: any): Product {
  let price = p.priceRange?.minVariantPrice?.amount
    ? parseFloat(p.priceRange.minVariantPrice.amount)
    : 0;

  // Baseus EP10 custom pricing (removed, using Shopify price)

  const image_url = p.images?.edges?.[0]?.node?.url || "";

  let variants: ProductVariant[] = p.variants?.edges?.map((v: any) => {
    const node = v.node;
    const colorOption = node.selectedOptions?.find((opt: any) => opt.name.toLowerCase() === "color");
    return {
      id: node.id,
      title: node.title,
      color: colorOption?.value,
      image_url: node.image?.url || image_url
    };
  }) || [];

  // Using variants from Shopify directly
  if (variants.length === 0 && p.title?.toLowerCase().includes("ep10")) {
    // Only fallback if Shopify doesn't have variants yet
    variants = [
      {
        id: "ep10-black",
        title: "Black",
        color: "Black",
        image_url: "https://eu.baseus.com/cdn/shop/files/Baseus_Bass_EP10_Pro_In-Ear_TWS_Earbuds_Black1_700x.jpg?v=1750385094",
      },
      {
        id: "ep10-white",
        title: "White",
        color: "White",
        image_url: "https://eu.baseus.com/cdn/shop/files/BaseusBassEP10ProIn-EarTWSEarbudsWhite5_700x.jpg?v=1750385094",
      },
      {
        id: "ep10-blue",
        title: "Blue",
        color: "Blue",
        image_url: "https://eu.baseus.com/cdn/shop/files/Baseus_Bass_EP10_Pro_In_Ear_TWS_Earbuds_White_Baseus_Bass_BP1_Pro_In_Ear_TWS_Earbuds_Blue_10_700x.jpg?v=1760161916",
      }
    ];
  }

  return {
    id: p.id,
    title: p.title,
    description: p.description || "",
    price,
    image_url,
    source: "shopify",
    stock: p.availableForSale ? 10 : 0,
    variant_id: p.variants?.edges?.[0]?.node?.id || "",
    variants,
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const shopifyProducts = await getShopifyProducts();

    const mappedProducts = shopifyProducts.map(mapShopifyProduct);

    // 2. Asynchronously Sync to Supabase (Mirror)
    if (supabaseAdmin && mappedProducts.length > 0) {
      // Fire and forget upsert
      Promise.resolve().then(async () => {
        try {
          const upsertData = mappedProducts.map((p: Product) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            price: p.price,
            image_url: p.image_url,
            source: p.source,
            stock: p.stock,
            variant_id: p.variant_id,
            updated_at: new Date().toISOString(),
          }));

          if (supabaseAdmin) {
            await supabaseAdmin
              .from("products")
              .upsert(upsertData, { onConflict: "id" });
          }

          console.log(
            `Successfully synced ${mappedProducts.length} products`
          );
        } catch (syncError) {
          console.error(
            "Supabase sync failed:",
            syncError
          );
        }
      });
    }

    return mappedProducts;
  } catch (shopifyError) {
    console.error(
      "Shopify fetch failed, falling back to Supabase:",
      shopifyError
    );

    try {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(
          "Supabase fallback failed:",
          error
        );
        return [];
      }

      return (data || []).map((p) => ({
        ...p,
        description: p.description ?? undefined,
        original_price: p.original_price ?? undefined,
        image_url: p.image_url ?? undefined,
      })) as Product[];
    } catch (fallbackError) {
      console.error(
        "Final fallback failed:",
        fallbackError
      );
      return [];
    }
  }
}

export async function getProductById(
  id: string
): Promise<Product | null> {
  try {
    // First attempt Shopify
    try {
      const shopifyProducts = await getShopifyProducts();

      const product = shopifyProducts.find(
        (p: any) => p.id === id
      );

      if (product) {
        return mapShopifyProduct(product);
      }
    } catch (shopifyError) {
      console.error(
        "Shopify direct lookup failed:",
        shopifyError
      );
    }

    // Fallback to Supabase
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(
        `Failed to fetch product ${id} from Supabase`,
        error
      );
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      ...data,
      description: data.description ?? undefined,
      original_price: data.original_price ?? undefined,
      image_url: data.image_url ?? undefined,
    } as Product;
  } catch (err) {
    console.error(
      `Failed to fetch product ${id}`,
      err
    );
    return null;
  }
}