import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aethex Store | Luxury Dropshipping eCommerce Platform",
  description: "Shop premium mechanical keyboards, audiophile headsets, and high-performance dropshipping gear at Aethex Store. Elevate your setup today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="main-wrapper">
          <div className="background-glows">
            <div className="glow-circle-1"></div>
            <div className="glow-circle-2"></div>
            <div className="glow-circle-3"></div>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
