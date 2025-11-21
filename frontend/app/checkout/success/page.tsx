'use client';

import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 bg-white">
        <div className="mb-8">
          <div className="w-24 h-24 border-2 border-black rounded-full flex items-center justify-center mx-auto">
            <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-4">Order Confirmed</h1>
        <p className="text-gray-500 mb-12 max-w-md text-sm leading-relaxed">
          Thank you for your purchase. Your order has been received and is being processed. You will receive an email confirmation shortly.
        </p>
        <Link href="/products" className="bg-black text-white px-12 py-4 text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
