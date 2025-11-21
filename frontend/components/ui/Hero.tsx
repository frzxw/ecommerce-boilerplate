import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative h-[90vh] w-full bg-zinc-200 overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
        <span className="inline-block mb-4 text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white/90 border border-white/30 px-4 py-2 backdrop-blur-sm">
          Spring / Summer 2025
        </span>
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 uppercase text-white drop-shadow-lg">
          Essential<br />Minimalism
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-xl mx-auto text-white/90 font-light leading-relaxed">
          Curated essentials for the modern wardrobe. Uncompromising quality, sustainable materials, and timeless design.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/products" 
            className="bg-white text-black px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-zinc-100 transition-colors min-w-[200px]"
          >
            Shop Collection
          </Link>
          <Link 
            href="/about" 
            className="bg-transparent border border-white text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-colors min-w-[200px]"
          >
            Read Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
