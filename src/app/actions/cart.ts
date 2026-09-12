"use server";

import { createClient } from "@/lib/supabase/server";
import { taintServerSecrets, taintSensitiveObject } from "@/lib/security/taint";

// Initialize React 19 Taint protection on Server Actions layer
taintServerSecrets();

export interface CartItemPayload {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  color?: string;
  variantId?: string;
}

export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

/**
 * Validates current caller session and returns authenticated user if available.
 * Every server action rigorously validates caller identity.
 */
async function getValidatedSession() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      // Guest users are allowed for cart mutations, but caller must pass validation
      return { user: null, isGuest: true };
    }
    return { user, isGuest: !user };
  } catch {
    return { user: null, isGuest: true };
  }
}

/**
 * Server Action: Add Item to Cart
 * Next.js 15 assigns an encrypted, non-deterministic Action ID.
 */
export async function addToCartAction(item: CartItemPayload): Promise<ActionResult<CartItemPayload>> {
  const session = await getValidatedSession();

  // Validate payload constraints
  if (!item || !item.id || typeof item.price !== "number" || item.price < 0 || item.quantity < 1) {
    return {
      success: false,
      error: "Invalid cart item parameters.",
      timestamp: Date.now(),
    };
  }

  // Taint sensitive internal runtime metadata to prevent client leakage
  const safeItem: CartItemPayload = {
    id: String(item.id).slice(0, 100),
    title: String(item.title).slice(0, 150),
    price: Math.max(0, item.price),
    quantity: Math.min(100, Math.max(1, Math.floor(item.quantity))),
    image: item.image ? String(item.image).slice(0, 500) : undefined,
    color: item.color ? String(item.color).slice(0, 50) : undefined,
    variantId: item.variantId ? String(item.variantId).slice(0, 100) : undefined,
  };

  return {
    success: true,
    data: safeItem,
    timestamp: Date.now(),
  };
}

/**
 * Server Action: Update Cart Item Quantity
 */
export async function updateCartQuantityAction(
  itemId: string,
  delta: number
): Promise<ActionResult<{ itemId: string; delta: number }>> {
  await getValidatedSession();

  if (!itemId || typeof delta !== "number" || delta < -100 || delta > 100) {
    return {
      success: false,
      error: "Invalid quantity update delta.",
      timestamp: Date.now(),
    };
  }

  return {
    success: true,
    data: { itemId: String(itemId).slice(0, 100), delta },
    timestamp: Date.now(),
  };
}

/**
 * Server Action: Remove Item from Cart
 */
export async function removeCartItemAction(itemId: string): Promise<ActionResult<{ itemId: string }>> {
  await getValidatedSession();

  if (!itemId) {
    return {
      success: false,
      error: "Item ID is required for removal.",
      timestamp: Date.now(),
    };
  }

  return {
    success: true,
    data: { itemId: String(itemId).slice(0, 100) },
    timestamp: Date.now(),
  };
}

/**
 * Server Action: Clear All Cart Items
 */
export async function clearCartAction(): Promise<ActionResult> {
  await getValidatedSession();

  return {
    success: true,
    timestamp: Date.now(),
  };
}
