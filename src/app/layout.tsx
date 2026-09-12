import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import Script from "next/script";
import "./globals.css";
import PageTransition from "../components/PageTransition";
import AdminShortcut from "../components/AdminShortcut";
import SmoothScroll from "../components/SmoothScroll";
import EditorialLoader from "../components/EditorialLoader";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import CartDrawer from "../components/CartDrawer";
import MobileBottomBar from "../components/MobileBottomBar";

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "AETHEX | Luxury Automotive Hardware & Tactical Cockpit Systems",
    template: "%s | AETHEX STORE",
  },
  description: "Bespoke engineered vehicle hardware, Qi2 fast charging active docks, titanium EDC precision tools, and lossless acoustic studio audio. Islandwide insured delivery across Sri Lanka.",
  keywords: [
    "AETHEX",
    "AETHEX STORE",
    "ASPOR A711",
    "Car phone mount Sri Lanka",
    "automotive cockpit mount",
    "Qi2 wireless car charger",
    "titanium EDC screwdriver",
    "lossless hi-fi earbuds",
    "Sri Lanka tech store",
    "luxury car accessories"
  ],
  authors: [{ name: "AETHEX Labs" }],
  creator: "AETHEX STORE",
  publisher: "AETHEX STORE",
  metadataBase: new URL("https://www.aethexstore.com"),
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AETHEX | Luxury Automotive Hardware & Tactical Cockpit Systems",
    description: "Bespoke engineered vehicle hardware, Qi2 fast charging active docks, titanium EDC precision tools, and lossless acoustic studio audio.",
    url: "https://www.aethexstore.com",
    siteName: "AETHEX STORE",
    images: [
      {
        url: "/images/a711/cockpit_matte.jpg",
        width: 1200,
        height: 630,
        alt: "AETHEX Luxury Automotive Hardware",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AETHEX | Luxury Automotive Hardware",
    description: "Bespoke engineered vehicle hardware, Qi2 docks, and titanium tools.",
    images: ["/images/a711/cockpit_matte.jpg"],
    creator: "@aethexstore",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-AETHEX0000";
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "123456789012345";
  const tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "C1234567890";

  return (
    <html lang="en">
      <body className="antialiased bg-[#050505] text-white min-h-screen relative overflow-x-hidden selection:bg-white selection:text-black font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.aethexstore.com/#organization",
                  "name": "AETHEX STORE",
                  "url": "https://www.aethexstore.com",
                  "logo": "https://www.aethexstore.com/images/a711/cockpit_matte.jpg",
                  "description": "Luxury automotive hardware and tactical cockpit systems in Sri Lanka.",
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+94770000000",
                    "contactType": "customer service",
                    "areaServed": "LK",
                    "availableLanguage": ["English", "Sinhala"]
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.aethexstore.com/#website",
                  "url": "https://www.aethexstore.com",
                  "name": "AETHEX STORE",
                  "publisher": { "@id": "https://www.aethexstore.com/#organization" },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.aethexstore.com/?search={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                }
              ]
            })
          }}
        />
        <a href="#main-content" className="sr-only focus:not-sr-only">Skip to Content</a>

        <EditorialLoader />
        <AdminShortcut />
        <Suspense fallback={null}>
          <CartDrawer />
        </Suspense>

        <div className="main-wrapper">
          <main id="main-content">
            <SmoothScroll>
              <PageTransition>
                {children}
              </PageTransition>
            </SmoothScroll>
          </main>
        </div>

        {/* Global Floating WhatsApp Support Widget */}
        <Suspense fallback={null}>
          <FloatingWhatsApp />
        </Suspense>

        {/* Global Sticky Mobile Navigation Bar with Checkout CTAs */}
        <Suspense fallback={null}>
          <MobileBottomBar />
        </Suspense>

        {/* Asynchronous Non-Blocking Analytics Scripts */}
        {/* 1. Google Analytics 4 (GA4) */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        />
        <Script
          id="google-analytics-init"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* 2. Meta Pixel (Facebook) */}
        <Script
          id="meta-pixel-init"
          strategy="afterInteractive"
        >
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* 3. TikTok Pixel */}
        <Script
          id="tiktok-pixel-init"
          strategy="afterInteractive"
        >
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
              var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var a=document.createElement("script")
              ;a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c)};
              ttq.load('${tiktokPixelId}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      </body>
    </html>
  );
}