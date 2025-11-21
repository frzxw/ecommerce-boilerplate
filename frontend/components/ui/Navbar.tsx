'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MobileMenu } from './MobileMenu';
import { SearchOverlay } from './SearchOverlay';
import { ShoppingBag } from 'lucide-react';

export function Navbar() {
  const { totalItems, toggleCart, isCartOpen } = useCart();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine styles based on page and scroll state
  const navClasses = isSearchOpen
    ? 'bg-transparent text-black py-4'
    : isHome
      ? scrolled
        ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 py-4 text-black'
        : 'bg-transparent py-6 text-white'
      : 'bg-white/90 backdrop-blur-md border-b border-gray-100 py-4 text-black';

  if (isCartOpen && !isMobile) {
    return null;
  }

  return (
    <nav className={`fixed w-full transition-all duration-300 ${isSearchOpen ? 'z-70' : 'z-50'} ${isHome && !isSearchOpen ? 'top-0 md:top-10' : 'top-0'} ${navClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-8">
          {/* Left: Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">Shop</Link>
            <Link href="/about" className="text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">About</Link>
            <Link href="/journal" className="text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">Journal</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <MobileMenu />
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="text-2xl font-black tracking-tighter uppercase">
              STORE
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden sm:block p-2 hover:opacity-70 transition-opacity"
            >
              <span className="sr-only">{isSearchOpen ? 'Close Search' : 'Search'}</span>
              {isSearchOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              )}
            </button>
            
            {user ? (
              <Link href="/account" className="text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity hidden sm:block">
                Account
              </Link>
            ) : (
              <Link href="/login" className="text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity hidden sm:block">
                Sign In
              </Link>
            )}

            <button onClick={toggleCart} className="relative p-2 hover:opacity-70 transition-opacity group flex items-center">
              {/* Mobile Icon */}
              <div className="md:hidden relative">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                    {totalItems}
                  </span>
                )}
              </div>

              {/* Desktop Text */}
              <div className="hidden md:flex items-center">
                <span className="text-xs font-bold uppercase tracking-widest group-hover:hidden">Cart</span>
                <span className="text-xs font-bold uppercase tracking-widest hidden group-hover:inline">View</span>
                <span className="ml-1 text-xs font-bold">({totalItems})</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
}
