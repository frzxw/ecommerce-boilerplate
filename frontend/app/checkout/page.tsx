'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { Navbar } from '@/components/ui/Navbar';

export default function CheckoutPage() {
  const { user, isLoading, token } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [address, setAddress] = useState({
    recipientName: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('MIDTRANS');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4 uppercase tracking-widest">Your cart is empty</h1>
          <button 
            onClick={() => router.push('/products')}
            className="text-black underline hover:no-underline uppercase tracking-widest text-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        items: items.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: address,
        totalAmount: subtotal,
        paymentMethod,
      };

      await fetchAPI('/orders', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      clearCart();
      router.push('/checkout/success');
    } catch (error) {
      console.error('Failed to place order', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-12">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Shipping Form */}
          <div className="lg:col-span-7">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Shipping Address</h2>
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Full Name</label>
                <input
                  type="text"
                  required
                  value={address.recipientName}
                  onChange={(e) => setAddress({ ...address, recipientName: e.target.value })}
                  className="block w-full border-b border-gray-300 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none transition-colors bg-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={address.phoneNumber}
                  onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                  className="block w-full border-b border-gray-300 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none transition-colors bg-transparent"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Street Address</label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="block w-full border-b border-gray-300 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none transition-colors bg-transparent"
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">City</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="block w-full border-b border-gray-300 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none transition-colors bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">State</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="block w-full border-b border-gray-300 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none transition-colors bg-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    className="block w-full border-b border-gray-300 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none transition-colors bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Country</label>
                  <input
                    type="text"
                    required
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="block w-full border-b border-gray-300 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none transition-colors bg-transparent"
                  />
                </div>
              </div>
            </form>

            {/* Payment Method */}
            <div className="mt-12">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Payment Method</h2>
              <div className="space-y-4">
                <label className="flex items-center space-x-4 p-4 border border-gray-200 cursor-pointer hover:border-black transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="MIDTRANS"
                    checked={paymentMethod === 'MIDTRANS'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-black focus:ring-black"
                  />
                  <span className="font-bold uppercase tracking-wide text-sm">Bank Transfer (Midtrans)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-50 p-8 sticky top-24">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Order Summary</h2>
              <div className="space-y-6 mb-8">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex flex-col">
                      <span className="font-bold uppercase tracking-wide">{item.name}</span>
                      <span className="text-gray-500 text-xs">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-6 flex justify-between items-end mb-8">
                <span className="text-sm font-bold uppercase tracking-widest">Total</span>
                <span className="text-2xl font-bold tracking-tighter">${subtotal.toFixed(2)}</span>
              </div>
              
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
