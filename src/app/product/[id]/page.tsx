export const runtime = 'edge';

import { getProductById } from '../../../lib/products';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from '../../../components/AddToCartButton';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import CountdownTimer from '../../../components/CountdownTimer';
import StockStatus from '../../../components/StockStatus';
import WhatsAppBuyNow from '../../../components/WhatsAppBuyNow';
import LiveSync from '../../../components/LiveSync';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    return { title: 'Product Not Found - Aethex Store' };
  }

  return {
    title: `${product.title} | Aethex Store`,
    description: product.description || "Designed with premium precision and high quality engineering.",
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.image_url || "/placeholder-product.jpg"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
      images: [product.image_url || "/placeholder-product.jpg"],
    }
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    notFound();
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.image_url || "/placeholder-product.jpg",
    "description": product.description || "Designed with premium precision and high quality engineering.",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "LKR",
      "price": product.price,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-24 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-12 uppercase tracking-widest text-xs font-bold transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </Link>
      <div className="grid md:grid-cols-2 gap-16 items-start">
        {/* Left: Image */}
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5">
          <Image
            fill
            src={product.image_url || "/placeholder-product.jpg"}
            alt={product.title}
            className="object-cover"
          />
        </div>

        {/* Right: Info */}
        <div className="space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-white font-display">{product.title}</h1>
          <p className="text-xl text-white/60 leading-relaxed font-light">{product.description || "Designed with premium precision and high quality engineering."}</p>
          <div className="text-3xl font-bold text-white font-display">LKR {product.price.toLocaleString()}</div>
          
          <div className="pt-2">
            <StockStatus />
          </div>
          
          <div className="pt-6">
            <AddToCartButton product={product} />
            <WhatsAppBuyNow product={product} />
          </div>
          
          <LiveSync />
          
          <div className="pt-2">
            <CountdownTimer />
          </div>

          {/* Trust Badges */}
          <div className="pt-6 border-t border-white/10 mt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-sm text-white/60">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <span>Secure Encrypted Checkout</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/60">
              <Truck className="w-5 h-5 text-blue-400" />
              <span>Free Insured Shipping</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
