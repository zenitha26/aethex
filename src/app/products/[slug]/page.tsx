import { getProductById } from '@/lib/products';
import { mockProducts } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';
import { Metadata, ResolvingMetadata } from 'next';

export function generateStaticParams() {
  return mockProducts.map((product) => ({
    slug: product.id,
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const product = await getProductById(decodedSlug);

  if (!product) {
    return { title: 'Product Not Found | AETHEX Store' };
  }

  return {
    title: `${product.title} | AETHEX Automotive Hardware`,
    description: product.description || "Precision engineered hardware curated by AETHEX STORE.",
    alternates: {
      canonical: `https://www.aethexstore.com/products/${product.id}`,
    },
    openGraph: {
      title: `${product.title} | AETHEX`,
      description: product.description,
      images: [product.image_url || "/images/a711/cockpit_matte.jpg"],
      url: `https://www.aethexstore.com/products/${product.id}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
      images: [product.image_url || "/images/a711/cockpit_matte.jpg"],
    }
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const product = await getProductById(decodedSlug);

  if (!product) {
    notFound();
  }

  // Get related products from the same category or overall catalog
  const relatedProducts = mockProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": [product.image_url || "/images/a711/cockpit_matte.jpg"],
    "description": product.description || "Precision engineered hardware curated by AETHEX STORE.",
    "sku": product.sku || `AET-${product.id.slice(0, 8).toUpperCase()}`,
    "brand": {
      "@type": "Brand",
      "name": "AETHEX Automotive"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.aethexstore.com/products/${encodeURIComponent(product.id)}`,
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
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
