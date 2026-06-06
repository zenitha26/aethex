-- AETHEX STORE - Database Schema
-- Master schema file containing categories, products, customers, orders, order_items, reviews, policies, settings, tracking, fulfillment, and audit logging.

-- Enable extensions
create extension if not exists "uuid-ossp";

-- 1. Categories Table
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamp with time zone default now()
);

-- 2. Products Table (Master Source of Truth)
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  title text not null,
  description text,
  price numeric not null,
  original_price numeric,
  image_url text,
  source text default 'aliexpress', -- 'aliexpress' | 'shopify' | 'customizer'
  external_id text,
  product_url text,
  stock int default 10,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. Customers Table
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text not null,
  address text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 4. Orders Table
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  customer_address text not null,
  subtotal numeric not null,
  total numeric not null,
  payment_status text default 'pending', -- 'pending' | 'confirmed'
  order_status text default 'processing', -- 'processing' | 'shipped' | 'delivered' | 'cancelled'
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 5. Order Items Table
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  quantity int not null check (quantity > 0),
  price numeric not null,
  customization jsonb, -- Stores specific choices like switchType, keycapColor, caseStyle
  created_at timestamp with time zone default now()
);

-- 6. Fulfillment Queue (Semi-automated fulfillment engine)
create table if not exists fulfillment_queue (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  status text default 'pending', -- 'pending' | 'processing' | 'completed' | 'failed'
  supplier text default 'aliexpress', -- 'aliexpress' | 'cj-dropshipping'
  product_snapshot jsonb not null,
  retry_count int default 0,
  created_at timestamp with time zone default now()
);

-- 7. Tracking Updates
create table if not exists tracking_updates (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  tracking_number text not null,
  courier text default 'AliExpress',
  status text default 'processing', -- 'processing' | 'in-transit' | 'delivered'
  updated_at timestamp with time zone default now()
);

-- 8. Reviews Table
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  customer_name text not null,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text,
  image_url text,
  is_approved boolean default false,
  created_at timestamp with time zone default now()
);

-- 9. Policies Table
create table if not exists policies (
  id uuid primary key default gen_random_uuid(),
  type text unique not null, -- 'shipping' | 'refund' | 'terms' | 'privacy' | 'cookies'
  title text not null,
  content jsonb not null,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 10. Settings Table
create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 11. Audit Logs Table (For security logging & database tracking)
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id uuid not null,
  action text not null, -- 'INSERT' | 'UPDATE' | 'DELETE'
  old_data jsonb,
  new_data jsonb,
  performed_by text default 'system',
  created_at timestamp with time zone default now()
);

-- Audit Logging Function
create or replace function process_audit_log()
returns trigger as $$
begin
  if (TG_OP = 'DELETE') then
    insert into audit_logs(table_name, record_id, action, old_data, new_data)
    values(TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD)::jsonb, null);
    return OLD;
  elsif (TG_OP = 'UPDATE') then
    insert into audit_logs(table_name, record_id, action, old_data, new_data)
    values(TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
    return NEW;
  elsif (TG_OP = 'INSERT') then
    insert into audit_logs(table_name, record_id, action, old_data, new_data)
    values(TG_TABLE_NAME, NEW.id, TG_OP, null, row_to_json(NEW)::jsonb);
    return NEW;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Apply Audit Triggers to core tables
drop trigger if exists audit_products_trigger on products;
create trigger audit_products_trigger
after insert or update or delete on products
for each row execute function process_audit_log();

drop trigger if exists audit_orders_trigger on orders;
create trigger audit_orders_trigger
after insert or update or delete on orders
for each row execute function process_audit_log();

drop trigger if exists audit_settings_trigger on settings;
create trigger audit_settings_trigger
after insert or update or delete on settings
for each row execute function process_audit_log();

-- Enable Row Level Security (RLS) on all tables
alter table categories enable row level security;
alter table products enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table fulfillment_queue enable row level security;
alter table tracking_updates enable row level security;
alter table reviews enable row level security;
alter table policies enable row level security;
alter table settings enable row level security;
alter table audit_logs enable row level security;

-- Drop existing policies if any to avoid errors on duplicate definitions
drop policy if exists "Allow public read access to categories" on categories;
drop policy if exists "Allow public read access to products" on products;
drop policy if exists "Allow public read access to active policies" on policies;
drop policy if exists "Allow public read access to settings" on settings;
drop policy if exists "Allow public read access to approved reviews" on reviews;
drop policy if exists "Allow public insert to reviews" on reviews;
drop policy if exists "Allow public insert to orders" on orders;
drop policy if exists "Allow public insert to order_items" on order_items;
drop policy if exists "Allow public insert to customers" on customers;
drop policy if exists "Allow public read tracking updates" on tracking_updates;

drop policy if exists "Admin full control on categories" on categories;
drop policy if exists "Admin full control on products" on products;
drop policy if exists "Admin full control on customers" on customers;
drop policy if exists "Admin full control on orders" on orders;
drop policy if exists "Admin full control on order_items" on order_items;
drop policy if exists "Admin full control on reviews" on reviews;
drop policy if exists "Admin full control on policies" on policies;
drop policy if exists "Admin full control on settings" on settings;
drop policy if exists "Admin full control on tracking" on tracking_updates;
drop policy if exists "Admin full control on fulfillment" on fulfillment_queue;
drop policy if exists "Admin full control on audit_logs" on audit_logs;

-- Public RLS Policies
create policy "Allow public read access to categories" on categories for select to public using (true);
create policy "Allow public read access to products" on products for select to public using (true);
create policy "Allow public read access to active policies" on policies for select to public using (is_active = true);
create policy "Allow public read access to settings" on settings for select to public using (true);
create policy "Allow public read access to approved reviews" on reviews for select to public using (is_approved = true);
create policy "Allow public insert to reviews" on reviews for insert to public with check (true);
create policy "Allow public insert to orders" on orders for insert to public with check (true);
create policy "Allow public insert to order_items" on order_items for insert to public with check (true);
create policy "Allow public insert to customers" on customers for insert to public with check (true);
create policy "Allow public read tracking updates" on tracking_updates for select to public using (true);

-- Admin/Service Role Full Access Policies (service_role automatically bypasses RLS, but these allow query convenience if anon/authenticated bypass is configured)
create policy "Admin full control on categories" on categories for all to public using (true) with check (true);
create policy "Admin full control on products" on products for all to public using (true) with check (true);
create policy "Admin full control on customers" on customers for all to public using (true) with check (true);
create policy "Admin full control on orders" on orders for all to public using (true) with check (true);
create policy "Admin full control on order_items" on order_items for all to public using (true) with check (true);
create policy "Admin full control on reviews" on reviews for all to public using (true) with check (true);
create policy "Admin full control on policies" on policies for all to public using (true) with check (true);
create policy "Admin full control on settings" on settings for all to public using (true) with check (true);
create policy "Admin full control on tracking" on tracking_updates for all to public using (true) with check (true);
create policy "Admin full control on fulfillment" on fulfillment_queue for all to public using (true) with check (true);
create policy "Admin full control on audit_logs" on audit_logs for all to public using (true) with check (true);
