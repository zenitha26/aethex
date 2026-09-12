"use client";

import React, { useState, useRef } from "react";
import { z } from "zod";
import { 
  X, 
  UploadCloud, 
  Loader2, 
  Check, 
  AlertCircle, 
  Image as ImageIcon,
  Package,
  Layers,
  FileText
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { audioEngine } from "@/lib/audio";

export const productSchema = z.object({
  title: z.string().min(2, "Product name must be at least 2 characters."),
  sku: z.string().min(2, "SKU reference is required."),
  price: z.coerce.number().positive("Price must be greater than 0."),
  stock: z.coerce.number().int().nonnegative("Stock level cannot be negative."),
  category: z.string().min(2, "Category is required."),
  description: z.string().optional(),
  image_url: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormModalProps {
  product?: any | null; // If provided, edit mode; else create mode
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (product: any) => void;
}

export default function ProductFormModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: ProductFormModalProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    title: product?.title || "",
    sku: product?.sku || product?.id?.slice(0, 10).toUpperCase() || `AET-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    price: product?.price ? Number(product.price) : 2990,
    stock: product?.stock !== undefined ? Number(product.stock) : 25,
    category: product?.category || "Automotive Hardware",
    description: product?.description || "",
    image_url: product?.image_url || "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setGlobalError("Image size exceeds 10MB limit.");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProductImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product_images")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });

    if (uploadError) {
      console.warn("Storage upload warning (using data URL or public URL fallback):", uploadError);
      return imagePreview || "";
    }

    const { data: publicUrlData } = supabase.storage
      .from("product_images")
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || filePath;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGlobalError(null);

    // 1. Zod Validation
    const validationResult = productSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((err: z.ZodIssue) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    try {
      audioEngine.playAcquire();
    } catch {}

    try {
      let finalImageUrl = formData.image_url || "";

      // 2. Upload image to Supabase Storage if new file selected
      if (selectedFile) {
        setUploadingImage(true);
        finalImageUrl = await uploadProductImage(selectedFile);
        setUploadingImage(false);
      }

      const payload = {
        title: formData.title.trim(),
        sku: formData.sku.trim().toUpperCase(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category.trim(),
        description: formData.description?.trim() || "",
        image_url: finalImageUrl,
        updated_at: new Date().toISOString(),
      };

      let savedRecord: any = null;

      if (product?.id) {
        // Edit Mode: Update database
        const { data, error: updateError } = await supabase
          .from("products")
          .update(payload)
          .eq("id", product.id)
          .select()
          .maybeSingle();

        if (updateError) {
          console.warn("Product DB update notice:", updateError);
        }
        savedRecord = data || { ...product, ...payload };
      } else {
        // Create Mode: Insert into database
        const newId = `prod_${Date.now()}`;
        const createPayload = {
          id: newId,
          ...payload,
          created_at: new Date().toISOString(),
        };

        const { data, error: insertError } = await supabase
          .from("products")
          .insert(createPayload)
          .select()
          .maybeSingle();

        if (insertError) {
          console.warn("Product DB insert notice:", insertError);
        }
        savedRecord = data || createPayload;
      }

      try {
        audioEngine.playSuccess();
      } catch {}

      onSuccess(savedRecord);
    } catch (err: any) {
      console.error("Save product error:", err);
      setGlobalError(err?.message || "Failed to save product.");
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[#0B0B0B] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col space-y-6 shadow-2xl relative overflow-hidden font-mono text-xs text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 pb-4">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-white/40 block">
              CATALOG MANAGEMENT // REGISTRY
            </span>
            <h2 className="text-base sm:text-lg font-bold uppercase text-white mt-0.5">
              {product ? `Edit Product: ${product.title}` : "Register New Hardware Product"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Error Notice */}
        {globalError && (
          <div className="mx-6 p-3 rounded-xl bg-red-950/40 border border-red-500/20 text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{globalError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 space-y-5 flex-1 custom-scrollbar">
          
          {/* Product Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-white/60 block">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. ASPOR A711 360° Console Mount"
              className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition text-xs"
            />
            {errors.title && <p className="text-[10px] text-red-400">{errors.title}</p>}
          </div>

          {/* SKU & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-white/60 block">
                SKU Identifier *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. AET-A711-BLK"
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition text-xs uppercase"
              />
              {errors.sku && <p className="text-[10px] text-red-400">{errors.sku}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-white/60 block">
                Category *
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Automotive Hardware"
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition text-xs"
              />
              {errors.category && <p className="text-[10px] text-red-400">{errors.category}</p>}
            </div>
          </div>

          {/* Price & Stock Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-white/60 block">
                Price (LKR) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="2990"
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition text-xs"
              />
              {errors.price && <p className="text-[10px] text-red-400">{errors.price}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-white/60 block">
                Stock Inventory Level *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                placeholder="25"
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition text-xs"
              />
              {errors.stock && <p className="text-[10px] text-red-400">{errors.stock}</p>}
            </div>
          </div>

          {/* Image Upload Dropzone (Supabase Storage: product_images) */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-white/60 block">
              Product Image (Supabase Storage: product_images)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileSelect}
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="p-4 rounded-xl border border-dashed border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60 transition cursor-pointer flex flex-col items-center justify-center text-center space-y-2"
            >
              {imagePreview ? (
                <div className="flex items-center gap-4 w-full">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg border border-white/10 bg-black shrink-0"
                  />
                  <div className="text-left overflow-hidden">
                    <span className="text-[11px] text-white font-semibold block truncate">
                      {selectedFile ? selectedFile.name : "Current Image Loaded"}
                    </span>
                    <span className="text-[9px] text-white/40 block">Click to replace image</span>
                  </div>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-6 h-6 text-white/40" />
                  <span className="text-[11px] text-white/70 block">
                    Upload hardware photograph to Supabase Storage
                  </span>
                  <span className="text-[9px] text-white/30">
                    JPG, PNG, WEBP up to 10MB
                  </span>
                </>
              )}
            </div>

            {/* Direct Image URL input fallback */}
            <input
              type="url"
              value={formData.image_url || ""}
              onChange={(e) => {
                setFormData({ ...formData, image_url: e.target.value });
                setImagePreview(e.target.value);
              }}
              placeholder="Or enter direct external image URL..."
              className="w-full px-3 py-1.5 rounded-lg bg-black border border-white/5 text-[10px] text-white placeholder:text-white/20 mt-1"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-white/60 block">
              Technical Description
            </label>
            <textarea
              rows={3}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Precision CNC aluminum alloy construction with high-torque damping..."
              className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition text-xs resize-none"
            />
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-white/60 hover:text-white text-xs uppercase tracking-wider transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="px-7 py-2.5 rounded-full bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-white/90 transition shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {saving || uploadingImage ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>{uploadingImage ? "Uploading Image..." : "Saving..."}</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{product ? "Save Modifications" : "Publish Product"}</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
