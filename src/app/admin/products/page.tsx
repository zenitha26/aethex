"use client";

import React, { useState, useEffect } from "react";
import { 
  Loader2, 
  AlertCircle, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Package, 
  Layers, 
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink
} from "lucide-react";
import ProductFormModal from "@/components/admin/ProductFormModal";
import { audioEngine } from "@/lib/audio";

interface Product {
  id: string;
  title: string;
  sku?: string;
  price: number;
  original_price?: number;
  stock: number;
  category?: string;
  description?: string;
  image_url?: string;
  source?: string;
  created_at?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
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
    return new Intl.NumberFormat("en-LK", { 
      style: "currency", 
      currency: "LKR", 
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently decommission product "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      audioEngine.playAcquire();
    } catch {}

    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        try {
          audioEngine.playSuccess();
        } catch {}
      } else {
        alert(data.error || "Failed to delete product.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenCreateModal = () => {
    try {
      audioEngine.playAcquire();
    } catch {}
    setActiveProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    try {
      audioEngine.playAcquire();
    } catch {}
    setActiveProduct(product);
    setIsModalOpen(true);
  };

  const handleModalSuccess = (savedProduct: Product) => {
    setIsModalOpen(false);
    setActiveProduct(null);
    fetchProducts();
  };

  // Derive categories
  const categories = Array.from(new Set(products.map((p) => p.category || "Hardware").filter(Boolean)));

  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || (p.category || "Hardware") === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative font-sans text-white">
      {/* Top Banner / Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0B0B0B] border border-white/5 backdrop-blur-xl">
          <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 block">
            Total Hardware Units
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-bold text-white">{products.length}</span>
            <span className="text-xs font-mono text-white/50">Active SKUs</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0B0B] border border-white/5 backdrop-blur-xl">
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400/80 block">
            Low Stock Threshold (&lt;=10)
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-bold text-amber-400">{lowStockCount}</span>
            <span className="text-xs font-mono text-amber-400/60">Restock Soon</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0B0B] border border-white/5 backdrop-blur-xl">
          <span className="text-[10px] uppercase font-mono tracking-widest text-red-400/80 block">
            Exhausted Stock (0 Units)
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-bold text-red-400">{outOfStockCount}</span>
            <span className="text-xs font-mono text-red-400/60">Backorders Only</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/20 rounded-2xl text-xs text-red-400 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pt-2">
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-tight">Product & Inventory Registry</h2>
          <p className="text-xs text-white/50 font-light mt-1">
            Enterprise catalog data table with real-time Supabase storage synchronization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search SKU or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-[#0B0B0B] border border-white/10 rounded-xl text-xs text-white/80 focus:outline-none focus:border-white/30 transition-colors font-mono"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Create Product Button */}
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-white/90 transition shadow-lg flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Product</span>
          </button>
        </div>
      </div>

      {/* Robust Data Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0B0B0B] backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] uppercase font-mono tracking-wider text-white/40">
                <th className="py-4 px-5">Hardware Image</th>
                <th className="py-4 px-5">Product Name & Category</th>
                <th className="py-4 px-5">SKU Reference</th>
                <th className="py-4 px-5">Unit Price (LKR)</th>
                <th className="py-4 px-5">Stock Level</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-white/40">
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span className="font-mono text-xs uppercase tracking-wider">Loading Inventory Data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-white/40 font-mono text-xs">
                    No hardware units match the query "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const skuCode = p.sku || `AET-${p.id.slice(0, 6).toUpperCase()}`;
                  const isLow = p.stock > 0 && p.stock <= 10;
                  const isOut = p.stock <= 0;

                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Product Image Thumbnail */}
                      <td className="py-3 px-5">
                        <div className="w-12 h-12 rounded-xl bg-black border border-white/10 overflow-hidden relative flex items-center justify-center shrink-0">
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-white/20" />
                          )}
                        </div>
                      </td>

                      {/* Name & Category */}
                      <td className="py-3 px-5">
                        <div className="space-y-1">
                          <span className="font-medium text-white block max-w-xs truncate" title={p.title}>
                            {p.title}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-white/60">
                              {p.category || "Hardware"}
                            </span>
                            {p.source && (
                              <span className="text-[9px] font-mono text-white/30 uppercase">
                                {p.source}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-5 font-mono text-xs text-white/80">
                        <span className="bg-black/60 px-2 py-1 rounded border border-white/5">
                          {skuCode}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-5 font-mono text-xs font-semibold text-white">
                        {formatLKR(p.price)}
                        {p.original_price && p.original_price > p.price && (
                          <span className="block text-[10px] text-white/30 line-through">
                            {formatLKR(p.original_price)}
                          </span>
                        )}
                      </td>

                      {/* Stock Level */}
                      <td className="py-3 px-5 font-mono">
                        <div className="flex items-center gap-2">
                          {isOut ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-red-950/40 text-red-400 border border-red-500/20">
                              <XCircle className="w-3 h-3" />
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-amber-950/40 text-amber-400 border border-amber-500/20">
                              <AlertTriangle className="w-3 h-3" />
                              {p.stock} Units Left
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" />
                              {p.stock} In Stock
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition border border-white/10"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.title)}
                            disabled={deletingId === p.id}
                            className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-red-400/80 hover:text-red-300 transition border border-red-500/10 disabled:opacity-40"
                            title="Decommission Product"
                          >
                            {deletingId === p.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-4 border-t border-white/10 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-white/40 gap-2">
          <span>Showing {filteredProducts.length} of {products.length} registered products</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Supabase Database Sync Active
          </span>
        </div>
      </div>

      {/* Modal with Zod Validation and Supabase Storage */}
      <ProductFormModal
        isOpen={isModalOpen}
        product={activeProduct}
        onClose={() => {
          setIsModalOpen(false);
          setActiveProduct(null);
        }}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
