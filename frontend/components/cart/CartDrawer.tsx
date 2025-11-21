'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { fetchAPI } from '@/lib/api';
import { Product } from '@/lib/types';

export function CartDrawer() {
  const { isCartOpen, toggleCart, items, removeItem, updateQuantity, subtotal } = useCart();
  const [mounted, setMounted] = useState(false);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    setMounted(true);
    // Fetch recommendations
    fetchAPI('/products')
      .then((data: Product[]) => {
        // Simple randomization or just take first few
        setRecommendations(data.slice(0, 2));
      })
      .catch(err => console.error('Failed to load recommendations', err));
  }, []);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!mounted) return null;

  const drawerContent = (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-50 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold uppercase tracking-tighter">Shopping Cart</h2>
          <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {items.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <p className="text-gray-500">Your cart is empty.</p>
                <button 
                  onClick={toggleCart}
                  className="text-black font-bold uppercase tracking-widest border-b border-black pb-1 hover:opacity-60 transition-opacity"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.variantId} className="flex gap-4">
                  <div className="relative h-24 w-20 bg-gray-100 shrink-0 overflow-hidden">
                    <Image
                      src={item.imageUrl || 'https://placehold.co/200x200/png'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-sm uppercase tracking-wide line-clamp-2">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.variantId)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.attributes && Object.values(item.attributes).join(' / ')}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border border-gray-200">
                        <button 
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-2 text-sm min-w-8 text-center font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recommendations Section */}
          {recommendations.length > 0 && (
            <div className="mt-12 pt-12 border-t border-gray-100">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6">You May Also Like</h3>
              <div className="space-y-6">
                {recommendations.map((product) => {
                  const defaultVariant = product.variants?.[0];
                  const price = defaultVariant ? Number(defaultVariant.price).toFixed(2) : 'N/A';
                  const imageUrl = defaultVariant?.imageUrl || 'https://placehold.co/200x200/png';
                  
                  return (
                    <Link 
                      key={product.id} 
                      href={`/products/${product.id}`}
                      onClick={toggleCart}
                      className="flex gap-4 group"
                    >
                      <div className="relative h-20 w-16 bg-gray-100 shrink-0 overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="font-bold text-xs uppercase tracking-wide group-hover:underline decoration-1 underline-offset-4 line-clamp-1">{product.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">${price}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Subtotal</span>
              <span className="text-xl font-black tracking-tight">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mb-6 text-center">
              Shipping and taxes calculated at checkout.
            </p>
            <Link 
              href="/checkout" 
              onClick={toggleCart}
              className="block w-full bg-black text-white text-center py-4 text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );

  return createPortal(drawerContent, document.body);
}
