export const runtime = 'edge';

import { Metadata } from 'next';
import { getProductById } from "@/lib/products";
import AsporA711Client from "@/components/AsporA711Client";
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: "ASPOR A711 360° Adjustable Car Phone Holder | AETHEX Automotive",
  description: "Engineered for vehicle cup-holders. 360° rotation, 180° adjustable arm, universal 4-7\" smartphone fit. Islandwide delivery in Sri Lanka. Rs. 2,990.",
  openGraph: {
    title: "ASPOR A711 360° Adjustable Car Phone Holder | AETHEX Automotive",
    description: "Engineered for vehicle cup-holders. 360° rotation, 180° adjustable arm, universal 4-7\" smartphone fit. Islandwide delivery.",
    url: "https://www.aethexstore.com/products/aspor-a711",
    siteName: "AETHEX Store",
    images: [
      {
        url: "/images/a711/cockpit_matte.jpg",
        width: 1440,
        height: 1080,
        alt: "ASPOR A711 360° Car Phone Holder Cockpit View",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASPOR A711 360° Adjustable Car Phone Holder | AETHEX",
    description: "Engineered for vehicle cup-holders. 360° rotation, 180° adjustable arm. Rs. 2,990.",
    images: ["/images/a711/cockpit_matte.jpg"],
  }
};

export default async function AsporA711Page() {
  const product = await getProductById("aspor-a711");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "ASPOR A711 360° Adjustable Car Phone Holder",
    "image": ["https://www.aethexstore.com/images/a711/hero.jpg"],
    "description": "Engineered for vehicle cup-holders. 360° rotation, 180° adjustable arm, universal 4-7\" smartphone fit. Islandwide delivery in Sri Lanka.",
    "brand": {
      "@type": "Brand",
      "name": "ASPOR / AETHEX Automotive"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://www.aethexstore.com/products/aspor-a711",
      "priceCurrency": "LKR",
      "price": "2990",
      "priceValidUntil": "2027-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AsporA711Client product={product || undefined} />
    </>
  );
}
