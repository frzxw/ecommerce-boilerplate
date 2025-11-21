'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import Image from 'next/image';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  { term: 'New Arrivals', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80' },
  { term: 'Accessories', image: 'https://images.unsplash.com/photo-1523293188086-c15be412603a?auto=format&fit=crop&w=400&q=80' },
  { term: 'T-Shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80' },
  { term: 'Sale', image: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=400&q=80' },
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Prevent scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[-1] bg-white/95 backdrop-blur-md animate-in fade-in duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col pt-32">
        {/* Search Input */}
        <div className="flex-1 flex flex-col">
          <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto relative mb-16">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH..."
              className="w-full bg-transparent border-b-2 border-black py-4 text-4xl md:text-6xl font-black uppercase tracking-tighter placeholder-gray-200 focus:outline-none transition-colors"
            />
            <button 
              type="submit"
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:opacity-70 transition-opacity"
            >
              <ArrowRight className="w-8 h-8 md:w-12 md:h-12" />
            </button>
          </form>
          
          <div className="w-full max-w-6xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">Trending Now</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {POPULAR_SEARCHES.map((item) => (
                <button
                  key={item.term}
                  onClick={() => {
                    setQuery(item.term);
                    router.push(`/products?search=${encodeURIComponent(item.term)}`);
                    onClose();
                  }}
                  className="group relative aspect-3/4 w-full overflow-hidden bg-gray-100 text-left"
                >
                  <Image
                    src={item.image}
                    alt={item.term}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <span className="text-white font-bold uppercase tracking-widest text-sm md:text-base drop-shadow-md">
                      {item.term}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
