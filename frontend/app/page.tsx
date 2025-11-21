import { fetchAPI } from '@/lib/api';
import { Product } from '@/lib/types';
import { Navbar } from '@/components/ui/Navbar';
import { ProductCard } from '@/components/ui/ProductCard';
import { Hero } from '@/components/ui/Hero';
import { Marquee } from '@/components/ui/Marquee';
import { Footer } from '@/components/ui/Footer';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let products: Product[] = [];
  try {
    products = await fetchAPI('/products');
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-black selection:text-white">
      <Marquee />
      <Navbar />
      
      <main>
        <Hero />

        {/* Collections Grid */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-[600px] bg-zinc-100 group overflow-hidden cursor-pointer">
              <Image
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80"
                alt="New Arrivals"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 flex flex-col justify-end p-12">
                <h3 className="text-3xl font-bold uppercase tracking-tighter mb-2 text-white drop-shadow-md">New Arrivals</h3>
                <Link href="/products" className="text-sm font-bold uppercase tracking-widest underline underline-offset-4 text-white hover:text-gray-200 transition-colors drop-shadow-md">Shop Now</Link>
              </div>
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="relative bg-zinc-100 group overflow-hidden cursor-pointer">
                <Image
                  src="https://images.unsplash.com/photo-1523293188086-c15be412603a?auto=format&fit=crop&w=800&q=80"
                  alt="Accessories"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="text-2xl font-bold uppercase tracking-tighter mb-2 text-white drop-shadow-md">Accessories</h3>
                  <Link href="/products?category=accessories" className="text-xs font-bold uppercase tracking-widest underline underline-offset-4 text-white drop-shadow-md">Explore</Link>
                </div>
              </div>
              <div className="relative bg-zinc-100 group overflow-hidden cursor-pointer">
                <Image
                  src="https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=800&q=80"
                  alt="Sale"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="text-2xl font-bold uppercase tracking-tighter mb-2 text-white drop-shadow-md">Sale</h3>
                  <Link href="/products?category=sale" className="text-xs font-bold uppercase tracking-widest underline underline-offset-4 text-white drop-shadow-md">View Offers</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Curated For You</span>
              <h2 className="text-4xl font-bold tracking-tighter uppercase">Trending Now</h2>
            </div>
            <Link href="/products" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-muted-foreground transition-colors">
              View All Products
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-32 bg-gray-50">
              <p className="text-xl font-medium mb-2">No products found</p>
              <p className="text-gray-500 mb-6">Ensure the backend is running and seeded.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Editorial / Story Section */}
        <section className="bg-black text-white py-32 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-8">Designed for Longevity</h2>
            <p className="text-lg md:text-xl text-zinc-400 mb-12 leading-relaxed">
              We believe in a world where less is more. Our collections are crafted with the finest materials, designed to last beyond the season. Sustainability is not just a buzzword; it&apos;s our core philosophy.
            </p>
            <Link href="/about" className="inline-block border border-white px-12 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
              Read Our Manifesto
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
