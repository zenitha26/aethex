import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About AETHEX | Automotive Engineering & Cockpit Architecture",
  description: "AETHEX is an independent automotive hardware brand curating precision-engineered cockpit accessories for Sri Lankan drivers. Discover our engineering philosophy, vehicle verification tests, and brand standards.",
};

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
