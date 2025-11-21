import { fetchAPI } from '@/lib/api';
import { Product } from '@/lib/types';
import { Navbar } from '@/components/ui/Navbar';
import { ProductView } from '@/components/product/ProductView';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  let product: Product | null = null;

  try {
    product = await fetchAPI(`/products/${id}`);
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white text-black font-sans">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 pt-24">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">Product Not Found</h1>
          <p className="text-gray-500 mb-8 text-center max-w-md">
            The product you are looking for might have been removed or is temporarily unavailable.
          </p>
          <Link 
            href="/products" 
            className="px-8 py-4 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </nav>

        <ProductView product={product} />
      </main>
    </div>
  );
}
