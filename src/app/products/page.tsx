import Navbar from "../../components/Navbar";
import ProductGrid from "../../components/ProductGrid";
import CartDrawer from "../../components/CartDrawer";
import Footer from "../../components/Footer";
import Link from "next/link";
import { getProducts } from "@/lib/products";

export default async function ProductsCatalogPage() {
  const products = await getProducts();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="ambient-blob blob-1"></div>
        <div className="ambient-blob blob-2"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] text-silver/40 uppercase tracking-widest font-semibold mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Catalog</span>
          </div>

          <div className="mb-12">
            <h1 className="text-white font-bold tracking-tighter text-6xl md:text-8xl mb-4">
              CATALOG
            </h1>
            <p className="text-silver/60 text-sm md:text-base max-w-lg font-light leading-relaxed">
              Curated precision gear, mechanical keyboards, custom audio setups, and desk modules built for elite workspaces.
            </p>
          </div>

          {/* Product list grid */}
          <ProductGrid initialProducts={products} />
        </div>
      </main>

      <CartDrawer />
      <Footer />
    </>
  );
}
