// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async () => {
  try {
    const shopifyDomain = Deno.env.get("SHOPIFY_SHOP_DOMAIN");
    const shopifyToken = Deno.env.get("SHOPIFY_ACCESS_TOKEN");

    let shopifyProducts: any[] = [];

    // 🟢 SHOPIFY SYNC
    if (shopifyDomain && shopifyToken) {
      const res = await fetch(
        `https://${shopifyDomain}/admin/api/2024-01/products.json`,
        {
          headers: {
            "X-Shopify-Access-Token": shopifyToken,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        shopifyProducts = data.products ?? [];
      }
    }

    // 🧪 MOCK FALLBACK
    if (!shopifyProducts.length) {
      shopifyProducts = [
        {
          id: 9912001,
          title: "Aethex Alpha Keyboard",
          body_html: "Ultra-thin mechanical keyboard",
          variants: [
            {
              price: "34900",
              compare_at_price: "42000",
              inventory_quantity: 12,
            },
          ],
          image: { src: "p1" },
        },
        {
          id: 9912002,
          title: "Aethex Sentinel Mouse",
          body_html: "Gaming mouse ultra precision",
          variants: [
            {
              price: "18900",
              compare_at_price: "24900",
              inventory_quantity: 25,
            },
          ],
          image: { src: "p2" },
        },
      ];
    }

    // 🟢 UPSERT SHOPIFY PRODUCTS
    for (const p of shopifyProducts) {
      const variant = p?.variants?.[0];

      if (!variant) continue;

      await supabase.from("products").upsert(
        {
          title: p.title ?? "Untitled",
          description: p.body_html ?? "",
          price: Number(variant.price) || 0,
          original_price: variant.compare_at_price
            ? Number(variant.compare_at_price)
            : null,
          image_url: p.image?.src ?? "",
          source: "shopify",
          external_id: String(p.id),
          stock: variant.inventory_quantity ?? 0,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "external_id",
        }
      );
    }

    // 🟠 ALIEXPRESS MOCK SYNC
    const aliProducts = [
      {
        id: "ali1",
        title: "Aethex Aero Desk Shelf",
        description: "Premium aluminum shelf",
        price: 24900,
        original_price: 29900,
        image: "p3",
        url: "#",
        stock: 150,
      },
    ];

    for (const p of aliProducts) {
      await supabase.from("products").upsert(
        {
          title: p.title,
          description: p.description,
          price: p.price,
          original_price: p.original_price,
          image_url: p.image,
          source: "aliexpress",
          external_id: p.id,
          product_url: p.url,
          stock: p.stock,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "external_id",
        }
      );
    }

    return Response.json({
      status: "sync_complete",
      shopify_count: shopifyProducts.length,
      ali_count: aliProducts.length,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Unknown error" }),
      {
        status: 500,
      }
    );
  }
});