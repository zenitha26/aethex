import * as React from "react";

/**
 * AETHEX Security & Data Access Layer: React 19 Taint APIs
 * 
 * Strictly prevents sensitive backend secrets, service role keys, API tokens,
 * and confidential user security records from accidentally leaking into Client Components.
 */

let isTainted = false;

export function taintServerSecrets(): void {
  if (isTainted) return;
  
  const taintUniqueValue = (React as any).experimental_taintUniqueValue;
  if (typeof taintUniqueValue !== "function") return;

  if (typeof process !== "undefined" && process.env) {
    // 1. Taint Supabase Service Role Key
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      taintUniqueValue(
        "CRITICAL SECURITY LEAK: Supabase Service Role Key must never be passed to a Client Component.",
        process,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
    }

    // 2. Taint Resend API Secret Key
    if (process.env.RESEND_API_KEY) {
      taintUniqueValue(
        "CRITICAL SECURITY LEAK: Resend API Key must never be passed to a Client Component.",
        process,
        process.env.RESEND_API_KEY
      );
    }

    // 3. Taint Supabase JWT Secret / Internal Private Keys
    if (process.env.SUPABASE_JWT_SECRET) {
      taintUniqueValue(
        "CRITICAL SECURITY LEAK: Supabase JWT Secret must never be exposed to the client bundle.",
        process,
        process.env.SUPABASE_JWT_SECRET
      );
    }

    // 4. Taint Cloudflare / Encryption secrets if present
    if (process.env.CLOUDFLARE_API_TOKEN) {
      taintUniqueValue(
        "CRITICAL SECURITY LEAK: Cloudflare API Token must never be leaked to client.",
        process,
        process.env.CLOUDFLARE_API_TOKEN
      );
    }

    isTainted = true;
  }
}

/**
 * Marks any sensitive internal database object or token reference as tainted.
 * React 19 will throw a compile/render error if this object is passed as props to a Client Component.
 */
export function taintSensitiveObject<T extends object>(record: T, reason: string): T {
  const taintObj = (React as any).experimental_taintObjectReference;
  if (typeof taintObj === "function") {
    taintObj(
      `DATA ACCESS SECURITY: ${reason}`,
      record
    );
  }
  return record;
}

