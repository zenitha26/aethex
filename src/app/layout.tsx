import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import PageTransition from "../components/PageTransition";
import AdminShortcut from "../components/AdminShortcut";
import SmoothScroll from "../components/SmoothScroll";
import EditorialLoader from "../components/EditorialLoader";
import FloatingWhatsApp from "../components/FloatingWhatsApp";

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
  description: "Engineered vehicle hardware. Drop 01: ASPOR A711 360° Adjustable Car Phone Holder. Direct WhatsApp ordering & islandwide delivery across Sri Lanka.",
  metadataBase: new URL("https://www.aethexstore.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="antialiased bg-white text-[#111111] min-h-screen relative overflow-x-hidden selection:bg-black selection:text-white">
        <a href="#main-content" className="sr-only focus:not-sr-only">Skip to Content</a>

        <EditorialLoader />
        <AdminShortcut />
        <FloatingWhatsApp />

        <div className="main-wrapper">
          <main id="main-content">
            <SmoothScroll>
              <PageTransition>
                {children}
              </PageTransition>
            </SmoothScroll>
          </main>
        </div>
      </body>
    </html>
  );
}