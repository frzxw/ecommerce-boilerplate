'use client';

import { useState } from 'react';
import { Product, ProductVariant } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { ProductGallery } from './ProductGallery';
import { WishlistButton } from './WishlistButton';
import { ReviewsSection } from './ReviewsSection';
import { ProductRecommendations } from './ProductRecommendations';
import { AccordionItem } from '@/components/ui/Accordion';

interface ProductViewProps {
  product: Product;
}

export function ProductView({ product }: ProductViewProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  const variants = product.variants || [];

  const price = selectedVariant
    ? Number(selectedVariant.price).toFixed(2)
    : 'N/A';



  return (
    <div className="space-y-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        {/* Image Gallery Section */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images || []}
            variants={variants}
            selectedVariant={selectedVariant}
            onVariantSelect={setSelectedVariant}
            productName={product.name}
          />
        </div>

        {/* Product Info Section */}
        <div className="lg:col-span-5">
          <div className="sticky top-32">
            <div className="mb-8 border-b border-gray-200 pb-8">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase mb-4">
                  {product.name}
                </h1>
                <WishlistButton productId={product.id} />
              </div>
              <div className="text-xl font-medium text-gray-900">
                ${price}
              </div>
            </div>

            {/* Variant Selectors */}
            {variants.length > 1 && (
              <div className="mb-10">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 text-gray-500">
                  Select Option
                </label>
                <div className="flex flex-wrap gap-3">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`min-w-12 px-4 py-3 text-xs font-bold uppercase tracking-wider border transition-all ${selectedVariant?.id === variant.id
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 text-gray-900 hover:border-black'
                        }`}
                    >
                      {variant.attributes && typeof variant.attributes === 'object'
                        ? Object.values(variant.attributes).join(' / ')
                        : variant.sku}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-6">
              <button
                className="w-full bg-black text-white py-5 text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedVariant || selectedVariant.stock === 0}
                onClick={() => selectedVariant && addItem(product, selectedVariant)}
              >
                {selectedVariant && selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <div className="pt-8 border-t border-gray-200">
                <AccordionItem title="Description" defaultOpen>
                  <p className="mb-4">{product.description}</p>
                  <p>Designed for the modern individual, this piece combines timeless aesthetics with contemporary functionality. Crafted with attention to detail and quality materials to ensure longevity and style.</p>
                </AccordionItem>

                <AccordionItem title="Size & Fit">
                  <p className="mb-4 whitespace-pre-line">{product.sizeAndFit || 'Size and fit information not available.'}</p>
                </AccordionItem>

                <AccordionItem title="Shipping & Returns">
                  <p className="mb-2"><strong>Shipping:</strong> Free standard shipping on all orders over $100. International shipping available.</p>
                  <p><strong>Returns:</strong> We accept returns within 30 days of delivery. Items must be unworn and in original condition with tags attached.</p>
                </AccordionItem>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewsSection reviews={product.reviews || []} />

      <ProductRecommendations currentProductId={product.id} categoryId={product.categoryId} />
    </div>
  );
}
