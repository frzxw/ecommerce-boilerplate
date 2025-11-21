'use client';

import Link from 'next/link';
import { Instagram, Twitter, Facebook, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function Footer() {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);

  return (
    <footer className="bg-white text-black py-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-tighter uppercase mb-6 block">STORE</Link>
            <p className="text-muted-foreground max-w-sm mb-8">
              Elevating the everyday through minimalist design and exceptional quality.
            </p>
            <div className="flex gap-4">
              {/* Social Icons */}
              <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Shop Section */}
          <div className="border-b md:border-none border-gray-100 pb-4 md:pb-0">
            <button 
              onClick={() => setIsShopOpen(!isShopOpen)}
              className="flex justify-between items-center w-full md:cursor-default"
            >
              <h3 className="font-bold uppercase tracking-widest text-xs mb-0 md:mb-6">Shop</h3>
              <ChevronDown className={`w-4 h-4 md:hidden transition-transform ${isShopOpen ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-4 text-sm text-muted-foreground mt-4 md:block ${isShopOpen ? 'block' : 'hidden'}`}>
              <li><Link href="/products" className="hover:text-black transition-colors">All Products</Link></li>
              <li><Link href="/products?category=new" className="hover:text-black transition-colors">New Arrivals</Link></li>
              <li><Link href="/products?category=accessories" className="hover:text-black transition-colors">Accessories</Link></li>
              <li><Link href="/products?category=sale" className="hover:text-black transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* Customer Care Section */}
          <div className="border-b md:border-none border-gray-100 pb-4 md:pb-0">
            <button 
              onClick={() => setIsCareOpen(!isCareOpen)}
              className="flex justify-between items-center w-full md:cursor-default"
            >
              <h3 className="font-bold uppercase tracking-widest text-xs mb-0 md:mb-6">Customer Care</h3>
              <ChevronDown className={`w-4 h-4 md:hidden transition-transform ${isCareOpen ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-4 text-sm text-muted-foreground mt-4 md:block ${isCareOpen ? 'block' : 'hidden'}`}>
              <li><Link href="#" className="hover:text-black transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Size Guide</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground uppercase tracking-wider">
          <p>&copy; 2025 STORE. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-black">Privacy Policy</Link>
            <Link href="#" className="hover:text-black">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
