"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface ProductEditModalProps {
  product: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductEditModal({ product, onClose, onSuccess }: ProductEditModalProps) {
  const [imageUrl, setImageUrl] = useState(product.image_url || "");
  const [stock, setStock] = useState(product.stock || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          image_url: imageUrl,
          stock: parseInt(stock.toString(), 10)
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update product");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Edit Product</h3>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Product Title (Read-only)</label>
            <input 
              type="text" 
              value={product.title} 
              disabled 
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Image URL</label>
            <input 
              type="url" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 bg-black/50 border border-white/20 focus:border-white/40 rounded-xl text-white outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Stock Quantity</label>
            <input 
              type="number" 
              value={stock} 
              onChange={(e) => setStock(e.target.value)}
              min="0"
              className="w-full px-4 py-2.5 bg-black/50 border border-white/20 focus:border-white/40 rounded-xl text-white outline-none transition-colors"
            />
            <p className="text-xs text-white/40 mt-1">Updates available stock in Shopify.</p>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium bg-white text-black hover:bg-white/90 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
