'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';

import { Product } from '@/lib/types';

interface WishlistButtonProps {
  productId: string;
  initialIsWishlisted?: boolean;
}

export function WishlistButton({ productId, initialIsWishlisted = false }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);

  // Check if item is in wishlist on mount if user is logged in
  useEffect(() => {
    if (user && token) {
      fetchAPI('/wishlist', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((items: Product[]) => {
          const exists = items.some((item) => item.id === productId);
          setIsWishlisted(exists);
        })
        .catch((err) => console.error('Failed to check wishlist status', err));
    }
  }, [user, token, productId]);

  const toggleWishlist = async () => {
    if (!user || !token) {
      alert('Please login to add to wishlist');
      return;
    }

    setLoading(true);
    try {
      const response = await fetchAPI('/wishlist', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ productId }),
      });
      
      setIsWishlisted(response.added);
    } catch (error) {
      console.error('Failed to toggle wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className="p-2 group flex items-center justify-center transition-transform active:scale-95"
      aria-label="Add to wishlist"
    >
      <Heart
        className={`w-6 h-6 transition-all duration-300 ${
          isWishlisted 
            ? 'fill-red-500 text-red-500' 
            : 'text-black group-hover:fill-white'
        }`}
      />
    </button>
  );
}
