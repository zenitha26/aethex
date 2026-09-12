-- ==========================================
-- AETHEX ZERO-TRUST RLS SECURITY POLICIES
-- ==========================================
-- Paste this script into the Supabase SQL Editor and run it.

-- 1. Enable Row Level Security (RLS) on all critical tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create the audit_logs table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    executor_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- PROFILES POLICIES
-- ==========================================
-- Customers can only read their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Admins get full access to all profiles
-- Note: We use a subquery to check if the executor is an admin.
CREATE POLICY "Admins can do everything on profiles" 
ON public.profiles FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
);

-- Note: The trigger that creates the profile on auth.users INSERT runs with SECURITY DEFINER,
-- which bypasses RLS, so we don't need an INSERT policy for new signups.

-- ==========================================
-- PRODUCTS POLICIES
-- ==========================================
-- Public can read products (even if not logged in)
CREATE POLICY "Products are publicly readable" 
ON public.products FOR SELECT 
USING (true);

-- Only admins can insert, update, or delete products
CREATE POLICY "Admins have full access to products" 
ON public.products FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
);

-- ==========================================
-- ORDERS POLICIES
-- ==========================================
-- NOTE: Since your webhooks run on the Next.js backend using the `SUPABASE_SERVICE_ROLE_KEY`,
-- the service_role key natively bypasses all RLS policies. Therefore, you do NOT need a 
-- specific policy to allow webhook INSERTS.

-- Customers can view their own orders (matching customer_email to auth.jwt() email, or by ID)
-- Assuming customer_email exists.
CREATE POLICY "Users can view own orders" 
ON public.orders FOR SELECT 
USING (
    auth.email() = customer_email
);

-- Admins get full access to all orders
CREATE POLICY "Admins have full access to orders" 
ON public.orders FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
);

-- ==========================================
-- AUDIT LOGS POLICIES
-- ==========================================
-- Only admins can read audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.audit_logs FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
);

-- Admins can insert into audit logs (or service_role from backend)
CREATE POLICY "Admins can insert audit logs" 
ON public.audit_logs FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
);
