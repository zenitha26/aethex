export const runtime = 'edge';

import { getProductById } from '../../../lib/products';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import ProductTabs from '../../../components/ProductTabs';
import ProductHero from '../../../components/ProductHero';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id);
  const product = await getProductById(decodedId);

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
  const decodedId = decodeURIComponent(resolvedParams.id);
  const product = await getProductById(decodedId);

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
      <ProductHero product={product} />

      {/* Tabs Section */}
      <ProductTabs product={product} />
    </main>
  );
}
