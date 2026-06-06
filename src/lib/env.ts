import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().or(z.string().min(1)),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  ADMIN_USERNAME: z.string().default("admin"),
  ADMIN_PASSWORD: z.string().default("aethexadmin123"),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().default("1x00000000000000000000AA"),
  TURNSTILE_SECRET_KEY: z.string().default("1x0000000000000000000000000000000AA"),
  RESEND_API_KEY: z.string().optional(),
});

export const validateEnv = () => {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  });

  if (!parsed.success) {
    console.warn("⚠️ AETHEX Environment validation warnings/failures:", parsed.error.format());
    // Fallback to raw process env values or defaults
    return {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      ADMIN_USERNAME: process.env.ADMIN_USERNAME || "admin",
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "aethexadmin123",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA",
      TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA",
      RESEND_API_KEY: process.env.RESEND_API_KEY,
    };
  }
  return parsed.data;
};

export const env = validateEnv();
export type Env = z.infer<typeof envSchema>;
