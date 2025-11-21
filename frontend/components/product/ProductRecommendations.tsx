'use client';

import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ui/ProductCard';
import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';

interface ProductRecommendationsProps {
  currentProductId: string;
  categoryId: string;
}

export function ProductRecommendations({ currentProductId, categoryId }: ProductRecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Fetch all products for now (in real app, filter by category)
        const data = await fetchAPI('/products');
        // Filter out current product and take 4
        const related = data
          .filter((p: Product) => p.id !== currentProductId)
          .slice(0, 4);
        setProducts(related);
      } catch (error) {
        console.error('Failed to fetch recommendations', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProductId, categoryId]);

  if (loading) return null;
  if (products.length === 0) return null;
  
  return (
    <div className="border-t border-gray-200 pt-16 mt-16">
      <h2 className="text-2xl font-bold uppercase tracking-tighter mb-8">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
