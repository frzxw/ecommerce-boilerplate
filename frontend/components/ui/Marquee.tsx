'use client';

import { useCart } from '@/context/CartContext';

export function Marquee() {
  const { isCartOpen } = useCart();

  if (isCartOpen) return null;

  return (
    <div className="hidden md:block fixed top-0 left-0 right-0 z-[60] bg-black text-white py-3 overflow-hidden whitespace-nowrap border-b border-white/10 h-10">
      <div className="inline-block animate-marquee">
        <span className="mx-8 text-xs font-bold uppercase tracking-widest">Free Worldwide Shipping on Orders Over $200</span>
        <span className="mx-8 text-xs font-bold uppercase tracking-widest">•</span>
        <span className="mx-8 text-xs font-bold uppercase tracking-widest">New Arrivals Just Dropped</span>
        <span className="mx-8 text-xs font-bold uppercase tracking-widest">•</span>
        <span className="mx-8 text-xs font-bold uppercase tracking-widest">Sustainable Materials</span>
        <span className="mx-8 text-xs font-bold uppercase tracking-widest">•</span>
        <span className="mx-8 text-xs font-bold uppercase tracking-widest">30-Day Returns</span>
        <span className="mx-8 text-xs font-bold uppercase tracking-widest">•</span>
        {/* Duplicate for seamless loop */}
        <span className="mx-8 text-xs font-bold uppercase tracking-widest">Free Worldwide Shipping on Orders Over $200</span>
        <span className="mx-8 text-xs font-bold uppercase tracking-widest">•</span>
        <span className="mx-8 text-xs font-bold uppercase tracking-widest">New Arrivals Just Dropped</span>
        <span className="mx-8 text-xs font-bold uppercase tracking-widest">•</span>
        <span className="mx-8 text-xs font-bold uppercase tracking-widest">Sustainable Materials</span>
        <span className="mx-8 text-xs font-bold uppercase tracking-widest">•</span>
        <span className="mx-8 text-xs font-bold uppercase tracking-widest">30-Day Returns</span>
      </div>
    </div>
  );
}
