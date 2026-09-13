import { getProductById } from '../../../lib/products';
import { mockProducts } from '../../../lib/mockData';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import ProductDetailClient from '../../../components/ProductDetailClient';
import { Metadata, ResolvingMetadata } from 'next';

export function generateStaticParams() {
  return mockProducts.map((product) => ({
    id: product.id,
  }));
}

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
    "image": [product.image_url || "/placeholder-product.jpg"],
    "description": product.description || "Precision engineered hardware curated by AETHEX STORE.",
    "sku": product.sku || `AET-${product.id.slice(0, 8).toUpperCase()}`,
    "brand": {
      "@type": "Brand",
      "name": "AETHEX Automotive"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.aethexstore.com/product/${encodeURIComponent(product.id)}`,
      "priceCurrency": "LKR",
      "price": product.price,
      "priceValidUntil": "2027-12-31",
      "availability": (product.stock ?? 1) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
