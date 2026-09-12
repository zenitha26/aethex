export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  category_id?: string | null;
  title: string;
  description?: string;
  price: number;
  original_price?: number | null;
  image_url?: string;
  source?: string;
  external_id?: string;
  product_url?: string;
  stock?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  address: string;
  created_at?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string | null;
  quantity: number;
  price: number;
  customization?: {
    switches?: string;
    keycaps?: string;
    caseStyle?: string;
  } | null;
}

export interface Order {
  id: string;
  customer_id?: string | null;
  customer_name: string;
  customer_email?: string | null;
  customer_phone: string;
  customer_address: string;
  subtotal: number;
  total: number;
  payment_status: "pending" | "confirmed";
  order_status: "processing" | "shipped" | "delivered" | "cancelled";
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  order_items?: OrderItem[];
  tracking_updates?: TrackingUpdate[];
}

export interface TrackingUpdate {
  id: string;
  order_id: string;
  tracking_number: string;
  courier: string;
  status: "processing" | "in-transit" | "delivered";
  updated_at?: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment?: string;
  image_url?: string;
  is_approved: boolean;
  created_at?: string;
}

export interface Policy {
  id: string;
  type: "shipping" | "refund" | "terms" | "privacy" | "cookies";
  title: string;
  content: {
    title: string;
    sections: { heading: string; body: string }[];
  };
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}
