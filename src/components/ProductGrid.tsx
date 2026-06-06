"use client";

import { useEffect, useState } from "react";
import { useCartStore, Product } from "../store/useCartStore";
import ProductCard from "./ProductCard";
import { supabase } from "../lib/supabase"; // We'll create this lib helper next

const defaultProducts: Product[] = [
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

export default function ProductGrid() {
  const { searchQuery, selectedCategory, setSelectedCategory } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        if (!supabase) {
          setProducts(defaultProducts);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error || !data || data.length === 0) {
          // If no items in DB, fall back to default catalog
          setProducts(defaultProducts);
        } else {
          setProducts(data);
        }
      } catch (err) {
        setProducts(defaultProducts);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = ["All", "shopify", "aliexpress"];

  // Filter items
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.source === selectedCategory.toLowerCase();
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="w-full text-center py-20 text-silver/40 text-sm">
        Loading luxury inventory...
      </div>
    );
  }

  return (
    <div className="w-full py-16" id="products">
      {/* Category Tabs */}
      <div className="flex justify-center items-center gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 text-xs font-medium uppercase tracking-wider rounded-full transition-all duration-300 ${
              selectedCategory === cat
                ? "bg-white text-[#050505] font-bold"
                : "bg-white/5 text-silver/60 border border-white/5 hover:bg-white/10 hover:text-white"
            }`}
          >
            {cat === "shopify" ? "Shopify Live" : cat === "aliexpress" ? "AliExpress Feed" : "All Collections"}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-silver/30 text-sm">
          No luxury items matched your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
