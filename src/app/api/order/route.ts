import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Fallback to avoid crashes if env vars are not set during build/dev
const supabase = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

export async function POST(req: Request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Supabase connection is not configured on the server." },
        { status: 500 }
      );
    }

    const { cart, customer } = await req.json();

    // 🔐 STEP 1: Fetch REAL product prices from DB
    const productIds = cart.map((i: any) => i.productId);

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);

    if (error) throw error;
    if (!products || products.length === 0) {
      throw new Error("No matching products found in the database.");
    }

    // 🔐 STEP 2: Recalculate total SERVER-SIDE
    let total = 0;

    const verifiedItems = cart.map((item: any) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found.`);
      }

      const price = product.price; // TRUST ONLY DB
      total += price * item.quantity;

      return {
        productId: product.id,
        title: product.title,
        price,
        quantity: item.quantity
      };
    });

    // 🧾 STEP 3: Create order in DB
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_address: customer.address,
        total_amount: total,
        payment_status: "pending",
        items: verifiedItems
      })
      .select()
      .single();

    if (orderError) throw orderError;

    return NextResponse.json({
      success: true,
      orderId: order.id,
      total
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
