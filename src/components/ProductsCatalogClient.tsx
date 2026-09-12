"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Product } from "../types/product";
import Navbar from "./Navbar";
import CategoryDrawer from "./CategoryDrawer";
import WishlistDrawer from "./WishlistDrawer";
import CompareModal from "./CompareModal";
import QuickViewModal from "./QuickViewModal";
import CartDrawer from "./CartDrawer";
import CartToast from "./CartToast";
import MobileBottomBar from "./MobileBottomBar";
import StoreProductGrid from "./StoreProductGrid";
import ValueProps from "./ValueProps";
import Footer from "./Footer";
import { useCartStore } from "../store/useCartStore";

interface ProductsCatalogClientProps {
  products: Product[];
}

export default function ProductsCatalogClient({ products }: ProductsCatalogClientProps) {
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { selectedCategory, setSelectedCategory } = useCartStore();

  return (
    <div className="bg-[#F9F9F9] text-[#111111] min-h-screen font-sans selection:bg-black selection:text-white">
      {/* Floating Unified Navbar */}
      <Navbar onOpenCategories={() => setIsCategoryDrawerOpen(true)} />

      {/* Modals & Drawers */}
      <CategoryDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        selectedCategory={selectedCategory}
      />
      <WishlistDrawer />
      <CompareModal />
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
      <CartDrawer />
      <CartToast />
      <MobileBottomBar onOpenCategories={() => setIsCategoryDrawerOpen(true)} />

      {/* Breadcrumb Header */}
      <div className="border-b border-gray-200 bg-white py-4 px-6 sm:px-10 lg:px-12 text-xs font-mono">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-black uppercase font-bold">Catalog</span>
          </div>

          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
            ALL HARDWARE & GADGETS
          </span>
        </div>
      </div>

      {/* Value Proposition Bar */}
      <ValueProps />

      {/* Store Product Grid with Filters & Sort */}
      <StoreProductGrid
        products={products}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
