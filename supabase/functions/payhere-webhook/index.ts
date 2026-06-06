import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

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

Deno.serve(async (req) => {
  try {
    // PayHere sends webhook as urlencoded form data
    const formData = await req.formData();
    
    const merchant_id = formData.get("merchant_id") as string;
    const order_id = formData.get("order_id") as string;
    const payment_id = formData.get("payment_id") as string;
    const payhere_amount = formData.get("payhere_amount") as string;
    const payhere_currency = formData.get("payhere_currency") as string;
    const status_code = formData.get("status_code") as string;
    const md5sig = formData.get("md5sig") as string;

    const merchantSecret = Deno.env.get("PAYHERE_MERCHANT_SECRET") || "sandboxSecretKey";
    
    // Validate signature
    const secretHash = (await md5(merchantSecret)).toUpperCase();
    const localHashString = merchant_id + order_id + payhere_amount + payhere_currency + status_code + secretHash;
    const localHash = (await md5(localHashString)).toUpperCase();

    if (localHash !== md5sig) {
      console.error("Payment signature mismatch!");
      return new Response("Invalid Signature", { status: 400 });
    }

    // Status code '2' indicates success
    if (status_code === "2") {
      // 1. Fetch order details
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", order_id)
        .single();

      if (orderError || !order) {
        console.error("Order not found: ", order_id);
        return new Response("Order not found", { status: 404 });
      }

      // 2. Mark order as PAID
      const { error: updateError } = await supabase
        .from("orders")
        .update({ payment_status: "paid" })
        .eq("id", order_id);

      if (updateError) {
        console.error("Failed to update order payment status");
        return new Response("Update failed", { status: 500 });
      }

      // 3. Queue the fulfillment job
      const { error: queueError } = await supabase
        .from("fulfillment_queue")
        .insert({
          order_id: order.id,
          product_snapshot: order.items,
          status: "pending",
          supplier: "aliexpress"
        });

      if (queueError) {
        console.error("Fulfillment queuing failed:", queueError.message);
      } else {
        console.log(`Fulfillment job queued successfully for order: ${order_id}`);
      }
    } else {
      // Mark order as FAILED
      await supabase
        .from("orders")
        .update({ payment_status: "failed" })
        .eq("id", order_id);
      
      console.log(`Payment failed for order: ${order_id}, status_code: ${status_code}`);
    }

    return new Response("OK", { status: 200 });

  } catch (err) {
    console.error("Webhook processing error:", err.message);
    return new Response(err.message, { status: 500 });
  }
});
