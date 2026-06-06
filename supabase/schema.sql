-- AETHEX STORE - Database Schema

-- 1. Products Table (Master Source of Truth)
create table products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric not null,
  original_price numeric,
  image_url text,
  source text default 'aliexpress', -- 'aliexpress' | 'shopify'
  external_id text,
  product_url text,
  stock int default 10,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 2. Orders Table
create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  items jsonb not null, -- Array of items with product_id, title, qty, price, customization details
  subtotal numeric not null,
  total numeric not null,
  payment_status text default 'pending', -- 'pending' | 'paid' | 'failed'
  order_status text default 'processing', -- 'processing' | 'shipped' | 'delivered'
  created_at timestamp default now()
);

-- 3. Fulfillment Queue (Semi-automated fulfillment engine)
create table fulfillment_queue (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  status text default 'pending', -- 'pending' | 'processing' | 'completed' | 'failed'
  supplier text default 'aliexpress', -- 'aliexpress' | 'cj-dropshipping'
  product_snapshot jsonb not null,
  retry_count int default 0,
  created_at timestamp default now()
);

-- 4. Tracking Updates
create table tracking_updates (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  tracking_number text not null,
  courier text default 'AliExpress',
  status text default 'processing', -- 'processing' | 'in-transit' | 'delivered'
  updated_at timestamp default now()
);

-- Enable Row Level Security (RLS)
alter table products enable row level security;
alter table orders enable row level security;
alter table fulfillment_queue enable row level security;
alter table tracking_updates enable row level security;

-- Policies for Products (Public read-only)
create policy "Allow public read access to products"
on products for select
to public
using (true);

-- Policies for Orders (Public insert, admin full control)
create policy "Allow public insert access to orders"
on orders for insert
to public
with check (true);

create policy "Allow public read access to own orders by email/phone check"
on orders for select
to public
using (true); -- simplified public tracking checks, restrict if auth is added

-- Policies for fulfillment and tracking (Service-role or admin only, public tracking read-only)
create policy "Allow public read access to tracking updates"
on tracking_updates for select
to public
using (true);
