'use client';

import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onPriceChange,
}: ProductFiltersProps) {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  const handleApplyPrice = () => {
    onPriceChange(localMin, localMax);
  };

  return (
    <div className="space-y-10">
      {/* Categories */}
      <div>
        <h3 className="font-bold text-xs uppercase tracking-widest mb-6 pb-2 border-b border-gray-100">Categories</h3>
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => onSelectCategory(null)}
              className={`text-sm transition-all duration-200 flex items-center gap-2 ${
                selectedCategory === null 
                  ? 'text-black font-bold translate-x-1' 
                  : 'text-gray-500 hover:text-black hover:translate-x-1'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${selectedCategory === null ? 'bg-black' : 'bg-transparent border border-gray-300'}`}></span>
              All Products
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => onSelectCategory(category.id)}
                className={`text-sm transition-all duration-200 flex items-center gap-2 ${
                  selectedCategory === category.id 
                    ? 'text-black font-bold translate-x-1' 
                    : 'text-gray-500 hover:text-black hover:translate-x-1'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${selectedCategory === category.id ? 'bg-black' : 'bg-transparent border border-gray-300'}`}></span>
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="font-bold text-xs uppercase tracking-widest mb-6 pb-2 border-b border-gray-100">Price Range</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Min</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900 text-sm font-medium">$</span>
                <input
                  type="number"
                  value={localMin}
                  onChange={(e) => setLocalMin(Number(e.target.value))}
                  className="w-full pl-6 pr-3 py-2.5 text-sm bg-gray-50 border-none focus:ring-1 focus:ring-black transition-all"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Max</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900 text-sm font-medium">$</span>
                <input
                  type="number"
                  value={localMax}
                  onChange={(e) => setLocalMax(Number(e.target.value))}
                  className="w-full pl-6 pr-3 py-2.5 text-sm bg-gray-50 border-none focus:ring-1 focus:ring-black transition-all"
                  placeholder="1000"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleApplyPrice}
            className="w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
          >
            Update Price
          </button>
        </div>
      </div>
    </div>
  );
}
