import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import PageTransition from "../components/PageTransition";
import AdminShortcut from "../components/AdminShortcut";
import SmoothScroll from "../components/SmoothScroll";
import EditorialLoader from "../components/EditorialLoader";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import CartDrawer from "../components/CartDrawer";
import MobileBottomBar from "../components/MobileBottomBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AETHEX | Precision Automotive Hardware & Cockpit Ergonomics",
  description: "Engineered vehicle hardware. Drop 01: ASPOR A711 360° Adjustable Car Phone Holder. Direct bank transfer checkout & islandwide delivery across Sri Lanka.",
  metadataBase: new URL("https://www.aethexstore.com"),
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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#050505" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="antialiased bg-[#050505] text-white min-h-screen relative overflow-x-hidden selection:bg-white selection:text-black font-sans">
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