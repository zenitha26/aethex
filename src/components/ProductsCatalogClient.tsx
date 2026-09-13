"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Product } from "../types/product";
import Navbar from "./Navbar";
import CategoryDrawer from "./CategoryDrawer";
import WishlistDrawer from "./WishlistDrawer";
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
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-white selection:text-black">
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
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
      <CartDrawer />
      <CartToast />
      <MobileBottomBar onOpenCategories={() => setIsCategoryDrawerOpen(true)} />

      {/* Breadcrumb Header */}
      <div className="border-b border-white/10 bg-[#0B0B0B] py-4 px-6 sm:px-10 lg:px-12 text-xs font-mono">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/50">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>HOME</span>
            </Link>
            <span>/</span>
            <span className="text-white uppercase font-bold tracking-widest">HARDWARE CATALOG</span>
          </div>

          <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-semibold hidden sm:inline-block">
            AUTHENTIC SPECIFICATION // ALL UNITS
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
