export const runtime = 'edge';

import { getProductById } from '../../../lib/products';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import ProductDetailClient from '../../../components/ProductDetailClient';
import AsporA711Client from '../../../components/AsporA711Client';
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {product.id === "aspor-a711" ? (
        <AsporA711Client product={product} />
      ) : (
        <ProductDetailClient product={product} />
      )}
    </>
  );
}
