-- ==============================================================================
-- MIGRATION 005: STRICT AUTHENTICATION ENFORCEMENT & REMOVAL OF GUEST ORDERS
-- ==============================================================================
-- Description:
-- Enforces that orders can only be inserted, viewed, and updated by authenticated
-- Supabase users matching auth.uid() = user_id (or store admins).
-- Completely closes any anonymous / guest access paths.

-- 1. Orders RLS Policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public order insertion" ON public.orders;
DROP POLICY IF EXISTS "Allow public select orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public update order slip" ON public.orders;
DROP POLICY IF EXISTS "Users can select own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins have full access to orders" ON public.orders;
DROP POLICY IF EXISTS "Admins full access to orders" ON public.orders;

-- SELECT: Only the authenticated user who placed the order or an admin can read it
CREATE POLICY "Users can view own orders"
    ON public.orders FOR SELECT
    USING (
        auth.uid() = user_id
        OR (
            EXISTS (
                SELECT 1 FROM public.profiles p 
                WHERE p.id = auth.uid() AND p.role = 'admin'
            )
        )
    );

-- INSERT: Must be authenticated and user_id MUST match auth.uid()
CREATE POLICY "Users can insert own orders"
    ON public.orders FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL 
        AND auth.uid() = user_id
    );

-- UPDATE: Only owner or admin can update order (e.g. attaching bank slip or updating notes)
CREATE POLICY "Users can update own orders"
    ON public.orders FOR UPDATE
    USING (
        auth.uid() = user_id 
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

-- 2. Receipts RLS Policies (Bank Transfer Slips)
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select own receipts" ON public.receipts;
DROP POLICY IF EXISTS "Users can insert own receipts" ON public.receipts;
DROP POLICY IF EXISTS "Users can update own receipts" ON public.receipts;
DROP POLICY IF EXISTS "Admins full access to receipts" ON public.receipts;

CREATE POLICY "Users can view own receipts"
    ON public.receipts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = receipts.order_id AND o.user_id = auth.uid()
        )
        OR (
            EXISTS (
                SELECT 1 FROM public.profiles p 
                WHERE p.id = auth.uid() AND p.role = 'admin'
            )
        )
    );

CREATE POLICY "Users can insert own receipts"
    ON public.receipts FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = receipts.order_id AND o.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins full access to receipts"
    ON public.receipts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );
