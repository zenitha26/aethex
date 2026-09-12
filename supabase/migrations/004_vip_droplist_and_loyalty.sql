-- =============================================================================
-- AETHEX STORE - PHASE 5: VIP DROPLIST SUBSCRIBERS & LOYALTY REWARDS SYSTEM
-- =============================================================================

-- 1. Abandoned Cart Tracking columns on orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS abandoned_email_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS abandoned_email_sent_at TIMESTAMPTZ;

-- 2. VIP Droplist Subscribers Table
CREATE TABLE IF NOT EXISTS public.vip_droplist_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    vip_tier TEXT DEFAULT 'PRIORITY_ACCESS',
    invite_code TEXT UNIQUE NOT NULL,
    source TEXT DEFAULT 'web_droplist',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_vip_subscribers_email ON public.vip_droplist_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_vip_subscribers_invite ON public.vip_droplist_subscribers(invite_code);

-- 3. Loyalty Tracking Columns on Profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lifetime_spent NUMERIC DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS loyalty_tier TEXT DEFAULT 'Initiate';

-- 4. Loyalty Ledger Table (1 Point per 100 LKR spent)
CREATE TABLE IF NOT EXISTS public.loyalty_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    points INTEGER NOT NULL,
    description TEXT NOT NULL,
    type TEXT DEFAULT 'earn', -- 'earn' | 'redeem' | 'tier_bonus'
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_ledger_user ON public.loyalty_ledger(user_id);

-- 5. Row Level Security (RLS)
ALTER TABLE public.vip_droplist_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_ledger ENABLE ROW LEVEL SECURITY;

-- VIP Droplist RLS Policies
DROP POLICY IF EXISTS "Public can subscribe to VIP droplist" ON public.vip_droplist_subscribers;
DROP POLICY IF EXISTS "Users can view own VIP subscription" ON public.vip_droplist_subscribers;
DROP POLICY IF EXISTS "Admins full access to VIP droplist" ON public.vip_droplist_subscribers;

-- INSERT: Anyone can subscribe to the VIP droplist
CREATE POLICY "Public can subscribe to VIP droplist"
    ON public.vip_droplist_subscribers FOR INSERT
    WITH CHECK (true);

-- SELECT: Users can view their own VIP entry by email match or if admin
CREATE POLICY "Users can view own VIP subscription"
    ON public.vip_droplist_subscribers FOR SELECT
    USING (
        auth.email() = email
        OR EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE POLICY "Admins full access to VIP droplist"
    ON public.vip_droplist_subscribers FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- Loyalty Ledger RLS Policies
DROP POLICY IF EXISTS "Users can view own loyalty ledger" ON public.loyalty_ledger;
DROP POLICY IF EXISTS "Admins full access to loyalty ledger" ON public.loyalty_ledger;

CREATE POLICY "Users can view own loyalty ledger"
    ON public.loyalty_ledger FOR SELECT
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE POLICY "Admins full access to loyalty ledger"
    ON public.loyalty_ledger FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );
