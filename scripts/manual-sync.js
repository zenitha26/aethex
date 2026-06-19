require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function syncProducts() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_TOKEN;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!domain || !storefrontAccessToken || !supabaseUrl || !supabaseServiceKey) {
    console.error("Missing environment variables.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const query = `
    query getProducts {
      products(first: 50) {
        edges {
          node {
            id
            title
            description
            handle
            availableForSale
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    console.log("Fetching from Shopify...");
    const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query }),
    });

    const body = await res.json();
    if (body.errors) throw body.errors[0];

    const shopifyProducts = body.data.products.edges.map(e => e.node);
    console.log(`Fetched ${shopifyProducts.length} products from Shopify.`);

    const mappedProducts = shopifyProducts.map(p => {
      let price = p.priceRange?.minVariantPrice?.amount 
        ? parseFloat(p.priceRange.minVariantPrice.amount) 
        : 0;

      if (p.id === "gid://shopify/Product/8231002734666" || p.title?.includes("Baseus Bass EP10 Pro")) {
        price = 19990;
      }
      
      const image_url = p.images?.edges?.[0]?.node?.url || "";
      
      return {
        id: p.id,
        title: p.title,
        description: p.description,
        price,
        image_url,
        source: "shopify",
        stock: p.availableForSale ? 10 : 0,
        updated_at: new Date().toISOString()
      };
    });

    console.log("Syncing to Supabase...");
    const { error } = await supabase.from('products').upsert(mappedProducts, { onConflict: 'id' });
    
    if (error) {
      console.error("Supabase Error:", error);
    } else {
      console.log(`Successfully synced ${mappedProducts.length} products to your website database!`);
    }

  } catch (error) {
    console.error("Sync failed:", error);
  }
}

syncProducts();
