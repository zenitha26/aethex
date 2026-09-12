import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error("Please provide an email address. Usage: npx tsx scripts/make-admin.ts <email>");
    process.exit(1);
  }

  // Find user in auth.users by email (we actually can't query auth.users directly easily, so we query profiles)
  const { data: profile, error: profileErr } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (profileErr || !profile) {
    console.error(`Could not find profile for email: ${email}`, profileErr);
    console.log("Ensure the user has signed in at least once via Google Auth.");
    process.exit(1);
  }

  // Update role
  const { error: updateErr } = await supabaseAdmin
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", profile.id);

  if (updateErr) {
    console.error("Failed to update role:", updateErr);
    process.exit(1);
  }

  console.log(`Success! User ${email} has been granted the 'admin' role.`);
}

makeAdmin();
