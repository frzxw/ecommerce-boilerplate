'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { X, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuContent = (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[999] transition-opacity"
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-full bg-white z-[1000] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex justify-between items-center border-b border-gray-100">
            <span className="text-xl font-bold uppercase tracking-tighter">Menu</span>
            <button onClick={toggleMenu} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-6">
            <nav className="flex flex-col space-y-6">
              <Link 
                href="/products" 
                className="text-lg font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
                onClick={toggleMenu}
              >
                Shop All
              </Link>
              <Link 
                href="/products?category=new" 
                className="text-lg font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
                onClick={toggleMenu}
              >
                New Arrivals
              </Link>
              <Link 
                href="/products?category=accessories" 
                className="text-lg font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
                onClick={toggleMenu}
              >
                Accessories
              </Link>
              <Link 
                href="/about" 
                className="text-lg font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link 
                href="/journal" 
                className="text-lg font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
                onClick={toggleMenu}
              >
                Journal
              </Link>
            </nav>
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50">
            {user ? (
              <div className="space-y-4">
                <Link 
                  href="/account" 
                  className="block text-sm font-bold uppercase tracking-widest hover:text-gray-600"
                  onClick={toggleMenu}
                >
                  My Account
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="block text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Link 
                  href="/login" 
                  className="block w-full py-3 bg-black text-white text-center text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                  onClick={toggleMenu}
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="block w-full py-3 border border-black text-center text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                  onClick={toggleMenu}
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button onClick={toggleMenu} className="md:hidden p-2 -ml-2">
        <Menu className="w-6 h-6" />
      </button>
      {mounted && createPortal(menuContent, document.body)}
    </>
  );
}
