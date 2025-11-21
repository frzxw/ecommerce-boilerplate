'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/ui/Navbar';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ui/ProductCard';
import { fetchAPI } from '@/lib/api';
import Link from 'next/link';

interface OrderItem {
  id: string;
  quantity: number;
}

interface Order {
  id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

export default function AccountPage() {
  const { user, isLoading, logout, token } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !token) return;
      
      setIsLoadingData(true);
      try {
        if (activeTab === 'orders') {
          const ordersData = await fetchAPI('/orders', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setOrders(ordersData);
        } else {
          const wishlistData = await fetchAPI('/wishlist', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setWishlist(wishlistData);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [user, token, activeTab]);

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-2">My Account</h1>
        <p className="text-gray-500 mb-12">Welcome back, {user.name}</p>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar / Tabs */}
          <div className="w-full md:w-64 shrink-0">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`text-left px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${
                  activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-100'
                }`}
              >
                Order History
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`text-left px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${
                  activeTab === 'wishlist' ? 'bg-black text-white' : 'hover:bg-gray-100'
                }`}
              >
                Wishlist
              </button>
              <button
                className="text-left px-4 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-100 text-red-500 mt-8"
                onClick={logout}
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="grow">
            {isLoadingData ? (
              <div>Loading data...</div>
            ) : activeTab === 'orders' ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold uppercase tracking-tighter mb-6">Order History</h2>
                {orders.length === 0 ? (
                  <p>No orders found.</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 p-6 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-sm">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500 mt-1">{order.items.length} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${Number(order.totalAmount).toFixed(2)}</p>
                        <span className="inline-block px-2 py-1 bg-gray-100 text-xs font-bold uppercase tracking-wider mt-1">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold uppercase tracking-tighter mb-6">My Wishlist</h2>
                {wishlist.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50">
                    <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
                    <Link href="/products" className="underline font-bold uppercase text-xs tracking-widest">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
