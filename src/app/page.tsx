export const runtime = 'edge';

import { getProducts } from "@/lib/products";
import HomeClient from "../components/HomeClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AETHEX — Premium Automotive Hardware",
  description: "ASPOR A711 360° Adjustable Car Phone Holder. Engineered for vehicle cup-holders with 180° articulating arm and rock-solid mechanical expansion. Available now at www.aethexstore.com.",
  openGraph: {
    title: "AETHEX — Premium Automotive Hardware",
    description: "ASPOR A711 360° Adjustable Car Phone Holder. Engineered for vehicle cup-holders with 180° articulating arm and rock-solid mechanical expansion.",
    url: "https://www.aethexstore.com",
    siteName: "AETHEX Store",
    images: [
      {
        url: "/images/a711/cockpit_matte.jpg",
        width: 1200,
        height: 900,
        alt: "AETHEX ASPOR A711 Car Phone Holder",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AETHEX — Premium Automotive Hardware",
    description: "ASPOR A711 360° Adjustable Car Phone Holder. Rs. 2,990 + Delivery.",
    images: ["/images/a711/cockpit_matte.jpg"],
  }
};

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "name": "AETHEX Store",
                "url": "https://www.aethexstore.com",
                "logo": "https://www.aethexstore.com/images/a711/cockpit_matte.jpg",
                "description": "Premium automotive hardware brand based in Sri Lanka.",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Colombo",
                  "addressCountry": "LK"
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+94-78-234-9954",
                  "contactType": "customer service"
                }
              },
              {
                "@type": "Product",
                "name": "ASPOR A711 360° Adjustable Car Phone Holder",
                "image": "https://www.aethexstore.com/images/a711/cockpit_matte.jpg",
                "description": "Car cup-holder phone mount with 360° rotation and 180° adjustable arm.",
                "offers": {
                  "@type": "Offer",
                  "price": "2990",
                  "priceCurrency": "LKR",
                  "availability": "https://schema.org/InStock"
                }
              }
            ]
          })
        }}
      />
      <HomeClient initialProducts={products} />
    </>
  );
}
