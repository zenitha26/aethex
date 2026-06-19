const domain = process.env.SHOPIFY_STORE_DOMAIN;
const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

async function shopifyAdminFetch<T>({ query, variables }: { query: string; variables?: any }): Promise<{ status: number; body: T } | never> {
  if (!adminAccessToken) {
    throw new Error('SHOPIFY_ADMIN_ACCESS_TOKEN is not defined');
  }

  try {
    const result = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminAccessToken,
      },
      body: JSON.stringify({
        query,
        ...(variables && { variables })
      }),
      cache: 'no-store'
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
    console.error('Admin API Error:', e);
    throw new Error('An error occurred while fetching from Shopify Admin API');
  }
}

/**
 * Adds a new image to a product via URL.
 */
export async function addProductImage(productId: string, imageUrl: string) {
  // Ensure the ID is properly formatted as a Global ID if it's just numbers
  const formattedId = productId.includes('gid://') ? productId : `gid://shopify/Product/${productId}`;
  
  const query = `
    mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
      productCreateMedia(media: $media, productId: $productId) {
        media {
          alt
          mediaContentType
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    productId: formattedId,
    media: [
      {
        originalSource: imageUrl,
        mediaContentType: "IMAGE"
      }
    ]
  };

  const res = await shopifyAdminFetch<any>({ query, variables });
  const userErrors = res.body.data?.productCreateMedia?.userErrors;
  
  if (userErrors && userErrors.length > 0) {
    throw new Error(userErrors[0].message);
  }
  
  return true;
}

/**
 * Sets the available inventory quantity for a product's first variant.
 */
export async function setProductStock(productId: string, quantity: number) {
  const formattedId = productId.includes('gid://') ? productId : `gid://shopify/Product/${productId}`;
  
  // 1. First, we need the inventoryItemId and locationId
  const getInventoryQuery = `
    query getProductInventory($id: ID!) {
      product(id: $id) {
        variants(first: 1) {
          edges {
            node {
              inventoryItem {
                id
                inventoryLevels(first: 1) {
                  edges {
                    node {
                      location {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const inventoryRes = await shopifyAdminFetch<any>({ query: getInventoryQuery, variables: { id: formattedId } });
  
  const variantNode = inventoryRes.body.data?.product?.variants?.edges?.[0]?.node;
  if (!variantNode) {
    throw new Error("Could not find product variant to update stock");
  }
  
  const inventoryItemId = variantNode.inventoryItem?.id;
  const locationId = variantNode.inventoryItem?.inventoryLevels?.edges?.[0]?.node?.location?.id;

  if (!inventoryItemId || !locationId) {
    throw new Error("Could not find inventory item or location ID");
  }

  // 2. Set the quantity
  const setQuantityQuery = `
    mutation inventorySetQuantities($input: InventorySetQuantitiesInput!) {
      inventorySetQuantities(input: $input) {
        inventoryAdjustmentGroup {
          createdAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      name: "available",
      reason: "correction",
      quantities: [
        {
          inventoryItemId,
          locationId,
          quantity: parseInt(quantity.toString(), 10)
        }
      ]
    }
  };

  const updateRes = await shopifyAdminFetch<any>({ query: setQuantityQuery, variables });
  const userErrors = updateRes.body.data?.inventorySetQuantities?.userErrors;
  
  if (userErrors && userErrors.length > 0) {
    throw new Error(userErrors[0].message);
  }

  return true;
}
