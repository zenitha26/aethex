"use client";

import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, Search, Edit2 } from "lucide-react";
import ProductEditModal from "../../../components/ProductEditModal";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      
      if (data.success) {
        setProducts(data.products || []);
      } else {
        throw new Error(data.error || "Failed to load products");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 0 }).format(amount);
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-silver/60 gap-4">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <p className="text-xs uppercase tracking-widest">Loading Catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/20 rounded-2xl text-xs text-red-400 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display">Products Catalog</h2>
          <p className="text-xs text-silver/60 font-light">
            Manage your Shopify products directly from this panel.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-silver/40 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <div key={p.id} className="luxury-glass p-5 rounded-2xl flex flex-col justify-between gap-4 transition-transform duration-300 hover:scale-[1.02] group relative">
            <div className="absolute top-7 right-7 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setEditingProduct(p)}
                className="p-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-colors"
                title="Edit Product"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div 
                className="h-32 bg-black/40 rounded-xl flex items-center justify-center border border-white/5 relative overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: p.image_url ? `url(${p.image_url})` : "none" }}
              >
                {!p.image_url && <span className="text-[9px] uppercase tracking-widest text-silver/30 font-extrabold">No Image</span>}
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-white/30 border border-white/10 px-1.5 py-0.5 rounded font-semibold uppercase">
                  {p.source || 'Shopify'}
                </span>
                <h4 className="text-white text-sm font-semibold truncate mt-1">{p.title}</h4>
                <p className="text-silver/50 text-xs font-light line-clamp-2 leading-relaxed" 
                   dangerouslySetInnerHTML={{ __html: p.description || '' }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-silver/40 block">Price</span>
                <span className="text-white text-sm font-bold">{formatLKR(p.price)}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-silver/40 block">Inventory</span>
                <span className="text-white/80 text-sm font-mono">{p.stock} in stock</span>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-12 text-center text-silver/40 border border-dashed border-white/10 rounded-2xl">
            No products found matching "{searchQuery}"
          </div>
        )}
      </div>

      {editingProduct && (
        <ProductEditModal 
          product={editingProduct} 
          onClose={() => setEditingProduct(null)} 
          onSuccess={() => {
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}
