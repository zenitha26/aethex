import React from "react";

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  original_price?: number | null;
  image_url?: string;
  source?: string;
  external_id?: string;
  product_url?: string;
  stock?: number;
}

export const defaultProducts: Product[] = [
  {
    id: "9912001",
    title: "Aethex Alpha Keyboard",
    description: "Ultra-thin mechanical key configuration crafted with space-grade aluminum.",
    price: 34900.00,
    original_price: 42000.00,
    image_url: "p1",
    source: "shopify",
    stock: 12
  },
  {
    id: "9912002",
    title: "Aethex Sentinel M8",
    description: "Zero-latency wireless carbon gaming mouse with custom sensor configuration.",
    price: 18900.00,
    original_price: 24900.00,
    image_url: "p2",
    source: "shopify",
    stock: 25
  },
  {
    id: "ali8839401",
    title: "Aethex Aero-Frame Shelf",
    description: "Anodized space black desk organizer shelf supporting high load structures.",
    price: 24900.00,
    original_price: 29900.00,
    image_url: "p3",
    source: "aliexpress",
    stock: 150
  },
  {
    id: "ali8839402",
    title: "Aethex Planar Audio Headset",
    description: "Studio open-back magnetic headset engineered for immersive high-fidelity audio.",
    price: 48900.00,
    original_price: 59900.00,
    image_url: "p4",
    source: "aliexpress",
    stock: 80
  },
  {
    id: "ali8839403",
    title: "Aethex Cordura Desk Pad",
    description: "Water-repellent Cordura heavy weave desk pad with customizable LED glow edges.",
    price: 8900.00,
    original_price: 11900.00,
    image_url: "p5",
    source: "aliexpress",
    stock: 300
  },
  {
    id: "ali8839404",
    title: "Aethex Gas Spring Arm",
    description: "Fluid counterbalanced heavy-duty gas spring single monitor arm.",
    price: 14900.00,
    original_price: 18900.00,
    image_url: "p6",
    source: "aliexpress",
    stock: 120
  }
];
