// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
declare const Deno: any;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

async function md5(text: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("MD5", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: any) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      }
    });
  }

  try {
    const { customer_name, email, phone, address, cart } = await req.json();

    if (!customer_name || !email || !phone || !address || !cart || cart.length === 0) {
      return new Response(JSON.stringify({ error: "Missing required checkout fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 1. Recalculate prices server-side (Never trust frontend totals)
    let subtotal = 0;
    const finalItems = [];

    for (const item of cart) {
      // Fetch product price from database
      const { data: dbProduct, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", item.product.id)
        .single();

      if (error || !dbProduct) {
        // Fallback for custom configured items (base price 149 + extras)
        if (item.product.id === "custom-keyboard") {
          let itemPrice = 149;
          if (item.customization?.switches?.includes("Purple")) itemPrice += 10;
          if (item.customization?.switches?.includes("Pink")) itemPrice += 15;
          if (item.customization?.keycaps?.includes("Neon")) itemPrice += 20;
          if (item.customization?.keycaps?.includes("Laser")) itemPrice += 25;
          if (item.customization?.caseStyle?.includes("Aluminum")) itemPrice += 40;
          if (item.customization?.caseStyle?.includes("Brass")) itemPrice += 60;

          const qty = item.quantity || 1;
          subtotal += itemPrice * qty;
          finalItems.push({
            product_id: item.product.id,
            title: item.product.title,
            qty,
            price: itemPrice,
            customization: item.customization
          });
          continue;
        }

        return new Response(JSON.stringify({ error: `Product not found: ${item.product.title}` }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      const qty = item.quantity || 1;
      subtotal += dbProduct.price * qty;
      finalItems.push({
        product_id: dbProduct.id,
        title: dbProduct.title,
        qty,
        price: dbProduct.price,
        customization: item.customization
      });
    }

    const total = subtotal; // No taxes/shipping implemented for simplicity, free delivery

    // 2. Insert order in status "pending"
    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name,
        email,
        phone,
        address,
        items: finalItems,
        subtotal,
        total,
        payment_status: "pending",
        order_status: "processing"
      })
      .select()
      .single();

    if (orderError || !newOrder) {
      return new Response(JSON.stringify({ error: "Failed to create order" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 3. Generate PayHere payment parameters & MD5 Hash
    const merchantId = Deno.env.get("PAYHERE_MERCHANT_ID") || "1224406";
    const merchantSecret = Deno.env.get("PAYHERE_MERCHANT_SECRET") || "sandboxSecretKey";
    const currency = "LKR";

    // Hash format: merchant_id + order_id + amount_formatted + currency + md5(merchant_secret)
    const amountFormatted = total.toFixed(2);
    const secretHash = (await md5(merchantSecret)).toUpperCase();
    const hashString = merchantId + newOrder.id + amountFormatted + currency + secretHash;
    const finalHash = (await md5(hashString)).toUpperCase();

    // 4. Return checkout payload
    return new Response(
      JSON.stringify({
        order_id: newOrder.id,
        merchant_id: merchantId,
        amount: amountFormatted,
        currency,
        hash: finalHash,
        customer: {
          first_name: customer_name.split(" ")[0] || "Guest",
          last_name: customer_name.split(" ").slice(1).join(" ") || "Customer",
          email,
          phone,
          address,
          city: "Colombo",
          country: "Sri Lanka"
        }
      }),
      {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      }
    );

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
});
