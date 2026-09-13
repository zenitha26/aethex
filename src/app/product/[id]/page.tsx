import { permanentRedirect } from 'next/navigation';

export default async function LegacyProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  permanentRedirect(`/products/${resolvedParams.id}`);
}
