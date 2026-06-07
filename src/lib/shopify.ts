const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_TOKEN;

async function shopifyFetch<T>({ cache = 'force-cache', headers, query, tags, variables }: { cache?: RequestCache; headers?: HeadersInit; query: string; tags?: string[]; variables?: any }): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      ...(tags && { next: { tags } })
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
    throw new Error('An error occurred while fetching from Shopify');
  }
}

export async function getShopifyProducts() {
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
            totalInventory
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

  const res = await shopifyFetch<any>({ query, cache: 'no-store' });
  return res.body.data.products.edges.map(({ node }: any) => node);
}

export async function createCart() {
  const query = `
    mutation cartCreate {
      cartCreate {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `;

  const res = await shopifyFetch<any>({ query, cache: 'no-store' });
  return res.body.data.cartCreate.cart;
}

export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `;

  const variables = {
    cartId,
    lines
  };

  const res = await shopifyFetch<any>({ query, variables, cache: 'no-store' });
  return res.body.data.cartLinesAdd.cart;
}
