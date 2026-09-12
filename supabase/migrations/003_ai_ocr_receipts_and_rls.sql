-- =============================================================================
-- AETHEX STORE - PHASE 4: AI OCR RECEIPTS & ZERO-TRUST ROW LEVEL SECURITY (RLS)
-- =============================================================================
-- Paste this script into your Supabase SQL Editor to enforce strict RLS on orders & receipts.

-- 1. Create Receipts Table for AI Vision OCR Extractions
CREATE TABLE IF NOT EXISTS public.receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    file_url TEXT NOT NULL,
    extracted_data JSONB DEFAULT '{}'::jsonb,
    payment_date TIMESTAMPTZ,
    sender_account TEXT,
    receiver_account TEXT,
    amount NUMERIC,
    currency TEXT DEFAULT 'LKR',
    reference_number TEXT,
    reconciliation_status TEXT DEFAULT 'pending',
    confidence NUMERIC DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast queries
CREATE INDEX IF NOT EXISTS idx_receipts_order_id ON public.receipts(order_id);
CREATE INDEX IF NOT EXISTS idx_receipts_user_id ON public.receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- 2. Enable Row Level Security (RLS) on orders and receipts
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- ORDERS TABLE RLS POLICIES
-- =============================================================================
-- Drop old permissive policies
DROP POLICY IF EXISTS "Allow public select orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public order insertion" ON public.orders;
DROP POLICY IF EXISTS "Allow public update order slip" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can select own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins have full access to orders" ON public.orders;
DROP POLICY IF EXISTS "Admins full access to orders" ON public.orders;

-- SELECT: Users can only view their own orders; guests can view with their customer_email
CREATE POLICY "Users can select own orders"
    ON public.orders FOR SELECT
    USING (
        auth.uid() = user_id 
        OR (user_id IS NULL AND auth.email() = customer_email)
        OR (
            EXISTS (
                SELECT 1 FROM public.profiles p 
                WHERE p.id = auth.uid() AND p.role = 'admin'
            )
        )
    );

-- INSERT: Users can only insert orders with their own user_id or as guest (user_id IS NULL)
CREATE POLICY "Users can insert own orders"
    ON public.orders FOR INSERT
    WITH CHECK (
        auth.uid() = user_id 
        OR user_id IS NULL
    );

-- UPDATE: Users can update their own orders (e.g. attaching bank transfer slip)
CREATE POLICY "Users can update own orders"
    ON public.orders FOR UPDATE
    USING (
        auth.uid() = user_id 
        OR user_id IS NULL
        OR (
            EXISTS (
                SELECT 1 FROM public.profiles p 
                WHERE p.id = auth.uid() AND p.role = 'admin'
            )
        )
    );

-- DELETE: Strictly restricted to admin users only
CREATE POLICY "Admins can delete orders"
    ON public.orders FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- =============================================================================
-- RECEIPTS TABLE RLS POLICIES
-- =============================================================================
DROP POLICY IF EXISTS "Users can select own receipts" ON public.receipts;
DROP POLICY IF EXISTS "Users can insert own receipts" ON public.receipts;
DROP POLICY IF EXISTS "Admins full access to receipts" ON public.receipts;

-- SELECT: Users can only view their own receipts
CREATE POLICY "Users can select own receipts"
    ON public.receipts FOR SELECT
    USING (
        auth.uid() = user_id 
        OR (user_id IS NULL AND EXISTS (
            SELECT 1 FROM public.orders o 
            WHERE o.id = receipts.order_id AND o.customer_email = auth.email()
        ))
        OR (
            EXISTS (
                SELECT 1 FROM public.profiles p 
                WHERE p.id = auth.uid() AND p.role = 'admin'
            )
        )
    );

-- INSERT: Users can only insert their own receipt or guest receipt
CREATE POLICY "Users can insert own receipts"
    ON public.receipts FOR INSERT
    WITH CHECK (
        auth.uid() = user_id 
        OR user_id IS NULL
    );

-- ALL: Admins have full access to all receipts
CREATE POLICY "Admins full access to receipts"
    ON public.receipts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- =============================================================================
-- SECURITY NOTICE:
-- The SUPABASE_SERVICE_ROLE_KEY natively bypasses RLS on the server backend.
-- It must NEVER be prefixed with NEXT_PUBLIC_ or passed into any client bundle.
-- =============================================================================
