// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
declare const Deno: any;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async () => {
  try {
    // 1. Fetch pending fulfillment tasks
    const { data: jobs, error: jobsError } = await supabase
      .from("fulfillment_queue")
      .select("*")
      .eq("status", "pending")
      .limit(10);

    if (jobsError) {
      throw new Error(`Failed to fetch jobs: ${jobsError.message}`);
    }

    console.log(`Processing ${jobs?.length || 0} fulfillment queue tasks...`);
    const processedJobs = [];

    for (const job of jobs || []) {
      try {
        // Mark job as processing to avoid race conditions
        await supabase
          .from("fulfillment_queue")
          .update({ status: "processing" })
          .eq("id", job.id);

        // 🧠 Smart routing logic: Decide supplier based on items configuration
        let chosenSupplier = "AliExpress";
        const itemsList = job.product_snapshot || [];

        for (const item of itemsList) {
          // If product quantity or stock is high, route to dedicated fulfillment partners
          if (item.qty > 5) {
            chosenSupplier = "CJ Dropshipping";
            break;
          }
        }

        console.log(`Routing order ${job.order_id} to ${chosenSupplier}...`);

        // Simulate contact with Supplier APIs (CJ / AliExpress / DSers integration)
        // Generate a mock tracking code representing supplier ship-out
        const randomNum = Math.floor(100000000 + Math.random() * 900000000);
        const trackingNumber = `AE${randomNum}SL`;

        // 2. Insert secure tracking updates into DB
        const { error: trackingError } = await supabase
          .from("tracking_updates")
          .insert({
            order_id: job.order_id,
            tracking_number: trackingNumber,
            courier: chosenSupplier,
            status: "processing"
          });

        if (trackingError) {
          throw new Error(`Tracking insert failed: ${trackingError.message}`);
        }

        // 3. Mark Order status as 'shipped' in Database
        await supabase
          .from("orders")
          .update({ order_status: "shipped" })
          .eq("id", job.order_id);

        // 4. Mark job as completed
        await supabase
          .from("fulfillment_queue")
          .update({
            status: "completed",
            supplier: chosenSupplier
          })
          .eq("id", job.id);

        processedJobs.push({ job_id: job.id, order_id: job.order_id, status: "completed", tracking: trackingNumber });

      } catch (jobErr: any) {
        console.error(`Error processing job ${job.id}:`, jobErr.message);
        
        // Mark job as failed and increment retry count
        await supabase
          .from("fulfillment_queue")
          .update({
            status: "failed",
            retry_count: job.retry_count + 1
          })
          .eq("id", job.id);
      }
    }

    return new Response(JSON.stringify({ status: "processed", count: processedJobs.length, jobs: processedJobs }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
