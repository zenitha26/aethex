import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import PageTransition from "../components/PageTransition";
import AdminShortcut from "../components/AdminShortcut";
import FloatingWhatsApp from "../components/FloatingWhatsApp";

// --- Fonts Configuration ---
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// --- SEO & Metadata ---
export const metadata: Metadata = {
  title: "AETHEX Store | Luxury Mechanical Keyboards & Workspace Peripherals",
  description: "Shop premium mechanical keyboards, acoustic modules, and workspace aesthetics at AETHEX. Elevate your setup today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* PWA Settings */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#050505" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />

        {/* Service Worker Registration for PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('SW registered successfully:', reg.scope))
                    .catch(err => console.error('SW registration failed:', err));
                });
              }
            `,
          }}
        />
      </head>
      <body className="antialiased bg-[#050505] text-white min-h-screen">
        <AdminShortcut />

        <div className="main-wrapper">
          {/* Animated Background Glows */}
          <div className="background-glows">
            <div className="glow-circle-1"></div>
            <div className="glow-circle-2"></div>
            <div className="glow-circle-3"></div>
          </div>

          {/* Main Content with Page Transitions */}
          <PageTransition>
            {children}
          </PageTransition>
          
          <FloatingWhatsApp />
        </div>
      </body>
    </html>
  );
}