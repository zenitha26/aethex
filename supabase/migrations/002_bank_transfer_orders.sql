-- AETHEX STORE - Bank Transfer Orders & Payment Slip Storage Schema
-- Run this in your Supabase SQL Editor if the 'orders' table is not yet created.

-- 1. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  city TEXT,
  postal_code TEXT,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT DEFAULT 'bank_transfer',
  payment_status TEXT DEFAULT 'pending_payment',
  order_status TEXT DEFAULT 'pending_payment',
  status TEXT DEFAULT 'pending_payment',
  slip_url TEXT,
  notes TEXT,
  line_items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add columns if table already existed without them
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'bank_transfer';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending_payment';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_status TEXT DEFAULT 'pending_payment';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending_payment';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS slip_url TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS line_items JSONB DEFAULT '[]'::jsonb;

-- 2. Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
DROP POLICY IF EXISTS "Allow public order insertion" ON public.orders;
CREATE POLICY "Allow public order insertion" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select orders" ON public.orders;
CREATE POLICY "Allow public select orders" ON public.orders
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow public update order slip" ON public.orders;
CREATE POLICY "Allow public update order slip" ON public.orders
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Storage bucket for payment slips
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment_slips', 'payment_slips', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage object policies
DROP POLICY IF EXISTS "Allow public upload to payment_slips" ON storage.objects;
CREATE POLICY "Allow public upload to payment_slips" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'payment_slips');

DROP POLICY IF EXISTS "Allow public read from payment_slips" ON storage.objects;
CREATE POLICY "Allow public read from payment_slips" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'payment_slips');

DROP POLICY IF EXISTS "Allow public update in payment_slips" ON storage.objects;
CREATE POLICY "Allow public update in payment_slips" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'payment_slips');
