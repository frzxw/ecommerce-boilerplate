import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      
      <main className="pt-24 pb-12">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-8">About Us</h1>
          <p className="text-xl md:text-2xl text-gray-500 max-w-3xl leading-relaxed">
            We are a collective of designers, makers, and dreamers dedicated to the art of essential living.
          </p>
        </section>

        {/* Image Grid */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-[600px] w-full bg-zinc-100 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
                alt="Our Store"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-[600px] w-full bg-zinc-200 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80"
                alt="Our Process"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Manifesto */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8">Our Manifesto</h2>
          <p className="text-2xl md:text-4xl font-bold leading-tight tracking-tight mb-12">
            &quot;We believe that good design should be accessible, sustainable, and timeless. In a world of fast fashion and fleeting trends, we stand for permanence.&quot;
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div>
              <h3 className="font-bold uppercase tracking-widest mb-4">Quality</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Every stitch counts. We source the finest materials from around the globe to ensure our products stand the test of time.
              </p>
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-widest mb-4">Sustainability</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We are committed to reducing our footprint. From organic cottons to recycled packaging, we make choices that honor the planet.
              </p>
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-widest mb-4">Transparency</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Know who made your clothes. We partner with ethical factories and pay fair wages to every pair of hands that touches our garments.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
