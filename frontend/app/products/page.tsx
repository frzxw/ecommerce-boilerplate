'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchAPI } from '@/lib/api';
import { Product } from '@/lib/types';
import ProductFilters from '@/components/products/ProductFilters';
import { ProductCard } from '@/components/ui/ProductCard';

interface Category {
  id: string;
  name: string;
  slug: string;
}

import { Navbar } from '@/components/ui/Navbar';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter State
  const categoryId = searchParams.get('categoryId');
  const searchQuery = searchParams.get('search') || '';
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || 1000;
  const inStock = searchParams.get('inStock') === 'true';

  // Fetch Categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchAPI('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories', error);
      }
    };
    loadCategories();
  }, []);

  // Fetch Products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (categoryId) params.append('categoryId', categoryId);
        if (searchQuery) params.append('search', searchQuery);
        if (minPrice > 0) params.append('minPrice', minPrice.toString());
        if (maxPrice < 1000) params.append('maxPrice', maxPrice.toString());
        if (inStock) params.append('inStock', 'true');

        const data = await fetchAPI(`/products?${params.toString()}`);
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [categoryId, searchQuery, minPrice, maxPrice, inStock]);

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Page Header */}
      <div className="bg-zinc-50 pt-32 pb-16 px-4 border-b border-gray-100">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            {categoryId
              ? categories.find(c => c.id === categoryId)?.name || 'Collection'
              : 'All Products'}
          </h1>
          <p className="text-gray-500 max-w-xl text-lg">
            Explore our curated collection of premium essentials, designed for modern living.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Mobile Filter Toggle */}
          <button
            className="md:hidden w-full py-4 bg-black text-white text-sm font-bold uppercase tracking-widest mb-4 flex justify-between px-6 items-center"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <span>Filters</span>
            <span>{isFilterOpen ? '-' : '+'}</span>
          </button>

          {/* Sidebar */}
          <aside className={`w-full md:w-64 shrink-0 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="sticky top-32">
              <ProductFilters
                categories={categories}
                selectedCategory={categoryId}
                onSelectCategory={(id) => updateFilters({ categoryId: id })}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onPriceChange={(min, max) => updateFilters({ minPrice: min.toString(), maxPrice: max.toString() })}
                inStockOnly={inStock}
                onInStockChange={(checked) => updateFilters({ inStock: checked ? 'true' : null })}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-100 gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Showing {products.length} Results
              </span>

              <div className="w-full sm:w-auto relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => updateFilters({ search: e.target.value || null })}
                  className="w-full sm:w-64 border-b border-gray-200 py-2 text-sm focus:border-black outline-none bg-transparent placeholder-gray-400"
                />
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-100 aspect-[0.75] w-full mb-4"></div>
                    <div className="h-4 bg-gray-100 w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-100 w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-gray-50">
                <p className="text-xl font-medium mb-2">No products found</p>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search query.</p>
                <button
                  onClick={() => router.push('/products')}
                  className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:opacity-60 transition-opacity"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
