import { getProductById } from '../../../lib/products';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from '../../../components/AddToCartButton';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-24 min-h-screen">
      <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-12 uppercase tracking-widest text-xs font-bold transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </Link>
      <div className="grid md:grid-cols-2 gap-16 items-start">
        {/* Left: Image */}
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5">
          <Image
            fill
            src={product.image_url || "/placeholder-product.jpg"}
            alt={product.title}
            className="object-cover"
          />
        </div>

        {/* Right: Info */}
        <div className="space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-white font-display">{product.title}</h1>
          <p className="text-xl text-white/60 leading-relaxed font-light">{product.description || "Designed with premium precision and high quality engineering."}</p>
          <div className="text-3xl font-bold text-white font-display">LKR {product.price.toLocaleString()}</div>
          
          <div className="pt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}
