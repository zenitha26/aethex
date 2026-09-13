import { getProducts } from "@/lib/products";
import ProductsCatalogClient from "../../components/ProductsCatalogClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Products & Tech Hardware | AETHEX Store",
  description: "Browse the complete AETHEX catalog. Mobile accessories, audio hardware, power tools, home appliances, and precision automotive mounts. Islandwide Cash on Delivery across Sri Lanka.",
};

export default async function ProductsCatalogPage() {
  const products = await getProducts();

  return <ProductsCatalogClient products={products} />;
}

