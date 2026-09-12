export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { createCart, addToCart } from '../../../lib/shopify';

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // 1. Create a new cart
    const cart = await createCart();
    
    if (!cart || !cart.id) {
      throw new Error('Failed to create Shopify cart');
    }

    // 2. Format lines for Shopify
    // The items from the frontend need to map to Shopify's variant IDs
    // Our Supabase products now store variant_id
    const lines = items.map((item: any) => ({
      merchandiseId: item.product.variant_id || item.product.id,
      quantity: item.quantity || 1
    }));

    // 3. Add items to cart
    const updatedCart = await addToCart(cart.id, lines);

    return NextResponse.json({
      success: true,
      checkoutUrl: updatedCart.checkoutUrl,
      cartId: updatedCart.id
    });
  } catch (error: any) {
    console.error('Cart API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process cart' }, { status: 500 });
  }
}
